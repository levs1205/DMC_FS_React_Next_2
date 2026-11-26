import type { PrismaClient } from "@/generated/prisma/client";
import type { Room } from "../../domain/entities/Room";
import type { DateRange } from "../../domain/value-objects/DateRange";
import type { AvailabilityRepository } from "../../domain/repositories/AvailabilityRepository";
import { AvailabilityMapper } from "./AvailabilityMapper";

export class PrismaAvailabilityRepository implements AvailabilityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAvailableRooms(range: DateRange, guests: number): Promise<Room[]> {
    const rooms = await this.prisma.room.findMany({
      where: {
        isActive: true,
        capacity: { gte: guests },
        bookings: { none: AvailabilityMapper.overlappingBookings(range) },
      },
      include: { amenities: true },
      orderBy: { pricePerNight: "asc" },
    });
    return rooms.map(AvailabilityMapper.toRoom);
  }

  async findRoomById(id: string): Promise<Room | null> {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { amenities: true },
    });
    return room ? AvailabilityMapper.toRoom(room) : null;
  }
}
