export interface AccountBalance {
  accountId: string;
  accountName: string;
  moneyIn: number;
  moneyOut: number;
  balance: number;
}

export interface AccountBalancesResponse {
  balances: AccountBalance[];
}

