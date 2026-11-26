import Joi from "joi";
import { guests, isoDate } from "@/shared/api/validation/rules";
import type { CreateReservationInput } from "../../application/dto/ReservationDTO";

export const createReservationSchema = Joi.object<CreateReservationInput>({
  roomId: Joi.string().trim().required().label("La habitación").messages({
    "any.required": "{#label} es obligatoria",
    "string.empty": "{#label} es obligatoria",
  }),
  startDate: isoDate("La fecha de inicio"),
  endDate: isoDate("La fecha de fin"),
  guests: guests().required(),
  notes: Joi.string().trim().max(500).allow("").label("Las notas").messages({
    "string.max": "{#label} no pueden superar los {#limit} caracteres",
  }),
});
