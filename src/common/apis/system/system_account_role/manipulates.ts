import { coreApi } from "../../../../core/connections";
import { TResponse } from "../../../../types";
import { SystemAccountRole } from "../../../../types/sys_account_role";
import { ApiRouteKey } from "../../../constants/keys";

export function CreateSystemAccountRole(
  systemAccontRole: SystemAccountRole
): Promise<TResponse<SystemAccountRole>> {
  return new Promise((resolve, reject) => {
    coreApi
      .post(`${ApiRouteKey.SystemAccountRole}/`, systemAccontRole)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function UpdateSystemAccountRole(
  systemAccontRole: SystemAccountRole
): Promise<TResponse<SystemAccountRole>> {
  return new Promise((resolve, reject) => {
    coreApi
      .put(
        `${ApiRouteKey.SystemAccountRole}/${systemAccontRole.id}`,
        systemAccontRole
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function DeleteSystemAccountRole(
  id: number
): Promise<TResponse<SystemAccountRole>> {
  return new Promise((resolve, reject) => {
    coreApi
      .delete(`${ApiRouteKey.SystemAccountRole}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function DeleteSystemAccountRoleByRoleIDAndCMUITAccount(
  id: number,
  cmuitaccount: string
): Promise<TResponse<SystemAccountRole>> {
  return new Promise((resolve, reject) => {
    coreApi
      .delete(
        `${ApiRouteKey.SystemAccountRole}/role/${id}/cmuitaccount/${cmuitaccount}`
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
