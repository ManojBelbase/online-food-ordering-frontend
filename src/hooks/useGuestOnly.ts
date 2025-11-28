import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/features/auth/selectors";
import { RootState } from "@/store/store";

export const useGuestOnly = (redirectTo: string = "/") => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(
    (state: RootState) => state.auth.isInitialized
  );
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo, isInitialized]);

  return { isAuthenticated: isInitialized ? isAuthenticated : undefined };
};
