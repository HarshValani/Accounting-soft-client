import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Account } from '../../../models/account.model';
import { CreateEntryRequest, Entry, UpdateEntryRequest } from '../../../models/entry.model';

export const differentAccountsValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const fromAccountId = control.get('fromAccountId')?.value;
  const toAccountId = control.get('toAccountId')?.value;

  if (fromAccountId && toAccountId && fromAccountId === toAccountId) {
    return { sameAccount: true };
  }
  return null;
};

@Component({
  selector: 'app-entry-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() accounts: Account[] = [];
  @Input() editEntry: Entry | null = null;
  @Input() isSubmitting = false;
  @Input() isEditMode = false;

  @Output() formSubmit = new EventEmitter<CreateEntryRequest | UpdateEntryRequest>();
  @Output() cancel = new EventEmitter<void>();

  entryForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editEntry'] && this.entryForm) {
      if (this.editEntry) {
        this.populateForm(this.editEntry);
      } else {
        this.resetForm();
      }
    }
  }

  private initForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.entryForm = this.fb.group(
      {
        fromAccountId: ['', [Validators.required]],
        toAccountId: ['', [Validators.required]],
        amount: [
          null,
          [Validators.required, Validators.min(0.01)]
        ],
        note: ['', [Validators.maxLength(500)]],
        entryDate: [today, [Validators.required]]
      },
      { validators: differentAccountsValidator }
    );

    if (this.editEntry) {
      this.populateForm(this.editEntry);
    }
  }

  private populateForm(entry: Entry): void {
    this.entryForm.patchValue({
      fromAccountId: entry.fromAccountId,
      toAccountId: entry.toAccountId,
      amount: entry.amount,
      note: entry.note || '',
      entryDate: entry.entryDate.split('T')[0]
    });
  }

  get fromAccountControl() {
    return this.entryForm.get('fromAccountId');
  }

  get toAccountControl() {
    return this.entryForm.get('toAccountId');
  }

  get amountControl() {
    return this.entryForm.get('amount');
  }

  get noteControl() {
    return this.entryForm.get('note');
  }

  get dateControl() {
    return this.entryForm.get('entryDate');
  }

  get hasSameAccountError(): boolean {
    return (
      (this.entryForm.errors?.['sameAccount'] &&
        (this.fromAccountControl?.touched || this.toAccountControl?.touched)) ||
      false
    );
  }

  onSubmit(): void {
    if (this.entryForm.invalid) {
      this.entryForm.markAllAsTouched();
      return;
    }

    const val = this.entryForm.value;
    const payload: CreateEntryRequest = {
      fromAccountId: val.fromAccountId,
      toAccountId: val.toAccountId,
      amount: Number(val.amount),
      note: val.note ? val.note.trim() : undefined,
      entryDate: val.entryDate
    };

    this.formSubmit.emit(payload);
  }

  resetForm(): void {
    const today = new Date().toISOString().split('T')[0];
    this.entryForm.reset({
      fromAccountId: '',
      toAccountId: '',
      amount: null,
      note: '',
      entryDate: today
    });
    this.entryForm.markAsUntouched();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

