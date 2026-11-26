import Joi from "joi";
import { guests, isoDate } from "@/shared/api/validation/rules";
import type { SearchAvailabilityInput } from "../../application/dto/SearchAvailabilityDTO";

export const searchAvailabilitySchema = Joi.object<SearchAvailabilityInput>({
  startDate: isoDate("La fecha de inicio"),
  endDate: isoDate("La fecha de fin"),
  guests: guests().default(1),
});
