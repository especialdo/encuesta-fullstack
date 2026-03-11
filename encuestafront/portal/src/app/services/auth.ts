import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequestDto } from '../dto/LoginRequestDto';
import { map, Observable } from 'rxjs';
import { AuthResponseDto } from '../dto/AuthResponseDto';
import { RegisterRequestDto } from '../dto/RegisterRequestDto';
import { JwtPayloadDto } from '../dto/JwtPayloadDto';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly BASE_URL = 'http://localhost:3000/api/auth';
  private readonly TOKEN_KEY = 'survey_token';

  constructor(private http: HttpClient) {}

  // ─── HTTP ──────────────────────────────────────────────────────────────────

  login(dto: LoginRequestDto): Observable<AuthResponseDto> {
    console.log(dto);
    return this.http
      .post<{ access_token: string }>(`${this.BASE_URL}/login`, dto)
      .pipe(map((res) => AuthResponseDto.fromJson(res)));
  }

  register(dto: RegisterRequestDto): Observable<AuthResponseDto> {
    return this.http
      .post<{ access_token: string }>(`${this.BASE_URL}/register`, dto)
      .pipe(map((res) => AuthResponseDto.fromJson(res)));
  }

  // ─── Token Management ─────────────────────────────────────────────────────

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = this.decodeToken(token);
    if (!payload) return false;
    return payload.exp * 1000 > Date.now();
  }

  // ─── JWT Decode ───────────────────────────────────────────────────────────

  decodeToken(token: string): JwtPayloadDto | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const decoded = JSON.parse(atob(parts[1]));
      return JwtPayloadDto.fromDecoded(decoded);
    } catch {
      return null;
    }
  }

  getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = this.decodeToken(token);
    if (!payload) return null;
    return new User(
      payload.sub,
      payload.email,
      payload.name,
      payload.role,
      new Date(payload.iat * 1000),
    );
  }
}
