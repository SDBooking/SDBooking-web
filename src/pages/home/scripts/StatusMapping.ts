const statusMapping: { [key: string]: string } = {
  PENDING: "รอดำเนินการ",
  APPROVED: "อนุมัติ",
  DISCARDED: "ไม่อนุมัติ",
  REJECTED: "รอการแก้ไข",
};

export function getStatusInThai(status: string): string {
  return statusMapping[status] || "สถานะไม่ทราบ";
}
