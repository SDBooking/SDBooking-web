export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "DISCARDED";

export const BookingStatusList: BookingStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "DISCARDED",
];

export interface Booking {
  id: number;
  room_id: number;
  account_id: string;
  account_name: string;
  room_name: string;
  start_time: Date;
  end_time: Date;
  date: Date;
  title: string;
  tel: string;
  reason: string;
  status: BookingStatus;
  confirmed_by?: string;
  created_at: Date;
  updated_at: Date;
  reject_historys: BookingRejectTransaction[];
}

export interface BookingRejectTransaction {
  id: number;
  booking_id: number;
  reason: string;
  created_at: Date;
}

export interface BookingRejectTransactionCreateModel {
  booking_id: number;
  reason: string;
}

export interface BookingCreateModel {
  room_id: number;
  account_id: string;
  start_time: Date;
  end_time: Date;
  date: Date;
  title: string;
  tel: string;
  reason: string;
  status: BookingStatus;
  confirmed_by: string | null;
}

export interface BookingDTOModel {
  room_id: number;
  account_id: string;
  start_time: string;
  end_time: string;
  date: string;
  title: string;
  tel: string;
  reason: string;
  status: BookingStatus;
  confirmed_by: string | null;
}

export interface BookingUpdateModel {
  id: number;
  room_id: number;
  account_id: string;
  start_time: Date;
  end_time: Date;
  date: Date;
  title: string;
  tel: string;
  reason: string;
  status: BookingStatus;
  confirmed_by: string | null;
}

export interface BookingUpdateDTOModel {
  id: number;
  room_id: number;
  account_id: string;
  start_time: string;
  end_time: string;
  date: string;
  title: string;
  tel: string;
  reason: string;
  status: BookingStatus;
  confirmed_by: string | null;
}
