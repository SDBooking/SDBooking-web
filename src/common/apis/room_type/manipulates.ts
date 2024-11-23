import { coreApi } from "../../../core/connections";
import { TResponseOK } from "../../../types";
import { RoomTypeCreateModel, RoomTypeDTO } from "../../../types/room_type";
import { ApiRouteKey } from "../../constants/keys";

export function CreateRoomType(
  RoomType: RoomTypeCreateModel
): Promise<TResponseOK<RoomTypeDTO>> {
  return new Promise((resolve, reject) => {
    coreApi
      .post(`${ApiRouteKey.RoomType}/`, RoomType)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function UpdateRoomType(
  RoomType: RoomTypeDTO
): Promise<TResponseOK<RoomTypeDTO>> {
  return new Promise((resolve, reject) => {
    coreApi
      .put(`${ApiRouteKey.RoomType}/${RoomType.id}`, RoomType)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function DeleteRoomType(id: number): Promise<TResponseOK<RoomTypeDTO>> {
  return new Promise((resolve, reject) => {
    coreApi
      .delete(`${ApiRouteKey.RoomType}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
