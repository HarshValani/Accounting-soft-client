import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  CreateEntryRequest,
  Entry,
  EntryFilters,
  UpdateEntryRequest
} from '../models/entry.model';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/entries`;

  getEntries(filters: EntryFilters = {}): Observable<PaginatedResponse<Entry>> {
    let params = new HttpParams();

    if (filters.search && filters.search.trim()) {
      params = params.set('search', filters.search.trim());
    }
    if (filters.fromAccountId) {
      params = params.set('fromAccountId', filters.fromAccountId);
    }
    if (filters.toAccountId) {
      params = params.set('toAccountId', filters.toAccountId);
    }
    if (filters.dateFrom) {
      params = params.set('dateFrom', filters.dateFrom);
    }
    if (filters.dateTo) {
      params = params.set('dateTo', filters.dateTo);
    }
    if (filters.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.pageSize !== undefined) {
      params = params.set('pageSize', filters.pageSize.toString());
    }
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    if (filters.sortDirection) {
      params = params.set('sortDirection', filters.sortDirection);
    }

    return this.http.get<{ success: boolean; data: PaginatedResponse<Entry> }>(this.apiUrl, { params }).pipe(
      map(response => response.data)
    );
  }

  createEntry(request: CreateEntryRequest): Observable<Entry> {
    return this.http.post<{ success: boolean; data: Entry }>(this.apiUrl, request).pipe(
      map(response => response.data)
    );
  }

  updateEntry(id: string, request: UpdateEntryRequest): Observable<Entry> {
    return this.http.put<{ success: boolean; data: Entry }>(`${this.apiUrl}/${id}`, request).pipe(
      map(response => response.data)
    );
  }

  deleteEntry(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; data: { success: boolean; message: string } }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }
}

