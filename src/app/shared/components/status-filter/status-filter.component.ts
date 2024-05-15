import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: "app-status-filter",
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: "./status-filter.component.html",
  styleUrl: "./status-filter.component.scss",
})
export class StatusFilterComponent implements OnInit, OnDestroy {
  @Input() value: string[] = [];
  @Output() statusChange = new EventEmitter<string[]>();

  public STATUS_LIST = ["Active", "Pending", "Cancelled"];

  public statusControl = this.formBuilder.control<string[]>([]);

  private destroy$ = new Subject<void>();

  constructor(private formBuilder: NonNullableFormBuilder) {}

  ngOnInit(): void {
    this.statusControl.patchValue(this.value);
    this.initValueChangesSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initValueChangesSubscription(): void {
    this.statusControl.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged(this.statusComparator), takeUntil(this.destroy$))
      .subscribe((status) => {
        this.statusChange.emit(status);
      });
  }

  private statusComparator(previous: string[], current: string[]): boolean {
    return JSON.stringify(previous) === JSON.stringify(current);
  }
}
