export interface Branch {
  id: string;
  code: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive: boolean;
}

export interface CreateBranchPayload {
  code: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}
