export interface SystemAccountRole {
  id?: number;
  account_id: string;
  role_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface SystemAccountRoleDTO {
  id: number;
  account_id: string;
  role_name: string;
  created_at?: string;
  updated_at?: string;
}
