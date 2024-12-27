export interface RoomAuthorizationModel {
  id?: number;
  room_id: number;
  role_id: number;
  requires_confirmation: boolean | undefined;
  created_at?: string;
  updated_at?: string;
}

export interface RoomAuthorizationCreateModel {
  room_id: number;
  role_id: number;
  requires_confirmation: undefined | boolean;
}
