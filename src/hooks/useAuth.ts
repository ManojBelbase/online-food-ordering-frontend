import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  selectIsAuthenticated,
  selectUser,
  selectUserRole,
  selectAuthLoading,
} from "@/features/auth/selectors";

export const useAuth = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);
  const isLoading = useSelector(selectAuthLoading);
  const router = useRouter();

  const requireAuth = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return false;
    }
    return true;
  };

  const requireRole = (requiredRole: string) => {
    if (!isAuthenticated) {
      router.push("/login");
      return false;
    }

    if (userRole !== requiredRole) {
      router.push("/unauthorized");
      return false;
    }

    return true;
  };

  return {
    isAuthenticated,
    user,
    userRole,
    isLoading,
    requireAuth,
    requireRole,
  };
};
