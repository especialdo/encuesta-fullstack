// model/User.ts

export class User {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public role: string,
    public createdAt: Date,
  ) {}
}

// ✅ Interface en lugar de clase
export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// ✅ Objeto plano en lugar de new AuthState()
export const initialAuthState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};
