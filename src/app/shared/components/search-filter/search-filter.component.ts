import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
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
export class SearchFilterComponent implements OnInit, OnDestroy {
  @Output() search = new EventEmitter<string>();

  public searchControl = this.formBuilder.control("");

  private destroy$ = new Subject<void>();

  constructor(private formBuilder: NonNullableFormBuilder) {}

  ngOnInit(): void {
    this.initValueChangesSubscription();
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
