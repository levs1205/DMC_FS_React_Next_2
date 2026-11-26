import { Availability } from "../../domain/entities/Availability";
import { DateRange } from "../../domain/value-objects/DateRange";
import type { AvailabilityRepository } from "../../domain/repositories/AvailabilityRepository";
import type {
  AvailableRoomDTO,
  SearchAvailabilityInput,
  SearchAvailabilityOutput,
} from "../dto/SearchAvailabilityDTO";

export class SearchAvailability {
  constructor(private readonly repository: AvailabilityRepository) {}

  async execute(input: SearchAvailabilityInput): Promise<SearchAvailabilityOutput> {
    const range = DateRange.forNewStay(input.startDate, input.endDate);
    const rooms = await this.repository.findAvailableRooms(range, input.guests);

    return {
      startDate: range.start,
      endDate: range.end,
      guests: input.guests,
      nights: range.nights,
      rooms: rooms.map((room) => toDTO(new Availability(room, range))),
    };
  }
}

function toDTO({ room, nights, total }: Availability): AvailableRoomDTO {
  return {
    roomId: room.id,
    number: room.number,
    name: room.name,
    description: room.description,
    type: room.type,
    capacity: room.capacity,
    amenities: room.amenities,
    pricePerNight: room.pricePerNight,
    nights,
    total,
  };
}
