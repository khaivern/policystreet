import { Injectable } from "@angular/core";
import {
  DEFAULT_FILTER,
  DEFAULT_PAGINATION,
} from "../../listing/listing.constant";
import { IFilter, IPaginationMetadata } from "../interfaces/common.interface";

@Injectable({ providedIn: "root" })
export class StorageService {
  get filter(): IFilter {
    const filterCache = localStorage.getItem("filter");
    if (!filterCache) {
      return DEFAULT_FILTER;
    }
    return JSON.parse(filterCache);
  }

  set filter(enteredFilter: IFilter) {
    if (!enteredFilter) {
      localStorage.removeItem("filter");
      return;
    }
    localStorage.setItem("filter", JSON.stringify(enteredFilter));
  }

  get pagination(): IPaginationMetadata {
    const paginationCache = localStorage.getItem("pagination");
    if (!paginationCache) {
      return DEFAULT_PAGINATION;
    }
    return JSON.parse(paginationCache);
  }

  set pagination(enteredPagination: IPaginationMetadata) {
    if (!enteredPagination) {
      localStorage.removeItem("pagination");
      return;
    }
    localStorage.setItem("pagination", JSON.stringify(enteredPagination));
  }

  clear(): void {
    localStorage.clear();
  }
}
