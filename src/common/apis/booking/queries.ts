import { coreApi } from "../../../core/connections";
import { TResponse } from "../../../types";
import { Booking } from "../../../types/booking";
import { ApiRouteKey } from "../../constants/keys";

export function GetAllBooks(): Promise<TResponse<Booking>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.Booking}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetBookById(id: number): Promise<TResponse<Booking>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.Booking}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetBookByRoomId(id: number): Promise<TResponse<Booking>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.Booking}/room/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetBookByAccountId(id: string): Promise<TResponse<Booking>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.Booking}/account/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetBookByStatus(status: string): Promise<TResponse<Booking>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.Booking}/status/${status}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
