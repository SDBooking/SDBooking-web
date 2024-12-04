import { Role } from "./auth";

export interface RoomAuthorizationModel {
  id: number;
  room_id: number;
  role: Role;
  is_allowed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RoomAuthorizationCreateModel {
  room_id: number;
  role: Role;
  is_allowed: boolean;
}
