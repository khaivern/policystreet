import { Injectable } from "@angular/core";
import { IFilter, IPaginationMetadata } from "../interfaces/common.interface";

@Injectable({ providedIn: "root" })
export class StorageService {
  DEFAULT_FILTER: IFilter = { searchValue: "", statusList: [] };
  DEFAULT_PAGINATION: IPaginationMetadata = {
    page: 1,
    pageSize: 5,
    totalItems: 0,
  };

  get filter(): IFilter {
    const filterCache = localStorage.getItem("filter");
    if (!filterCache) {
      return this.DEFAULT_FILTER;
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
      return this.DEFAULT_PAGINATION;
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
