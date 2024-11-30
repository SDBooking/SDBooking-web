import { coreApi } from "../../../core/connections";
import { Role, TResponse, User } from "../../../types";
import { ApiRouteKey } from "../../constants/keys";

export function ApproveStudent(cmuitaccount: string): Promise<TResponse<User>> {
  return new Promise((resolve, reject) => {
    coreApi
      .put(`${ApiRouteKey.Account}/studentrequests/approve/${cmuitaccount}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function UpdateAccountRole(
  cmuitaccount: string,
  role: Role
): Promise<TResponse<User>> {
  return new Promise((resolve, reject) => {
    coreApi
      .put(`${ApiRouteKey.Account}/${cmuitaccount}/${role}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
