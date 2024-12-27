export interface RoomAuthorizationAccount {
  id: number;
  room_id: number;
  cmuitaccount: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface RoomAuthorizationAccountCreateModel {
  room_id: number;
  cmuitaccount: string;
}
