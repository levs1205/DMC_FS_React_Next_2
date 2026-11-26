export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
}

/**
 * Usuario en duro mientras no exista login. Existe en la BD: lo crea prisma/seed.ts
 * con este mismo id, así las reservas cumplen la clave foránea user_id.
 */
export const DEMO_USER: CurrentUser = {
  id: "usr_demo_guest",
  email: "huesped.demo@hotel.pe",
  fullName: "Huésped Demo",
};

export function getCurrentUser(): CurrentUser {
  return DEMO_USER;
}
