import {
  IFilter,
  IPaginationMetadata,
} from "../shared/interfaces/common.interface";

export const DEFAULT_FILTER: IFilter = { searchValue: "", statusList: [] };
export const DEFAULT_PAGINATION: IPaginationMetadata = {
  page: 1,
  pageSize: 5,
  totalItems: 0,
};
