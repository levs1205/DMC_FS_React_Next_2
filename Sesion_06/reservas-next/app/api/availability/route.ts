import { handleRoute } from "@/shared/api/handleRoute";
import { availabilityController } from "@/features/availability/infrastructure/container";

// GET /api/availability?startDate=2026-11-26&endDate=2026-11-28
export const GET = handleRoute((request) => availabilityController.search(request));
