import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from "rxjs";

@Component({
  selector: "app-search-filter",
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./search-filter.component.html",
  styleUrl: "./search-filter.component.scss",
})
export class SearchFilterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() value = "";
  @Output() search = new EventEmitter<string>();

  public searchControl = this.formBuilder.control("");

  private destroy$ = new Subject<void>();

  constructor(private formBuilder: NonNullableFormBuilder) {}

  ngOnInit(): void {
    this.searchControl.patchValue(this.value);
    this.initValueChangesSubscription();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["value"]) {
      this.searchControl.patchValue(this.value);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initValueChangesSubscription(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((keyword) => {
        this.search.emit(keyword);
      });
  }
}
