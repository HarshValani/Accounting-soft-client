import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, AuthData } from '../../models/auth.model';
import { User } from '../../models/user.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenStorage = inject(TokenStorageService);

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSignal = signal<User | null>(this.tokenStorage.getUser());
  public readonly currentUser = this.currentUserSignal.asReadonly();

  public readonly isAuthenticated = computed(() => {
    return !!this.tokenStorage.getToken() && !!this.currentUserSignal();
  });

  register(data: RegisterRequest): Observable<AuthData> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data).pipe(
      map(response => response.data),
      tap(authData => this.handleAuthSuccess(authData))
    );
  }

  login(credentials: LoginRequest): Observable<AuthData> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => response.data),
      tap(authData => this.handleAuthSuccess(authData))
    );
  }

  logout(): void {
    this.tokenStorage.clear();
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  private handleAuthSuccess(authData: AuthData): void {
    this.tokenStorage.saveToken(authData.token);
    this.tokenStorage.saveUser(authData.user);
    this.currentUserSignal.set(authData.user);
  }
}

