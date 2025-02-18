import { ApiRouteKey } from "../constants/keys";
import { coreApi } from "../../core/connections";
import { nil } from "tsdef";

export function getLogout(): Promise<nil> {
  return new Promise((resolve, reject) => {
    coreApi
      .post(ApiRouteKey.SignOut)
      .then(() => {
        window.location.href = CMU_OAUTH_LOGOUT_URL;
        resolve(null);
      })
      .catch(reject);
  });
}
