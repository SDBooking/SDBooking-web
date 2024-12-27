import { coreApi } from "../../../../core/connections";
import { TResponseOK } from "../../../../types";
import { SystemRole } from "../../../../types/sys_role";
import { ApiRouteKey } from "../../../constants/keys";

export function GetAllSystemRoles(): Promise<TResponseOK<SystemRole>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.SystemRole}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetSystemRoleByID(
  id: string
): Promise<TResponseOK<SystemRole>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.SystemRole}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
