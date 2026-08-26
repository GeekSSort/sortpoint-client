export interface SystemUserRecord {
  id: string;
  index: string;
  name: string;
  avatar: string;
  phone: string;
  mail: string;
  role: string;
  lastLogin: string;
  status: "Active" | "Inactive";
}

export interface UserQueryFilter {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateUserPayload {
  name: string;
  phone: string;
  mail: string;
  role: string;
  status?: "Active" | "Inactive";
}

