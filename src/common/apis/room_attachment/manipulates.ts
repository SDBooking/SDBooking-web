import { coreApi } from "../../../core/connections";
import { ApiRouteKey } from "../../constants/keys";

export function CreateRoomAttachment(payload: {
  file: File;
  room_id: number;
  position: number;
}) {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("room_id", payload.room_id.toString());
  formData.append("position", payload.position.toString());
  return new Promise((resolve, reject) => {
    coreApi
      .post(`${ApiRouteKey.RoomAttachment}`, formData)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function UpdateRoomAttachmentPosition(payload: {
  id: number;
  position: string;
}) {
  const formData = new FormData();
  formData.append("position", payload.position);
  return new Promise((resolve, reject) => {
    coreApi
      .put(`${ApiRouteKey.RoomAttachment}/${payload.id}`, formData)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function DeleteRoomAttachment(id: number) {
  return new Promise((resolve, reject) => {
    coreApi
      .delete(`${ApiRouteKey.RoomAttachment}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
