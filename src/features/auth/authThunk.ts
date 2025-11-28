import { makeRequest } from "@/makeRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  email: string;
  password: string;
  phone: string;
  name: string;
}

export const loginUser = createAsyncThunk<
  {
    user: Auth.User;
    accessToken: string;
  },
  LoginCredentials,
  {
    rejectValue: string;
  }
>("auth/loginUser", async ({ email, password }: LoginCredentials, thunkAPI) => {
  try {
    const res = await makeRequest.post("auth/login", { email, password });
    return res.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Login failed"
    );
  }
});

export const signupUser = createAsyncThunk<
  {
    user: Auth.User;
    accessToken: string;
  },
  SignupCredentials,
  {
    rejectValue: string;
  }
>(
  "auth/signupUser",
  async ({ email, password, phone, name }: SignupCredentials, thunkAPI) => {
    try {
      const res = await makeRequest.post("auth/signup", {
        email,
        password,
        phone,
        name,
      });
      return res.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Signup failed"
      );
    }
  }
);
