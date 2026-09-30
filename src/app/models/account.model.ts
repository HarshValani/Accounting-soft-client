export interface Account {
  id: string;
  name: string;
  startingBalance: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAccountRequest {
  name: string;
  startingBalance?: number;
  isActive?: boolean;
}

export interface UpdateAccountRequest {
  name: string;
  isActive?: boolean;
}

