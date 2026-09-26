import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "./auth";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });
}
