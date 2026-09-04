import { EmployeeRecord, HrmQueryFilter } from "@/types/hrm";
import { initialEmployeesData } from "@/lib/services/hrm.service";
import { apiFetch, apiList, ApiError, PagedResult } from "./apiClient";
import { AttendanceToday, toEmployeeRecord } from "./mappers/employee";
import { BranchService } from "./branchService";

/**
 * Employees, and what they did today.
 *
 * The list joins two resources: `/hrm/employees/` says who somebody is,
 * `/hrm/attendance/` says whether they are in. The server keeps them apart and
 * the table shows them together.
 */

export interface Lookup {
  id: string;
  name: string;
}

export class HrmService {
  /**
   * The employees table.
   *
   * Filtered and paged in the browser, because `/hrm/employees/` accepts only
   * `limit` and `page` — no search and no filters. Fetching the company in one
   * go is honest at this size and keeps search, filter and pager agreeing with
   * each other; a server-side search is the proper fix and is in the report.
   */
  static async getEmployees(params?: HrmQueryFilter): Promise<PagedResult<EmployeeRecord>> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 8;

    const [employees, attendance] = await Promise.all([
      apiList<any>(
        "/hrm/employees/?limit=500",
        { method: "GET" },
        { data: initialEmployeesData as any[], total: initialEmployeesData.length },
        (r) => r
      ),
      apiList<any>("/hrm/attendance/?limit=500", { method: "GET" }, { data: [], total: 0 }, (r) => r).catch(
        () => ({ data: [] as any[] })
      ),
    ]);

    // Already-mapped fallback rows: nothing to join.
    const mapped: EmployeeRecord[] = employees.data[0]?.status
      ? (employees.data as EmployeeRecord[])
      : (() => {
          const byEmployee = new Map<string, AttendanceToday>();
          for (const a of attendance.data || []) {
            const key = String(a?.employee ?? "");
            if (key) {
              byEmployee.set(key, { status: a?.status, checkIn: a?.checkIn, checkOut: a?.checkOut });
            }
          }
          return employees.data.map((row: any, i: number) =>
            toEmployeeRecord(row, i + 1, byEmployee.get(String(row?.id)))
          );
        })();

    const needle = params?.search?.trim().toLowerCase();
    const filtered = mapped.filter((e) => {
      if (params?.status && e.status.toLowerCase() !== params.status.toLowerCase()) return false;
      if (params?.department && e.department.toLowerCase() !== params.department.toLowerCase()) {
        return false;
      }
      if (!needle) return true;
      return (
        e.name.toLowerCase().includes(needle) ||
        e.department.toLowerCase().includes(needle) ||
        e.designation.toLowerCase().includes(needle)
      );
    });

    const offset = (page - 1) * limit;
    return {
      data: filtered.slice(offset, offset + limit),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
    };
  }

  /** Departments and designations, for the Add Employee form. */
  static async getLookups(): Promise<{ departments: Lookup[]; designations: Lookup[] }> {
    const [departments, designations] = await Promise.all([
      apiList<Lookup>("/hrm/departments/?limit=100", { method: "GET" }, { data: [], total: 0 }, (r: any) => ({
        id: String(r?.id ?? ""),
        name: String(r?.name ?? ""),
      })),
      apiList<Lookup>("/hrm/designations/?limit=100", { method: "GET" }, { data: [], total: 0 }, (r: any) => ({
        id: String(r?.id ?? ""),
        name: String(r?.name ?? ""),
      })),
    ]);
    return { departments: departments.data, designations: designations.data };
  }

  /**
   * Create an employee.
   *
   * The form collects a full name and typed department/designation; the API
   * wants first/last and ids. Names are resolved here — and created when they
   * are new — so the one place that knows the API shape is this file.
   */
  static async createEmployee(payload: {
    name: string;
    email: string;
    phone?: string;
    department: string;
    designation: string;
  }): Promise<EmployeeRecord> {
    const [first, ...rest] = payload.name.trim().split(/\s+/);
    const { departments, designations } = await HrmService.getLookups();

    const departmentId =
      findByName(departments, payload.department) ??
      (await createLookup("/hrm/departments/", { name: payload.department }));

    const designationId =
      findByName(designations, payload.designation) ??
      (await createLookup("/hrm/designations/", {
        name: payload.designation,
        department: departmentId,
      }));

    const branches = await BranchService.list();

    const row = await apiFetch<any>("/hrm/employees/", {
      method: "POST",
      body: JSON.stringify({
        first_name: first,
        // The API requires a last name; a single-word name repeats it rather
        // than failing validation in front of the person typing.
        last_name: rest.join(" ") || first,
        email: payload.email,
        phone: payload.phone || "",
        branch: branches[0]?.id,
        department: departmentId,
        designation: designationId,
        date_of_joining: new Date().toISOString().slice(0, 10),
      }),
    });
    return toEmployeeRecord(row, 1);
  }

  /**
   * Mark somebody in or out for today.
   *
   * `time` is "HH:MM" from the modal; without it the server stamps now.
   */
  static async clock(employeeId: string, direction: "in" | "out", time?: string): Promise<void> {
    const field = direction === "in" ? "check_in" : "check_out";
    await apiFetch(`/hrm/attendance/check-${direction}/`, {
      method: "POST",
      body: JSON.stringify({
        employee_id: employeeId,
        date: new Date().toISOString().slice(0, 10),
        ...(time ? { [field]: `${time}:00` } : {}),
      }),
    });
  }

  static async deactivate(employeeId: string): Promise<void> {
    await apiFetch(`/hrm/employees/${employeeId}/deactivate/`, { method: "POST", body: "{}" });
  }

  static describeError(error: unknown): string {
    if (error instanceof ApiError) {
      if (error.code === "PLAN_LIMIT_REACHED") return error.message;
      if (error.code === "NETWORK_ERROR") return "Cannot reach the server.";
      const field = Object.values(error.errors || {})[0];
      if (Array.isArray(field) && field.length) return String(field[0]);
      return error.message;
    }
    return "Something went wrong. Please try again.";
  }
}

function findByName(rows: Lookup[], name: string): string | undefined {
  const wanted = name.trim().toLowerCase();
  return rows.find((r) => r.name.trim().toLowerCase() === wanted)?.id;
}

async function createLookup(path: string, body: Record<string, unknown>): Promise<string> {
  const row = await apiFetch<any>(path, { method: "POST", body: JSON.stringify(body) });
  return String(row?.id ?? "");
}
