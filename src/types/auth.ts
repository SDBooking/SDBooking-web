export type Account = {
  userData: User;
  isAdmin: boolean;
};

export type Role = "STUDENT" | "EMPLOYEE" | "ADMIN";

export type User = {
  cmuitaccount: string;
  prename?: string;
  firstname: string;
  lastname: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
};
