import { handleRoute } from "@/shared/api/handleRoute";
import { reservationsController } from "@/features/reservations/infrastructure/container";

// GET /api/reservations → reservas del usuario actual
export const GET = handleRoute(() => reservationsController.list());

// POST /api/reservations { roomId, startDate, endDate }
export const POST = handleRoute((request) => reservationsController.create(request));
