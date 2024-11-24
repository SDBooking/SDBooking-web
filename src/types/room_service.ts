export interface RoomServiceDTO {
  room_id: number;
  facility: string[];
}

export interface RoomServiceModel {
  id: number;
  facility_id: number;
  room_id: number;
}
export interface RoomServiceCreateModel {
  facility_id: number;
  room_id: number;
}
