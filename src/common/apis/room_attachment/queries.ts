import { coreApi } from "../../../core/connections";
import { TResponse } from "../../../types";

import { RoomAttachmentModel } from "../../../types/room_attactment";
import { ApiRouteKey } from "../../constants/keys";

export function GetRoomAttachmentsByRoomID(
  id: number
): Promise<TResponse<RoomAttachmentModel>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.RoomAttachment}/room/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetAllRoomAttachments(): Promise<
  TResponse<RoomAttachmentModel>
> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.RoomAttachment}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
