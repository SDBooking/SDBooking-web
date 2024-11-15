export type Account = {
  userData: User;
};

export type User = {
  cmuitaccount: string;
  prename?: string;
  firstname: string;
  lastname: string;
  account_typ: string;
  organization: string;
  created_at: Date;
  updated_at: Date;
};
