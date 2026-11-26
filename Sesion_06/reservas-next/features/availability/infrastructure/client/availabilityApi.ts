import { apiClient } from "@/shared/infrastructure/client/apiClient";
import type {
  SearchAvailabilityInput,
  SearchAvailabilityOutput,
} from "../../application/dto/SearchAvailabilityDTO";

export function searchAvailability(input: SearchAvailabilityInput) {
  return apiClient.get<SearchAvailabilityOutput>("/api/availability", { ...input });
}
