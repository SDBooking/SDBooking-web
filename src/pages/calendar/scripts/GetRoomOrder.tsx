import { Room } from "../../../types/room";

export const getRoomOrder = (roomId: number, rooms: Room[]): number | null => {
  const roomIndex = rooms.findIndex((room) => room.id === roomId);
  return roomIndex !== -1 ? roomIndex + 1 : null;
};
