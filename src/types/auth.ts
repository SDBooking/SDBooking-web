export type Account = {
  userData: User;
  isAdmin: boolean;
};

export type User = {
  cmuitaccount: string;
  prename?: string;
  firstname: string;
  lastname: string;
  role: string;
  created_at: Date;
  updated_at: Date;
};
