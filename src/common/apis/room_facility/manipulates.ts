import { coreApi } from "../../../core/connections";
import { TResponseOK } from "../../../types";
import {
  RoomFacilityCreateModel,
  RoomFacilityDTO,
} from "../../../types/room_facility";
import { ApiRouteKey } from "../../constants/keys";

export function CreateRoomFacility(
  RoomFacility: RoomFacilityCreateModel
): Promise<TResponseOK<RoomFacilityDTO>> {
  return new Promise((resolve, reject) => {
    coreApi
      .post(`${ApiRouteKey.RoomFacility}/`, RoomFacility)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function UpdateRoomFacility(
  RoomFacility: RoomFacilityDTO
): Promise<TResponseOK<RoomFacilityDTO>> {
  return new Promise((resolve, reject) => {
    coreApi
      .put(`${ApiRouteKey.RoomFacility}/${RoomFacility.id}`, RoomFacility)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function DeleteRoomFacility(
  id: number
): Promise<TResponseOK<RoomFacilityDTO>> {
  return new Promise((resolve, reject) => {
    coreApi
      .delete(`${ApiRouteKey.RoomFacility}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
