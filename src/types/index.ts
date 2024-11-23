export * from "./auth";

export type TResponse<T> = {
  success: boolean;
  message?: string;
  result?: T;
};

export type TResponseOK<T> = {
  success: boolean;
  message: string;
  result: T;
};
