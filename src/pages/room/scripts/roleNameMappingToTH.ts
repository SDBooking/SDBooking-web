export const roleNameMappingToTH = (role: string): string => {
  const roleMapping: { [key: string]: string } = {
    ADMIN: "ผู้ดูแลระบบ",
    STUDENT: "นักศึกษา",
    EMPLOYEE: "บุคลากร",
  };

  return roleMapping[role] || role;
};
