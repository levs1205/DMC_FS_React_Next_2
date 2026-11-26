import type Joi from "joi";

export interface ValidationDetail {
  field: string;
  message: string;
}

/** Error de formato de la petición (400). Distinto a las reglas de negocio. */
export class RequestValidationError extends Error {
  constructor(readonly details: ValidationDetail[]) {
    super(details.map((detail) => detail.message).join(". "));
    this.name = "RequestValidationError";
  }
}

export function validate<T>(schema: Joi.ObjectSchema<T>, input: unknown): T {
  const { value, error } = schema.validate(input, {
    abortEarly: false,
    stripUnknown: true,
    errors: { wrap: { label: false } },
  });

  if (error) {
    throw new RequestValidationError(
      error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    );
  }

  return value;
}
