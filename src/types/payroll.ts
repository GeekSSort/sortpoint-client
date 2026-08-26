export interface PayrollRecord {
  id: string;
  index: string;
  employee: {
    name: string;
    avatar: string;
  };
  basicSalary: number;
  basicSalaryFormatted: string;
  allowances: number;
  allowancesFormatted: string;
  deductions: number;
  deductionsFormatted: string;
  netSalary: number;
  netSalaryFormatted: string;
  status: "Paid" | "Pending";
}

export interface PayrollQueryFilter {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

