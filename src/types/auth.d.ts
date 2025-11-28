declare namespace Auth {
  interface User {
    _id?: string;
    id?: string;
    email: string;
    password: string;
    role: string;
    name: string;
  }

  interface AuthState {
    user: User | null;
    accessToken: string | null;
    loadingLogin: boolean;
    loadingSignup: boolean;
    errorLogin: string | null;
    errorSignup: string | null;
    isInitialized: boolean;
  }
}
