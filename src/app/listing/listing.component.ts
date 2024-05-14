import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ListingService } from "../shared/services/listing.service";
import {
  ICompany,
  IFilter,
  IPaginationMetadata,
} from "../shared/interfaces/common.interface";
import { BehaviorSubject } from "rxjs";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { MatTableModule } from "@angular/material/table";

@Component({
  selector: "app-listing",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    NgxSkeletonLoaderModule,
    MatTableModule,
  ],
  templateUrl: "./listing.component.html",
  styleUrl: "./listing.component.scss",
})
export class ListingComponent implements OnInit {
  public filterProperties: IFilter = {
    searchValue: "",
    statusList: [],
  };
  public paginationProperties: IPaginationMetadata = {
    page: 1,
    pageSize: 5,
    totalItems: 0,
  };
  public filterQuery$ = new BehaviorSubject<IFilter>(this.filterProperties);
  public pagination$ = new BehaviorSubject<{
    page: number;
    pageSize: number;
    totalItems: number;
  }>(this.paginationProperties);

  // TABLE COLUNS
  public displayedColumns: string[] = [
    "date",
    "name",
    "brn",
    "pic",
    "email",
    "status",
  ];

  // To be converted to an Observable
  public data: ICompany[] = [];

  constructor(private listingService: ListingService) {}

  ngOnInit(): void {
    /* This is a dummy API used to simulate a GET request to obtain the relevant data
     * You are expected to start here and modify this code to use RxJs practices. Happy Coding! */
    this.listingService
      .getListing(
        this.paginationProperties.page,
        this.paginationProperties.pageSize,
        this.filterProperties,
      )
      .subscribe((x) => {
        this.data = x.data;
      });
  }
}
