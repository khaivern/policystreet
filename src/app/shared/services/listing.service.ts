import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, delay, map } from "rxjs";
import {
  ICompany,
  ICompanyResponse,
  IFilter,
} from "../interfaces/common.interface";

@Injectable({
  providedIn: "root",
})
export class ListingService {
  constructor(private http: HttpClient) {}

  /** No modifications should be required from for this section.
   * If any issues found, please reach out to us.  */
  public getListing(
    page: number,
    pageSize: number,
    filterQuery: IFilter,
  ): Observable<ICompanyResponse> {
    return this.http.get<ICompany[]>("./assets/data/companies.json").pipe(
      delay(2000), // to simulate waiting for an actual backend response
      map((items) => {
        let metadata = {
          pageSize: pageSize,
          page: page,
          totalItems: items.length,
        };
        let filteredList = [...items];
        const { searchValue, statusList } = filterQuery;

        // FILTER FOR STATUS
        if (statusList.length) {
          filteredList = filteredList.filter((c) =>
            hasIntersection([c.status], statusList),
          );
        }

        // FILTER FOR SEARCH
        if (searchValue) {
          const lowerCaseSearchQuery = searchValue.toLowerCase();
          filteredList = filteredList.filter(
            (c) =>
              c.name.toLowerCase().includes(lowerCaseSearchQuery) ||
              c.brn.toLowerCase().includes(lowerCaseSearchQuery) ||
              c.pic.toLowerCase().includes(lowerCaseSearchQuery) ||
              c.email.toLowerCase().includes(lowerCaseSearchQuery),
          );
        }

        // If current pagination is larger than the actual list, default the page to 1
        const numberOfDisplayablePages = Math.ceil(
          filteredList.length / pageSize,
        );
        metadata.page = metadata.page > numberOfDisplayablePages ? 1 : page;

        return {
          metadata: {
            ...metadata,
            totalItems: filteredList.length,
          },
          data: filteredList.slice(
            (metadata.page - 1) * metadata.pageSize,
            metadata.page * metadata.pageSize,
          ),
        };
      }),
      catchError((error) => {
        throw new Error("Failed to fetch data");
      }),
    );
  }
}

export function hasIntersection(arr1: any, arr2: any) {
  const intersection = [];
  for (let i = 0; i < arr1.length; i++) {
    const element = arr1[i];
    if (arr2.indexOf(element) !== -1 && intersection.indexOf(element) === -1) {
      intersection.push(element);
    }
  }

  return intersection.length > 0;
}
