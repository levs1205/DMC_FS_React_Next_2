import type { NextRequest } from "next/server";
import { validate } from "@/shared/api/validation/validate";
import { searchAvailabilitySchema } from "./validators/SearchAvailabilityValidator";
import type { SearchAvailability } from "../application/use-cases/SearchAvailability";

export class AvailabilityController {
  constructor(private readonly searchAvailability: SearchAvailability) {}

  async search(request: NextRequest): Promise<Response> {
    const query = Object.fromEntries(request.nextUrl.searchParams);
    const input = validate(searchAvailabilitySchema, query);
    return Response.json(await this.searchAvailability.execute(input));
  }
}
