export * from "./auth";

export type TResponse<T> = {
  success: boolean;
  message?: string;
  result?: T;
};
