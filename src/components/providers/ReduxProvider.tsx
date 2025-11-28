"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { initializeAuth, refreshToken } from "@/features/auth/authSlice";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("persist:root");
    
    if (accessToken && userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.auth) {
          const authData = JSON.parse(parsedData.auth);
          if (authData.user && authData.accessToken) {
            console.log("[DEBUG] Restoring user session from localStorage");
            dispatch(refreshToken({
              user: authData.user,
              accessToken: authData.accessToken
            }));
          }
        }
      } catch (error) {
        console.error("[DEBUG] Error parsing persisted auth data:", error);
        // Clear invalid data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("persist:root");
      }
    }
    
    dispatch(initializeAuth());
  }, [dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthInitializer>{children}</AuthInitializer>
      </PersistGate>
    </Provider>
  );
}
