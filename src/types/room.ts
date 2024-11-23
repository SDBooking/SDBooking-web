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
  openTime?: string;
  closeTime?: string;
  createdAt: Date;
  updatedAt: Date;
}
