import { handleRoute } from "@/shared/api/handleRoute";
import { reservationsController } from "@/features/reservations/infrastructure/container";

type Context = RouteContext<"/api/reservations/[id]">;

// GET /api/reservations/RES-XXXXXXXX  (el id es el código de la reserva)
export const GET = handleRoute<Context>(async (_request, { params }) =>
  reservationsController.findByCode((await params).id),
);

// DELETE /api/reservations/RES-XXXXXXXX → la reserva pasa a CANCELLED
export const DELETE = handleRoute<Context>(async (_request, { params }) =>
  reservationsController.cancel((await params).id),
);
