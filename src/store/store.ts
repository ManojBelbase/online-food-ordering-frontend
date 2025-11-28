"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/authSlice";
import cartReducer from "@/features/cart/cartSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { persistStore } from "redux-persist";

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  skip: typeof window === "undefined",
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
      devTools: process.env.NODE_ENV !== "production",
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
