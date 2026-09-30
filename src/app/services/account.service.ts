import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Account, CreateAccountRequest, UpdateAccountRequest } from '../models/account.model';
import { AccountBalancesResponse } from '../models/account-balance.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/accounts`;

  getAccounts(): Observable<Account[]> {
    return this.http.get<{ success: boolean; data: Account[] }>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getAccountBalances(): Observable<AccountBalancesResponse> {
    return this.http.get<{ success: boolean; data: AccountBalancesResponse }>(`${this.apiUrl}/balances`).pipe(
      map(response => response.data)
    );
  }

  createAccount(request: CreateAccountRequest): Observable<Account> {
    return this.http.post<{ success: boolean; data: Account }>(this.apiUrl, request).pipe(
      map(response => response.data)
    );
  }

  updateAccount(id: string, request: UpdateAccountRequest): Observable<Account> {
    return this.http.put<{ success: boolean; data: Account }>(`${this.apiUrl}/${id}`, request).pipe(
      map(response => response.data)
    );
  }

  deleteAccount(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; data: { success: boolean; message: string } }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }
}

