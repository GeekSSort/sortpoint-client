import { PayrollRecord, PayrollQueryFilter } from "@/types/payroll";

export const initialPayrollData: PayrollRecord[] = [
  {
    id: "pay-1",
    index: "01",
    employee: { name: "Ahmed Rahman", avatar: "/image.png" },
    basicSalary: 12500,
    basicSalaryFormatted: "৳ 12,500",
    allowances: 13200,
    allowancesFormatted: "৳ 13,200",
    deductions: 15600,
    deductionsFormatted: "৳ 15,600",
    netSalary: 13200,
    netSalaryFormatted: "৳ 13,200",
    status: "Paid",
  },
  {
    id: "pay-2",
    index: "02",
    employee: { name: "Hasan Mahmud", avatar: "/image.png" },
    basicSalary: 13200,
    basicSalaryFormatted: "৳ 13,200",
    allowances: 13200,
    allowancesFormatted: "৳ 13,200",
    deductions: 12500,
    deductionsFormatted: "৳ 12,500",
    netSalary: 15600,
    netSalaryFormatted: "৳ 15,600",
    status: "Pending",
  },
  {
    id: "pay-3",
    index: "03",
    employee: { name: "Imran Hossain", avatar: "/image.png" },
    basicSalary: 15600,
    basicSalaryFormatted: "৳ 15,600",
    allowances: 15600,
    allowancesFormatted: "৳ 15,600",
    deductions: 13200,
    deductionsFormatted: "৳ 13,200",
    netSalary: 12500,
    netSalaryFormatted: "৳ 12,500",
    status: "Paid",
  },
  {
    id: "pay-4",
    index: "04",
    employee: { name: "Hasan Mahmud", avatar: "/image.png" },
    basicSalary: 12500,
    basicSalaryFormatted: "৳ 12,500",
    allowances: 12500,
    allowancesFormatted: "৳ 12,500",
    deductions: 12500,
    deductionsFormatted: "৳ 12,500",
    netSalary: 12500,
    netSalaryFormatted: "৳ 12,500",
    status: "Paid",
  },
  {
    id: "pay-5",
    index: "04",
    employee: { name: "Imran Hossain", avatar: "/image.png" },
    basicSalary: 15600,
    basicSalaryFormatted: "৳ 15,600",
    allowances: 15600,
    allowancesFormatted: "৳ 15,600",
    deductions: 15600,
    deductionsFormatted: "৳ 15,600",
    netSalary: 15600,
    netSalaryFormatted: "৳ 15,600",
    status: "Pending",
  },
  {
    id: "pay-6",
    index: "06",
    employee: { name: "Hasan Mahmud", avatar: "/image.png" },
    basicSalary: 12500,
    basicSalaryFormatted: "৳ 12,500",
    allowances: 12500,
    allowancesFormatted: "৳ 12,500",
    deductions: 12500,
    deductionsFormatted: "৳ 12,500",
    netSalary: 12500,
    netSalaryFormatted: "৳ 12,500",
    status: "Pending",
  },
  {
    id: "pay-7",
    index: "07",
    employee: { name: "Ahmed Rahman", avatar: "/image.png" },
    basicSalary: 15600,
    basicSalaryFormatted: "৳ 15,600",
    allowances: 15600,
    allowancesFormatted: "৳ 15,600",
    deductions: 15600,
    deductionsFormatted: "৳ 15,600",
    netSalary: 15600,
    netSalaryFormatted: "৳ 15,600",
    status: "Pending",
  },
  {
    id: "pay-8",
    index: "08",
    employee: { name: "Imran Hossain", avatar: "/image.png" },
    basicSalary: 15600,
    basicSalaryFormatted: "৳ 15,600",
    allowances: 12500,
    allowancesFormatted: "৳ 12,500",
    deductions: 15600,
    deductionsFormatted: "৳ 15,600",
    netSalary: 15600,
    netSalaryFormatted: "৳ 15,600",
    status: "Paid",
  },
  {
    id: "pay-9",
    index: "09",
    employee: { name: "Ahmed Rahman", avatar: "/image.png" },
    basicSalary: 12500,
    basicSalaryFormatted: "৳ 12,500",
    allowances: 15600,
    allowancesFormatted: "৳ 15,600",
    deductions: 12500,
    deductionsFormatted: "৳ 12,500",
    netSalary: 12500,
    netSalaryFormatted: "৳ 12,500",
    status: "Paid",
  },
  {
    id: "pay-10",
    index: "10",
    employee: { name: "Hasan Mahmud", avatar: "/image.png" },
    basicSalary: 13200,
    basicSalaryFormatted: "৳ 13,200",
    allowances: 12500,
    allowancesFormatted: "৳ 12,500",
    deductions: 13200,
    deductionsFormatted: "৳ 13,200",
    netSalary: 13200,
    netSalaryFormatted: "৳ 13,200",
    status: "Paid",
  },
  {
    id: "pay-11",
    index: "11",
    employee: { name: "Imran Hossain", avatar: "/image.png" },
    basicSalary: 15600,
    basicSalaryFormatted: "৳ 15,600",
    allowances: 15600,
    allowancesFormatted: "৳ 15,600",
    deductions: 15600,
    deductionsFormatted: "৳ 15,600",
    netSalary: 15600,
    netSalaryFormatted: "৳ 15,600",
    status: "Pending",
  },
  {
    id: "pay-12",
    index: "12",
    employee: { name: "Hasan Mahmud", avatar: "/image.png" },
    basicSalary: 13200,
    basicSalaryFormatted: "৳ 13,200",
    allowances: 13200,
    allowancesFormatted: "৳ 13,200",
    deductions: 13200,
    deductionsFormatted: "৳ 13,200",
    netSalary: 13200,
    netSalaryFormatted: "৳ 13,200",
    status: "Paid",
  },
  {
    id: "pay-13",
    index: "13",
    employee: { name: "Imran Hossain", avatar: "/image.png" },
    basicSalary: 12500,
    basicSalaryFormatted: "৳ 12,500",
    allowances: 12500,
    allowancesFormatted: "৳ 12,500",
    deductions: 12500,
    deductionsFormatted: "৳ 12,500",
    netSalary: 12500,
    netSalaryFormatted: "৳ 12,500",
    status: "Pending",
  },
];

export class PayrollService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

  /**
   * Fetch payroll data with search & filter
   */
  static async getPayroll(params?: PayrollQueryFilter): Promise<{ data: PayrollRecord[]; total: number }> {
    let list = [...initialPayrollData];

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.employee.name.toLowerCase().includes(q) ||
          p.status.toLowerCase().includes(q)
      );
    }

    if (params?.status) {
      list = list.filter((p) => p.status.toLowerCase() === params.status?.toLowerCase());
    }

    return Promise.resolve({
      data: list,
      total: 50,
    });
  }
}

