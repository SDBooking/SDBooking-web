import { coreApi } from "../../../core/connections";
import { TResponseOK } from "../../../types";
import { RoomAuthorizationAccount } from "../../../types/room_authorization_account";
import { ApiRouteKey } from "../../constants/keys";

export function GetAllRoomAuthorizationAccounts(): Promise<
  TResponseOK<RoomAuthorizationAccount>
> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.RoomAuthorizationAccount}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetRoomAuthorizationAccountsByRoomID(
  roomID: string
): Promise<TResponseOK<RoomAuthorizationAccount>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.RoomAuthorizationAccount}/room/${roomID}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
