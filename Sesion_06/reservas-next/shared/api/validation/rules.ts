import Joi from "joi";

export const MAX_GUESTS = 10;

/** Fecha de calendario en formato AAAA-MM-DD (el formato de <input type="date">). */
export const isoDate = (label: string) =>
  Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .label(label)
    .messages({
      "any.required": "{#label} es obligatoria",
      "string.empty": "{#label} es obligatoria",
      "string.base": "{#label} debe ser un texto",
      "string.pattern.base": "{#label} debe tener el formato AAAA-MM-DD",
    });

/** Número de huéspedes: entero entre 1 y MAX_GUESTS. */
export const guests = () =>
  Joi.number()
    .integer()
    .min(1)
    .max(MAX_GUESTS)
    .label("El número de huéspedes")
    .messages({
      "any.required": "{#label} es obligatorio",
      "number.base": "{#label} debe ser un número",
      "number.integer": "{#label} debe ser un número entero",
      "number.min": "{#label} debe ser al menos {#limit}",
      "number.max": "{#label} no puede ser mayor a {#limit}",
    });
