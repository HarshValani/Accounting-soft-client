import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Account, CreateAccountRequest, UpdateAccountRequest } from '../../../models/account.model';
import {
  AccountBalance,
  AccountBalancesResponse
} from '../../../models/account-balance.model';
import {
  CreateEntryRequest,
  Entry,
  EntryFilters,
  UpdateEntryRequest
} from '../../../models/entry.model';
import { AccountService } from '../../../services/account.service';
import { EntryService } from '../../../services/entry.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AccountBalancesComponent } from '../account-balances/account-balances.component';
import { EntriesTableComponent } from '../entries-table/entries-table.component';
import { EntryFiltersComponent } from '../entry-filters/entry-filters.component';
import { EntryFormComponent } from '../entry-form/entry-form.component';

@Component({
  selector: 'app-accounting-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EntryFormComponent,
    AccountBalancesComponent,
    EntryFiltersComponent,
    EntriesTableComponent,
    ModalComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './accounting-page.component.html',
  styleUrls: ['./accounting-page.component.scss']
})
export class AccountingPageComponent implements OnInit {
  private authService = inject(AuthService);
  private accountService = inject(AccountService);
  private entryService = inject(EntryService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  // Entry form reference
  @ViewChild('entryForm') entryFormComponent!: EntryFormComponent;

  // Current User
  currentUser = this.authService.currentUser;

  // Accounts & Balances State
  accounts = signal<Account[]>([]);
  accountBalances = signal<AccountBalance[]>([]);
  isLoadingBalances = signal<boolean>(false);

  // Entries State
  entries = signal<Entry[]>([]);
  totalEntries = signal<number>(0);
  page = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(1);
  sortBy = signal<string>('entryDate');
  sortDirection = signal<'asc' | 'desc'>('desc');
  isLoadingEntries = signal<boolean>(false);

  // Active Filters
  selectedAccountId = signal<string | null>(null);
  currentFilters = signal<EntryFilters>({});

  // Submitting States
  isAddingEntry = signal<boolean>(false);
  isUpdatingEntry = signal<boolean>(false);
  isDeletingEntry = signal<boolean>(false);

  // Edit Modal State
  editingEntry = signal<Entry | null>(null);
  isEditModalOpen = signal<boolean>(false);

  // Delete Dialog State
  deletingEntryItem = signal<Entry | null>(null);
  isDeleteDialogOpen = signal<boolean>(false);

  // Delete Account Dialog State
  deletingAccountId = signal<string | null>(null);
  deletingAccountName = signal<string | null>(null);
  isDeleteAccountDialogOpen = signal<boolean>(false);
  isDeletingAccount = signal<boolean>(false);

  // Create Account Modal State
  isCreateAccountModalOpen = signal<boolean>(false);
  isCreatingAccount = signal<boolean>(false);
  createAccountForm!: FormGroup;

  // Edit Account Modal State
  isEditAccountModalOpen = signal<boolean>(false);
  isEditingAccount = signal<boolean>(false);
  editAccountForm!: FormGroup;
  editingAccountId = signal<string | null>(null);

  ngOnInit(): void {
    this.initAccountForm();
    this.initEditAccountForm();
    this.loadAccounts();
    this.loadAccountBalances();
    this.loadEntries();
  }

  private initAccountForm(): void {
    this.createAccountForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      startingBalance: [0, [Validators.min(0)]]
    });
  }

  private initEditAccountForm(): void {
    this.editAccountForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
  }

  // Header Actions
  onLogout(): void {
    this.authService.logout();
    this.notificationService.info('You have been logged out.');
  }

  // Load Accounts
  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (data) => {
        this.accounts.set(data);
      },
      error: () => {
        this.notificationService.error('Unable to load accounts.');
      }
    });
  }

  // Load Balances
  loadAccountBalances(): void {
    this.isLoadingBalances.set(true);
    this.accountService.getAccountBalances().pipe(
      finalize(() => {
        this.isLoadingBalances.set(false);
      })
    ).subscribe({
      next: (res: AccountBalancesResponse) => {
        this.accountBalances.set(res.balances || []);
      },
      error: () => {
        this.accountBalances.set([]);
        this.notificationService.error('Unable to load account balances.');
      }
    });
  }

  // Load Entries with server-side filters, pagination and sorting
  loadEntries(): void {
    this.isLoadingEntries.set(true);

    const filters: EntryFilters = {
      ...this.currentFilters(),
      page: this.page(),
      pageSize: this.pageSize(),
      sortBy: this.sortBy(),
      sortDirection: this.sortDirection()
    };

    // If an account is selected from the balance cards, filter transactions involving that account
    if (this.selectedAccountId()) {
      filters.fromAccountId = this.selectedAccountId()!;
      // Note: When filtering by single account, we pass the account filter
    }

    this.entryService.getEntries(filters).pipe(
      finalize(() => {
        this.isLoadingEntries.set(false);
      })
    ).subscribe({
      next: (response) => {
        this.entries.set(response.data || []);
        this.totalEntries.set(response.total || 0);
        this.page.set(response.page || 1);
        this.pageSize.set(response.pageSize || 10);
        this.totalPages.set(response.totalPages || 1);
      },
      error: () => {
        this.entries.set([]);
        this.totalEntries.set(0);
        this.notificationService.error('Unable to load entries.');
      }
    });
  }

  // Entry Creation
  onAddEntrySubmit(entryData: CreateEntryRequest | UpdateEntryRequest): void {
    this.isAddingEntry.set(true);
    this.entryService.createEntry(entryData as CreateEntryRequest).pipe(
      finalize(() => {
        this.isAddingEntry.set(false);
      })
    ).subscribe({
      next: () => {
        this.notificationService.success('Entry added successfully.');
        this.refreshAll();
        this.entryFormComponent?.resetForm();
      },
      error: (err) => {
        this.notificationService.error(err?.message || 'Failed to create entry.');
      }
    });
  }

  // Account Card Click Selection
  onAccountCardSelected(accountId: string | null): void {
    this.selectedAccountId.set(accountId);
    this.page.set(1);
    this.loadEntries();
  }

  // Filters Change from Filter Bar
  onFiltersChanged(newFilters: EntryFilters): void {
    this.currentFilters.set(newFilters);
    this.page.set(1);
    this.loadEntries();
  }

  onResetFilters(): void {
    this.currentFilters.set({});
    this.selectedAccountId.set(null);
    this.page.set(1);
    this.loadEntries();
  }

  // Sorting
  onSortChanged(sortData: { sortBy: string; sortDirection: 'asc' | 'desc' }): void {
    this.sortBy.set(sortData.sortBy);
    this.sortDirection.set(sortData.sortDirection);
    this.page.set(1);
    this.loadEntries();
  }

  // Pagination
  onPageChanged(newPage: number): void {
    this.page.set(newPage);
    this.loadEntries();
  }

  onPageSizeChanged(newSize: number): void {
    this.pageSize.set(newSize);
    this.page.set(1);
    this.loadEntries();
  }

  // Edit Entry Flow
  openEditModal(entry: Entry): void {
    this.editingEntry.set(entry);
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.editingEntry.set(null);
    this.isEditModalOpen.set(false);
  }

  onUpdateEntrySubmit(entryData: CreateEntryRequest | UpdateEntryRequest): void {
    const entry = this.editingEntry();
    if (!entry) return;

    this.isUpdatingEntry.set(true);
    this.entryService.updateEntry(entry.id, entryData as UpdateEntryRequest).pipe(
      finalize(() => {
        this.isUpdatingEntry.set(false);
      })
    ).subscribe({
      next: () => {
        this.closeEditModal();
        this.notificationService.success('Entry updated successfully.');
        this.refreshAll();
      },
      error: (err) => {
        this.notificationService.error(err?.message || 'Failed to update entry.');
      }
    });
  }

  // Delete Entry Flow
  openDeleteDialog(entry: Entry): void {
    this.deletingEntryItem.set(entry);
    this.isDeleteDialogOpen.set(true);
  }

  closeDeleteDialog(): void {
    this.deletingEntryItem.set(null);
    this.isDeleteDialogOpen.set(false);
  }

  onConfirmDelete(): void {
    const entry = this.deletingEntryItem();
    if (!entry) return;

    this.isDeletingEntry.set(true);
    this.entryService.deleteEntry(entry.id).pipe(
      finalize(() => {
        this.isDeletingEntry.set(false);
      })
    ).subscribe({
      next: () => {
        this.closeDeleteDialog();
        this.notificationService.success('Entry deleted successfully.');
        this.refreshAll();
      },
      error: (err) => {
        this.notificationService.error(err?.message || 'Failed to delete entry.');
      }
    });
  }

  // Create Account Flow
  openCreateAccountModal(): void {
    this.createAccountForm.reset({ name: '', startingBalance: 0 });
    this.isCreateAccountModalOpen.set(true);
  }

  closeCreateAccountModal(): void {
    this.isCreateAccountModalOpen.set(false);
  }

  // Edit Account Flow
  openEditAccountModal(accountId: string): void {
    const account = this.accounts().find(a => a.id === accountId);
    if (!account) return;

    this.editingAccountId.set(accountId);
    this.editAccountForm.patchValue({ name: account.name });
    this.isEditAccountModalOpen.set(true);
  }

  closeEditAccountModal(): void {
    this.editingAccountId.set(null);
    this.editAccountForm.reset();
    this.isEditAccountModalOpen.set(false);
  }

  onEditAccountSubmit(): void {
    if (this.editAccountForm.invalid) {
      this.editAccountForm.markAllAsTouched();
      return;
    }

    const accountId = this.editingAccountId();
    if (!accountId) return;

    const payload: UpdateAccountRequest = {
      name: this.editAccountForm.value.name.trim()
    };

    this.isEditingAccount.set(true);
    this.accountService.updateAccount(accountId, payload).pipe(
      finalize(() => {
        this.isEditingAccount.set(false);
      })
    ).subscribe({
      next: (acc) => {
        this.closeEditAccountModal();
        this.notificationService.success(`Account "${acc.name}" updated successfully.`);
        this.refreshAll();
      },
      error: (err) => {
        this.notificationService.error(err?.message || 'Failed to update account.');
      }
    });
  }

  onCreateAccountSubmit(): void {
    if (this.createAccountForm.invalid) {
      this.createAccountForm.markAllAsTouched();
      return;
    }

    const payload: CreateAccountRequest = {
      name: this.createAccountForm.value.name.trim(),
      startingBalance: this.createAccountForm.value.startingBalance || 0
    };

    this.isCreatingAccount.set(true);
    this.accountService.createAccount(payload).pipe(
      finalize(() => {
        this.isCreatingAccount.set(false);
      })
    ).subscribe({
      next: (acc) => {
        this.closeCreateAccountModal();
        this.notificationService.success(`Account "${acc.name}" created successfully.`);
        this.refreshAll();
      },
      error: (err) => {
        this.notificationService.error(err?.message || 'Failed to create account.');
      }
    });
  }

  // Helper to refresh both entries and balances
  private refreshAll(): void {
    this.loadAccounts();
    this.loadAccountBalances();
    this.loadEntries();
  }

  get hasActiveFilters(): boolean {
    const f = this.currentFilters();
    return !!(
      f.search ||
      f.fromAccountId ||
      f.toAccountId ||
      f.dateFrom ||
      f.dateTo ||
      this.selectedAccountId()
    );
  }

  get deleteAccountMessage(): string {
    const accountName = this.deletingAccountName();
    return `Are you sure you want to delete "${accountName}"? This action cannot be undone and will permanently remove the account and all associated data.`;
  }

  // Delete Account Flow
  openDeleteAccountDialog(accountId: string): void {
    const account = this.accounts().find(a => a.id === accountId);
    if (!account) return;

    this.deletingAccountId.set(accountId);
    this.deletingAccountName.set(account.name);
    this.isDeleteAccountDialogOpen.set(true);
  }

  closeDeleteAccountDialog(): void {
    this.deletingAccountId.set(null);
    this.deletingAccountName.set(null);
    this.isDeleteAccountDialogOpen.set(false);
  }

  onConfirmDeleteAccount(): void {
    const accountId = this.deletingAccountId();
    if (!accountId) return;

    this.isDeletingAccount.set(true);
    this.accountService.deleteAccount(accountId).pipe(
      finalize(() => {
        this.isDeletingAccount.set(false);
      })
    ).subscribe({
      next: () => {
        this.closeDeleteAccountDialog();
        this.notificationService.success('Account deleted successfully.');
        this.refreshAll();
      },
      error: (err) => {
        this.notificationService.error(err?.message || 'Failed to delete account.');
      }
    });
  }
}

