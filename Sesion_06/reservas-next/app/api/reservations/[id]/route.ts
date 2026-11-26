import { handleRoute } from "@/shared/api/handleRoute";
import { reservationsController } from "@/features/reservations/infrastructure/container";

type Context = RouteContext<"/api/reservations/[id]">;

// GET /api/reservations/:id
export const GET = handleRoute<Context>(async (_request, { params }) =>
  reservationsController.findById((await params).id),
);

// DELETE /api/reservations/:id → cancela la reserva
export const DELETE = handleRoute<Context>(async (_request, { params }) =>
  reservationsController.cancel((await params).id),
);
