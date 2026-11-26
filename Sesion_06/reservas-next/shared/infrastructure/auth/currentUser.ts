export interface CurrentUser {
  id: string;
  name: string;
}

const MOCK_USER: CurrentUser = { id: "user-demo", name: "Usuario Demo" };

/** Mientras no exista autenticación, todas las peticiones pertenecen al usuario mock. */
export function getCurrentUser(): CurrentUser {
  return MOCK_USER;
}
