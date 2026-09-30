import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly TOKEN_KEY = 'accounting_auth_token';
  private readonly USER_KEY = 'accounting_auth_user';

  getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch {
      return null;
    }
  }

  saveToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (e) {
      console.error('Failed to save auth token to storage', e);
    }
  }

  removeToken(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (e) {
      console.error('Failed to remove auth token from storage', e);
    }
  }

  getUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? (JSON.parse(userStr) as User) : null;
    } catch {
      return null;
    }
  }

  saveUser(user: User): void {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user to storage', e);
    }
  }

  removeUser(): void {
    try {
      localStorage.removeItem(this.USER_KEY);
    } catch (e) {
      console.error('Failed to remove user from storage', e);
    }
  }

  clear(): void {
    this.removeToken();
    this.removeUser();
  }
}

