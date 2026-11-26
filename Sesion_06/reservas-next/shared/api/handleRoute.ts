import { connection, type NextRequest } from "next/server";
import { DomainError, type DomainErrorCode } from "@/shared/domain/DomainError";
import { RequestValidationError } from "@/shared/api/validation/validate";

type RouteHandler<C> = (request: NextRequest, context: C) => Promise<Response>;

const STATUS_BY_CODE: Record<DomainErrorCode, number> = {
  VALIDATION: 422,
  NOT_FOUND: 404,
  CONFLICT: 409,
};

/** Envuelve un Route Handler y traduce los errores a respuestas HTTP uniformes. */
export function handleRoute<C = unknown>(handler: RouteHandler<C>): RouteHandler<C> {
  return async (request, context) => {
    // Los datos viven en memoria y cambian en cada petición: nunca prerenderizar.
    await connection();

    try {
      return await handler(request, context);
    } catch (error) {
      return toErrorResponse(error);
    }
  };
}

function toErrorResponse(error: unknown): Response {
  if (error instanceof RequestValidationError) {
    return errorJson(400, "INVALID_REQUEST", error.message, error.details);
  }

  if (error instanceof DomainError) {
    return errorJson(STATUS_BY_CODE[error.code], error.code, error.message);
  }

  console.error(error);
  return errorJson(500, "INTERNAL_ERROR", "Ocurrió un error inesperado");
}

function errorJson(status: number, code: string, message: string, details?: unknown) {
  return Response.json({ error: { code, message, details } }, { status });
}
