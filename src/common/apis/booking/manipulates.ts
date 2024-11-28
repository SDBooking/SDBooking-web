import { coreApi } from "../../../core/connections";
import { TResponse } from "../../../types";
import {
  Booking,
  BookingDTOModel,
  BookingRejectTransactionCreateModel,
  BookingUpdateDTOModel,
} from "../../../types/booking";
import { ApiRouteKey } from "../../constants/keys";

export function CreateBook(room: BookingDTOModel): Promise<TResponse<Booking>> {
  return new Promise((resolve, reject) => {
    coreApi
      .post(`${ApiRouteKey.Booking}/`, room)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function CreateBookPending(
  room: BookingDTOModel
): Promise<TResponse<Booking>> {
  return new Promise((resolve, reject) => {
    coreApi
      .post(`${ApiRouteKey.Booking}/pending/`, room)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function UpdateBook(
  Book: BookingUpdateDTOModel
): Promise<TResponse<Booking>> {
  return new Promise((resolve, reject) => {
    coreApi
      .put(`${ApiRouteKey.Booking}/${Book.id}`, Book)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function DeleteBook(id: number): Promise<TResponse<Booking>> {
  return new Promise((resolve, reject) => {
    coreApi
      .delete(`${ApiRouteKey.Booking}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function ApproveBook(
  id: number,
  acc: string
): Promise<TResponse<Booking>> {
  return new Promise((resolve, reject) => {
    coreApi
      .put(`${ApiRouteKey.Booking}/approve/${id}/${acc}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function RejectBook(
  book: BookingRejectTransactionCreateModel
): Promise<TResponse<Booking>> {
  return new Promise((resolve, reject) => {
    coreApi
      .post(`${ApiRouteKey.Booking}/reject/`, book)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function DiscardBook(id: number): Promise<TResponse<Booking>> {
  return new Promise((resolve, reject) => {
    coreApi
      .put(`${ApiRouteKey.Booking}/discard/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
