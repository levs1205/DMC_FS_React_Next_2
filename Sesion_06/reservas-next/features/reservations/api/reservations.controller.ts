import type { NextRequest } from "next/server";
import { validate } from "@/shared/api/validation/validate";
import { getCurrentUser } from "@/shared/infrastructure/auth/currentUser";
import { createReservationSchema } from "./validators/CreateReservationValidator";
import type { CreateReservation } from "../application/use-cases/CreateReservation";
import type { ListReservations } from "../application/use-cases/ListReservations";
import type { GetReservation } from "../application/use-cases/GetReservation";
import type { CancelReservation } from "../application/use-cases/CancelReservation";

export interface ReservationUseCases {
  create: CreateReservation;
  list: ListReservations;
  get: GetReservation;
  cancel: CancelReservation;
}

export class ReservationsController {
  constructor(private readonly useCases: ReservationUseCases) {}

  async create(request: NextRequest): Promise<Response> {
    const body = await request.json().catch(() => ({}));
    const input = validate(createReservationSchema, body);
    const reservation = await this.useCases.create.execute(getCurrentUser().id, input);
    return Response.json(reservation, { status: 201 });
  }

  async list(): Promise<Response> {
    return Response.json(await this.useCases.list.execute(getCurrentUser().id));
  }

  async findByCode(code: string): Promise<Response> {
    return Response.json(await this.useCases.get.execute(getCurrentUser().id, code));
  }

  async cancel(code: string): Promise<Response> {
    return Response.json(await this.useCases.cancel.execute(getCurrentUser().id, code));
  }
}
