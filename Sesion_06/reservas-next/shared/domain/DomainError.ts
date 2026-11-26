export type DomainErrorCode = "VALIDATION" | "NOT_FOUND" | "CONFLICT";

/** Error de reglas de negocio. No conoce HTTP: la capa api traduce el código a un status. */
export class DomainError extends Error {
  constructor(
    message: string,
    readonly code: DomainErrorCode = "VALIDATION",
  ) {
    super(message);
    this.name = "DomainError";
  }
}
