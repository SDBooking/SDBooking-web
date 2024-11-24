export interface Room {
  id: number;
  name: string;
  type: string;
  location: string;
  capacity: number;
  description?: string;
  requires_confirmation: boolean;
  activation: boolean;
  bookingIntervalMinutes?: number;
  open_time?: string;
  close_time?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface RoomModel {
  name: string;
  type_id: number;
  location_id: number;
  capacity: number;
  description?: string;
  requires_confirmation: boolean;
  activation: boolean;
  booking_interval_minutes?: number;
  open_time?: string;
  close_time?: string;
}
