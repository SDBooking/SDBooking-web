export type TUser = {
  account: string;
  student_id: string;
  prename_th: string;
  firstname_th: string;
  lastname_th: string;
  prename_en: string;
  firstname_en: string;
  lastname_en: string;
  organization_name: string;
  acc_type: "MISEmpAcc" | "StdAcc";
  is_admin: boolean;
};
