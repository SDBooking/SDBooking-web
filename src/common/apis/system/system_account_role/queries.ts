import { coreApi } from "../../../../core/connections";
import { TResponseOK } from "../../../../types";
import {
  SystemAccountRole,
  SystemAccountRoleDTO,
} from "../../../../types/sys_account_role";
import { ApiRouteKey } from "../../../constants/keys";

export function GetAllSystemAccountRoles(): Promise<
  TResponseOK<SystemAccountRole>
> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.SystemAccountRole}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetSystemAccountRoleByAccountID(
  cmuitaccount: string
): Promise<TResponseOK<SystemAccountRole>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.SystemAccountRole}/cmuitaccount/${cmuitaccount}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetSystemAccountRoleByID(
  id: string
): Promise<TResponseOK<SystemAccountRole>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.SystemAccountRole}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetSystemAccountRoleByRoleID(
  roleID: string
): Promise<TResponseOK<SystemAccountRoleDTO>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.SystemAccountRole}/role/${roleID}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
