import type { RoomType } from "../../domain/entities/Room";

export interface SearchAvailabilityInput {
  startDate: string;
  endDate: string;
  guests: number;
}

export interface AvailableRoomDTO {
  roomId: string;
  number: string;
  name: string;
  description: string | null;
  type: RoomType;
  capacity: number;
  amenities: string[];
  pricePerNight: number;
  nights: number;
  total: number;
}

export interface SearchAvailabilityOutput {
  startDate: string;
  endDate: string;
  guests: number;
  nights: number;
  rooms: AvailableRoomDTO[];
}
