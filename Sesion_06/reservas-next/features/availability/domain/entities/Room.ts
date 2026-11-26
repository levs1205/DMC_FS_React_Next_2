export type RoomType = "SINGLE" | "DOUBLE" | "SUITE" | "FAMILY";

export interface Room {
  readonly id: string;
  readonly number: string;
  readonly name: string;
  readonly description: string | null;
  readonly type: RoomType;
  readonly capacity: number;
  readonly pricePerNight: number;
  readonly isActive: boolean;
  readonly amenities: string[];
}
