import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Account } from '../../../models/account.model';
import { EntryFilters } from '../../../models/entry.model';

@Component({
  selector: 'app-entry-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './entry-filters.component.html',
  styleUrls: ['./entry-filters.component.scss']
})
export class EntryFiltersComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private searchSubject = new Subject<string>();
  private sub = new Subscription();

  @Input() accounts: Account[] = [];
  @Input() set currentFilters(f: EntryFilters) {
    if (this.filterForm) {
      this.filterForm.patchValue(
        {
          search: f.search || '',
          fromAccountId: f.fromAccountId || '',
          toAccountId: f.toAccountId || '',
          dateFrom: f.dateFrom || '',
          dateTo: f.dateTo || ''
        },
        { emitEvent: false }
      );
    }
  }

  @Output() filterChange = new EventEmitter<EntryFilters>();
  @Output() resetFilters = new EventEmitter<void>();

  filterForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();

    // Debounce search input to avoid flood of requests
    this.sub.add(
      this.searchSubject
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(searchTerm => {
          this.emitFilters({ search: searchTerm });
        })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private initForm(): void {
    this.filterForm = this.fb.group({
      search: [''],
      fromAccountId: [''],
      toAccountId: [''],
      dateFrom: [''],
      dateTo: ['']
    });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  onFieldChange(): void {
    const val = this.filterForm.value;
    this.emitFilters({
      search: val.search,
      fromAccountId: val.fromAccountId || undefined,
      toAccountId: val.toAccountId || undefined,
      dateFrom: val.dateFrom || undefined,
      dateTo: val.dateTo || undefined
    });
  }

  private emitFilters(partial: Partial<EntryFilters>): void {
    const val = this.filterForm.value;
    const filters: EntryFilters = {
      search: (val.search || '').trim() || undefined,
      fromAccountId: val.fromAccountId || undefined,
      toAccountId: val.toAccountId || undefined,
      dateFrom: val.dateFrom || undefined,
      dateTo: val.dateTo || undefined,
      ...partial
    };

    this.filterChange.emit(filters);
  }

  onClear(): void {
    this.filterForm.reset({
      search: '',
      fromAccountId: '',
      toAccountId: '',
      dateFrom: '',
      dateTo: ''
    });
    this.resetFilters.emit();
  }

  get hasActiveFilters(): boolean {
    const val = this.filterForm?.value;
    if (!val) return false;
    return !!(val.search || val.fromAccountId || val.toAccountId || val.dateFrom || val.dateTo);
  }
}

