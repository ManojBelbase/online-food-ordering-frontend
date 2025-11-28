import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

// Basic selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.accessToken;
export const selectUserId = (state: RootState) => {
  const user = state.auth.user;
  return user?._id || user?.id || null;
};

// Computed selectors
export const selectIsAuthenticated = createSelector(
  [selectUser, selectToken],
  (user, token) => Boolean(user && token)
);

export const selectUserRole = createSelector(
  [selectUser],
  (user) => user?.role || "guest"
);

export const selectAuthLoading = createSelector(
  [selectAuth],
  (auth) => auth.loadingLogin || auth.loadingSignup
);

export const selectAuthError = createSelector(
  [selectAuth],
  (auth) => auth.errorLogin || auth.errorSignup
);

export const selectIsLoadingLogin = (state: RootState) =>
  state.auth.loadingLogin;
export const selectIsLoadingSignup = (state: RootState) =>
  state.auth.loadingSignup;
