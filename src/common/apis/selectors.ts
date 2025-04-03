import { Account, TResponse } from "../../types";
import { getUserDataQuery } from "./auth/queries";

export async function getDataOrNull<T>(
  fn: () => Promise<TResponse<T>>
): Promise<T | null> {
  try {
    const result = await fn();
    return result.result ?? null;
  } catch {
    return null;
  }
}

export async function getUserDataQuerySelector() {
  const { result } = await getUserDataQuery();

  const userData: Account = {
    userData: result.userData,
    isAdmin: result.isAdmin,
  };

  return {
    userData,
  };
}
