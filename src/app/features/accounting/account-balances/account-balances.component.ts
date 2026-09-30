import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountBalance } from '../../../models/account-balance.model';
import { AccountBalanceCardComponent } from '../account-balance-card/account-balance-card.component';

@Component({
  selector: 'app-account-balances',
  standalone: true,
  imports: [CommonModule, AccountBalanceCardComponent],
  templateUrl: './account-balances.component.html',
  styleUrls: ['./account-balances.component.scss']
})
export class AccountBalancesComponent {
  @Input() balances: AccountBalance[] = [];
  @Input() selectedAccountId: string | null = null;
  @Input() isLoading = false;

  @Output() accountSelected = new EventEmitter<string | null>();
  @Output() addAccount = new EventEmitter<void>();
  @Output() deleteAccount = new EventEmitter<string>();
  @Output() editAccount = new EventEmitter<string>();

  get selectedAccountName(): string | null {
    if (!this.selectedAccountId) return null;
    const found = this.balances.find(b => b.accountId === this.selectedAccountId);
    return found ? found.accountName : null;
  }

  onCardClick(accountBalance: AccountBalance): void {
    if (this.selectedAccountId === accountBalance.accountId) {
      // Toggle off
      this.accountSelected.emit(null);
    } else {
      this.accountSelected.emit(accountBalance.accountId);
    }
  }

  clearAccountFilter(): void {
    this.accountSelected.emit(null);
  }

  onAddAccount(): void {
    this.addAccount.emit();
  }

  onDeleteAccount(accountId: string): void {
    this.deleteAccount.emit(accountId);
  }

  onEditAccount(accountId: string): void {
    this.editAccount.emit(accountId);
  }
}

