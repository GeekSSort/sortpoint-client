import { SystemUserRecord, UserQueryFilter, CreateUserPayload } from "@/types/roles";

export const initialSystemUsersData: SystemUserRecord[] = [
  {
    id: "usr-1",
    index: "01",
    name: "Ahmed Rahman",
    avatar: "/image.png",
    phone: "+880 1712-456 890",
    mail: "info@abctraders.com",
    role: "CEO",
    lastLogin: "Today, 10:30 AM",
    status: "Active",
  },
  {
    id: "usr-2",
    index: "02",
    name: "Hasan Mahmud",
    avatar: "/image.png",
    phone: "+880 1712-456 890",
    mail: "info@abctraders.com",
    role: "GM",
    lastLogin: "Today, 10:30 AM",
    status: "Inactive",
  },
  {
    id: "usr-3",
    index: "03",
    name: "Imran Hossain",
    avatar: "/image.png",
    phone: "+880 1712-456 890",
    mail: "info@abctraders.com",
    role: "Manager",
    lastLogin: "Today, 10:30 AM",
    status: "Active",
  },
  {
    id: "usr-4",
    index: "04",
    name: "Hasan Mahmud",
    avatar: "/image.png",
    phone: "+880 1712-456 890",
    mail: "info@abctraders.com",
    role: "Branch Manager",
    lastLogin: "Today, 10:30 AM",
    status: "Active",
  },
  {
    id: "usr-5",
    index: "04",
    name: "Imran Hossain",
    avatar: "/image.png",
    phone: "+880 1712-456 890",
    mail: "info@abctraders.com",
    role: "Cashier",
    lastLogin: "Today, 10:30 AM",
    status: "Active",
  },
  {
    id: "usr-6",
    index: "06",
    name: "Hasan Mahmud",
    avatar: "/image.png",
    phone: "+880 1712-456 890",
    mail: "info@abctraders.com",
    role: "HR",
    lastLogin: "Today, 10:30 AM",
    status: "Inactive",
  },
  {
    id: "usr-7",
    index: "07",
    name: "Ahmed Rahman",
    avatar: "/image.png",
    phone: "+880 1712-456 890",
    mail: "info@abctraders.com",
    role: "Technical",
    lastLogin: "Today, 10:30 AM",
    status: "Active",
  },
  {
    id: "usr-8",
    index: "08",
    name: "Imran Hossain",
    avatar: "/image.png",
    phone: "+880 1712-456 890",
    mail: "info@abctraders.com",
    role: "Cashier",
    lastLogin: "Today, 10:30 AM",
    status: "Active",
  },
  {
    id: "usr-9",
    index: "09",
    name: "Ahmed Rahman",
    avatar: "/image.png",
    phone: "+880 1712-456 890",
    mail: "info@abctraders.com",
    role: "Branch Manager",
    lastLogin: "Today, 10:30 AM",
    status: "Active",
  },
  {
    id: "usr-10",
    index: "10",
    name: "Hasan Mahmud",
    avatar: "/image.png",
    phone: "+880 1712-456 890",
    mail: "info@abctraders.com",
    role: "Cashier",
    lastLogin: "Today, 10:30 AM",
    status: "Active",
  },
  {
    id: "usr-11",
    index: "11",
    name: "Imran Hossain",
    avatar: "/image.png",
    phone: "+880 1712-456 890",
    mail: "info@abctraders.com",
    role: "Cashier",
    lastLogin: "Today, 10:30 AM",
    status: "Active",
  },
  {
    id: "usr-12",
    index: "12",
    name: "Hasan Mahmud",
    avatar: "/image.png",
    phone: "+880 1712-456 890",
    mail: "info@abctraders.com",
    role: "Branch Manager",
    lastLogin: "Today, 10:30 AM",
    status: "Inactive",
  },
  {
    id: "usr-13",
    index: "13",
    name: "Imran Hossain",
    avatar: "/image.png",
    phone: "+880 1712-456 890",
    mail: "info@abctraders.com",
    role: "Manager",
    lastLogin: "Today, 10:30 AM",
    status: "Active",
  },
];

export class RolesService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

  /**
   * Fetch users & roles with search & filter
   */
  static async getUsers(params?: UserQueryFilter): Promise<{ data: SystemUserRecord[]; total: number }> {
    let list = [...initialSystemUsersData];

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.phone.includes(q) ||
          u.mail.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
      );
    }

    if (params?.role) {
      list = list.filter((u) => u.role.toLowerCase() === params.role?.toLowerCase());
    }

    if (params?.status) {
      list = list.filter((u) => u.status.toLowerCase() === params.status?.toLowerCase());
    }

    return Promise.resolve({
      data: list,
      total: 50,
    });
  }

  /**
   * Create new user and assign role
   */
  static async createUser(payload: CreateUserPayload): Promise<SystemUserRecord> {
    const newUser: SystemUserRecord = {
      id: `usr-${Date.now()}`,
      index: "14",
      name: payload.name,
      avatar: "/image.png",
      phone: payload.phone,
      mail: payload.mail,
      role: payload.role,
      lastLogin: "Just now",
      status: payload.status || "Active",
    };
    return Promise.resolve(newUser);
  }
}

