import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountBalance } from '../../../models/account-balance.model';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-account-balance-card',
  standalone: true,
  imports: [CommonModule, InrCurrencyPipe],
  templateUrl: './account-balance-card.component.html',
  styleUrls: ['./account-balance-card.component.scss']
})
export class AccountBalanceCardComponent {
  @Input({ required: true }) accountBalance!: AccountBalance;
  @Input() isSelected = false;

  @Output() cardClick = new EventEmitter<AccountBalance>();
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();

  isMenuOpen = false;

  onClick(): void {
    this.cardClick.emit(this.accountBalance);
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen = false;
    this.edit.emit(this.accountBalance.accountId);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen = false;
    this.delete.emit(this.accountBalance.accountId);
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}

