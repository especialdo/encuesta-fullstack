export class User {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public role: string,
    public createdAt: Date,
  ) {}
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};
