export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  access_token: string;
}
