import { coreApi } from "../../../../core/connections";
import { TResponse } from "../../../../types";
import { SystemRole } from "../../../../types/sys_role";
import { ApiRouteKey } from "../../../constants/keys";

export function CreateSystemRole(
  systemRole: SystemRole
): Promise<TResponse<SystemRole>> {
  return new Promise((resolve, reject) => {
    coreApi
      .post(`${ApiRouteKey.SystemRole}/`, systemRole)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function UpdateSystemRole(
  systemRole: SystemRole
): Promise<TResponse<SystemRole>> {
  return new Promise((resolve, reject) => {
    coreApi
      .put(`${ApiRouteKey.SystemRole}/${systemRole.id}`, systemRole)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function DeleteSystemRole(id: number): Promise<TResponse<SystemRole>> {
  return new Promise((resolve, reject) => {
    coreApi
      .delete(`${ApiRouteKey.SystemRole}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
