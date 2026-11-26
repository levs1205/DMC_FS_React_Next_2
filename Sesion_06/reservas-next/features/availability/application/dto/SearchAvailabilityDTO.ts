import type { RoomType } from "../../domain/entities/Room";

export interface SearchAvailabilityInput {
  startDate: string;
  endDate: string;
}

export interface AvailableRoomDTO {
  roomId: string;
  name: string;
  type: RoomType;
  capacity: number;
  pricePerNight: number;
  nights: number;
  total: number;
}

export interface SearchAvailabilityOutput {
  startDate: string;
  endDate: string;
  nights: number;
  rooms: AvailableRoomDTO[];
}
