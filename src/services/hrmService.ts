import { EmployeeRecord, HrmQueryFilter, CreateEmployeePayload } from "@/types/hrm";
import { initialEmployeesData } from "@/lib/services/hrm.service";
import { apiFetch, apiList } from "./apiClient";

export class HrmService {
  /**
   * Fetch employees with search & filtering
   */
  static async getEmployees(params?: HrmQueryFilter): Promise<{ data: EmployeeRecord[]; total: number }> {
    const fallback = () => {
      let list = [...initialEmployeesData];
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.department.toLowerCase().includes(q) ||
            e.designation.toLowerCase().includes(q)
        );
      }
      if (params?.department) {
        list = list.filter((e) => e.department.toLowerCase() === params.department?.toLowerCase());
      }
      if (params?.status) {
        list = list.filter((e) => e.status.toLowerCase() === params.status?.toLowerCase());
      }
      return {
        data: list,
        total: 50,
      };
    };

    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.department) searchParams.set("department", params.department);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";

    return apiList<EmployeeRecord>(
      `/hrm/employees/${qs}`,
      { method: "GET" },
      fallback
    );
  }

  /**
   * Add new employee
   */
  static async createEmployee(payload: CreateEmployeePayload): Promise<EmployeeRecord> {
    const fallbackEmp: EmployeeRecord = {
      id: `emp-${Date.now()}`,
      index: "14",
      name: payload.name,
      avatar: "/image.png",
      department: payload.department,
      designation: payload.designation,
      checkIn: "09:00 AM",
      checkOut: "05:00 PM",
      status: payload.status || "Present",
    };

    return apiFetch<EmployeeRecord>(
      "/hrm/employees/",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      fallbackEmp
    );
  }
}
