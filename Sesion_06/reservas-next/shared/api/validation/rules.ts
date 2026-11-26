import Joi from "joi";

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
