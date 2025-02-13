export interface RoomAttachmentModel {
  id?: number;
  room_id: number;
  title: string;
  path: string;
  position: number;
  is_active: boolean;
}
