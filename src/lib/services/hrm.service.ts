import { EmployeeRecord, HrmQueryFilter, CreateEmployeePayload } from "@/types/hrm";

export const initialEmployeesData: EmployeeRecord[] = [
  {
    id: "emp-1",
    index: "01",
    name: "Ahmed Rahman",
    avatar: "/image.png",
    department: "Management",
    designation: "General Manager",
    checkIn: "09:02 AM",
    checkOut: "05:58 PM",
    status: "Present",
  },
  {
    id: "emp-2",
    index: "02",
    name: "Hasan Mahmud",
    avatar: "/image.png",
    department: "HR",
    designation: "HR Manager",
    checkIn: "09:02 AM",
    checkOut: "09:02 AM",
    status: "On Leave",
  },
  {
    id: "emp-3",
    index: "03",
    name: "Imran Hossain",
    avatar: "/image.png",
    department: "Sales",
    designation: "Sales Executive",
    checkIn: "09:02 AM",
    checkOut: "09:02 AM",
    status: "Present",
  },
  {
    id: "emp-4",
    index: "04",
    name: "Hasan Mahmud",
    avatar: "/image.png",
    department: "Accounts",
    designation: "Accountant",
    checkIn: "09:02 AM",
    checkOut: "09:02 AM",
    status: "Present",
  },
  {
    id: "emp-5",
    index: "04",
    name: "Imran Hossain",
    avatar: "/image.png",
    department: "IT",
    designation: "IT Executive",
    checkIn: "09:02 AM",
    checkOut: "09:02 AM",
    status: "Absent",
  },
  {
    id: "emp-6",
    index: "06",
    name: "Hasan Mahmud",
    avatar: "/image.png",
    department: "Management",
    designation: "HR Executive",
    checkIn: "09:02 AM",
    checkOut: "09:02 AM",
    status: "On Leave",
  },
  {
    id: "emp-7",
    index: "07",
    name: "Ahmed Rahman",
    avatar: "/image.png",
    department: "HR",
    designation: "Store Incharge",
    checkIn: "09:02 AM",
    checkOut: "09:02 AM",
    status: "Absent",
  },
  {
    id: "emp-8",
    index: "08",
    name: "Imran Hossain",
    avatar: "/image.png",
    department: "IT",
    designation: "Purchase Officer",
    checkIn: "09:02 AM",
    checkOut: "09:02 AM",
    status: "Present",
  },
  {
    id: "emp-9",
    index: "09",
    name: "Ahmed Rahman",
    avatar: "/image.png",
    department: "Management",
    designation: "Sales Executive",
    checkIn: "09:02 AM",
    checkOut: "09:02 AM",
    status: "Present",
  },
  {
    id: "emp-10",
    index: "10",
    name: "Hasan Mahmud",
    avatar: "/image.png",
    department: "HR",
    designation: "IT Executive",
    checkIn: "09:02 AM",
    checkOut: "09:02 AM",
    status: "Present",
  },
  {
    id: "emp-11",
    index: "11",
    name: "Imran Hossain",
    avatar: "/image.png",
    department: "Accounts",
    designation: "Store Incharge",
    checkIn: "09:02 AM",
    checkOut: "09:02 AM",
    status: "Present",
  },
  {
    id: "emp-12",
    index: "12",
    name: "Hasan Mahmud",
    avatar: "/image.png",
    department: "HR",
    designation: "IT Executive",
    checkIn: "09:02 AM",
    checkOut: "09:02 AM",
    status: "Present",
  },
  {
    id: "emp-13",
    index: "13",
    name: "Imran Hossain",
    avatar: "/image.png",
    department: "Management",
    designation: "Sales Executive",
    checkIn: "09:02 AM",
    checkOut: "09:02 AM",
    status: "Present",
  },
];

export class HrmService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

  /**
   * Fetch employees with search & filtering
   */
  static async getEmployees(params?: HrmQueryFilter): Promise<{ data: EmployeeRecord[]; total: number }> {
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

    return Promise.resolve({
      data: list,
      total: 50,
    });
  }

  /**
   * Add new employee to backend DB
   */
  static async createEmployee(payload: CreateEmployeePayload): Promise<EmployeeRecord> {
    const newEmp: EmployeeRecord = {
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
    return Promise.resolve(newEmp);
  }
}

