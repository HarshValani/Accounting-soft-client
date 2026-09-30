export interface Entry {
  id: string;
  fromAccountId: string;
  fromAccountName: string;
  toAccountId: string;
  toAccountName: string;
  amount: number;
  note?: string;
  entryDate: string;
  isStartingBalance?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateEntryRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  note?: string;
  entryDate: string;
}

export interface UpdateEntryRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  note?: string;
  entryDate: string;
}

export interface EntryFilters {
  search?: string;
  fromAccountId?: string;
  toAccountId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

