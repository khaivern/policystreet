import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  finalize,
  switchMap,
  tap,
} from "rxjs";
import { SearchFilterComponent } from "../shared/components/search-filter/search-filter.component";
import { StatusFilterComponent } from "../shared/components/status-filter/status-filter.component";
import {
  ICompany,
  ICompanyResponse,
  IFilter,
  IPaginationMetadata,
} from "../shared/interfaces/common.interface";
import { ListingService } from "../shared/services/listing.service";
import { StorageService } from "../shared/services/storage.service";
import { DEFAULT_FILTER, DEFAULT_PAGINATION } from "./listing.constant";

@Component({
  selector: "app-listing",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    NgxSkeletonLoaderModule,
    MatTableModule,
    MatPaginatorModule,
    SearchFilterComponent,
    StatusFilterComponent,
  ],
  templateUrl: "./listing.component.html",
  styleUrl: "./listing.component.scss",
})
export class ListingComponent implements OnInit {
  public filterProperties: IFilter = this.getFilterProperties();
  public paginationProperties: IPaginationMetadata =
    this.getPaginationProperties();
  public filterQuery$ = new BehaviorSubject<IFilter>(this.filterProperties);
  public pagination$ = new BehaviorSubject<{
    page: number;
    pageSize: number;
    totalItems: number;
  }>(this.paginationProperties);

  // TABLE COLUNS
  public displayedColumns: string[] = [
    "index",
    "date",
    "name",
    "brn",
    "pic",
    "email",
    "status",
  ];

  // To be converted to an Observable
  public data: ICompany[] = [];

  public isLoading = false;

  constructor(
    private listingService: ListingService,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    /* This is a dummy API used to simulate a GET request to obtain the relevant data
     * You are expected to start here and modify this code to use RxJs practices. Happy Coding! */
    combineLatest([this.filterQuery$, this.pagination$])
      .pipe(
        tap((result) => this.cacheFilters(result)),
        switchMap(() => this.getListing$()),
      )
      .subscribe();
  }

  public onClearFilters(): void {
    this.filterProperties = { ...DEFAULT_FILTER };
    this.paginationProperties = { ...DEFAULT_PAGINATION };

    this.filterQuery$.next(this.filterProperties);
    this.pagination$.next(this.paginationProperties);
  }

  public getRowIndex(index: number): number {
    const pageIndex = this.paginationProperties.page - 1;
    return pageIndex * this.paginationProperties.pageSize + index + 1;
  }

  public onSearch(keyword: string): void {
    this.filterProperties.searchValue = keyword;
    this.filterQuery$.next({ ...this.filterProperties });
  }

  public onStatusChange(statuses: string[]): void {
    this.filterProperties.statusList = statuses;
    this.filterQuery$.next({ ...this.filterProperties });
  }

  public onPaginate({ pageIndex, pageSize }: PageEvent): void {
    this.paginationProperties.page = pageIndex + 1;
    this.paginationProperties.pageSize = pageSize;
    this.pagination$.next({ ...this.paginationProperties });
  }

  private getFilterProperties(): IFilter {
    return this.storageService.filter || DEFAULT_FILTER;
  }

  private getPaginationProperties(): IPaginationMetadata {
    return this.storageService.pagination || DEFAULT_PAGINATION;
  }

  private cacheFilters([filter, pagination]: [
    IFilter,
    IPaginationMetadata,
  ]): void {
    this.storageService.filter = filter;
    this.storageService.pagination = pagination;
  }

  private getListing$(): Observable<ICompanyResponse> {
    this.isLoading = true;

    return this.listingService
      .getListing(
        this.paginationProperties.page,
        this.paginationProperties.pageSize,
        this.filterProperties,
      )
      .pipe(
        finalize(() => (this.isLoading = false)),
        tap((result) => {
          this.data = result.data;
          this.paginationProperties = result.metadata;
        }),
      );
  }
}
