import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entry } from '../../../models/entry.model';
import { CustomDatePipe } from '../../../shared/pipes/custom-date.pipe';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-entries-table',
  standalone: true,
  imports: [CommonModule, InrCurrencyPipe, CustomDatePipe],
  templateUrl: './entries-table.component.html',
  styleUrls: ['./entries-table.component.scss']
})
export class EntriesTableComponent {
  @Input() entries: Entry[] = [];
  @Input() total = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() totalPages = 1;
  @Input() isLoading = false;
  @Input() sortBy = 'entryDate';
  @Input() sortDirection: 'asc' | 'desc' = 'desc';
  @Input() hasActiveFilters = false;

  @Output() edit = new EventEmitter<Entry>();
  @Output() delete = new EventEmitter<Entry>();
  @Output() sort = new EventEmitter<{ sortBy: string; sortDirection: 'asc' | 'desc' }>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() clearAllFilters = new EventEmitter<void>();

  onSort(field: string): void {
    let nextDirection: 'asc' | 'desc' = 'asc';
    if (this.sortBy === field) {
      nextDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      nextDirection = field === 'entryDate' ? 'desc' : 'asc';
    }
    this.sort.emit({ sortBy: field, sortDirection: nextDirection });
  }

  onPage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages && newPage !== this.page) {
      this.pageChange.emit(newPage);
    }
  }

  onPageSizeSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const size = parseInt(select.value, 10);
    this.pageSizeChange.emit(size);
  }

  onEdit(entry: Entry): void {
    if (entry.isStartingBalance) {
      return; // Prevent editing starting balance entries
    }
    this.edit.emit(entry);
  }

  onDelete(entry: Entry): void {
    if (entry.isStartingBalance) {
      return; // Prevent deleting starting balance entries
    }
    this.delete.emit(entry);
  }

  isStartingBalanceEntry(entry: Entry): boolean {
    return entry.isStartingBalance === true;
  }

  onClearFilters(): void {
    this.clearAllFilters.emit();
  }

  get startIndex(): number {
    if (this.total === 0) return 0;
    return (this.page - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.page * this.pageSize, this.total);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.page - 2);
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}

