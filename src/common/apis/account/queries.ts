import { coreApi } from "../../../core/connections";
import { TResponse, User } from "../../../types";
import { StudentRoleRequest } from "../../../types/student_request_role";
import { ApiRouteKey } from "../../constants/keys";

export function GetAllAccount(): Promise<TResponse<User>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.Account}/user`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetAllStudentRequests(): Promise<
  TResponse<StudentRoleRequest>
> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.Account}/studentrequests`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
