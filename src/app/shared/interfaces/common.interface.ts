export interface ICompany {
  id: string;
  date: Date;
  name: string;
  brn: string;
  pic: string;
  email: string;
  status: "Active" | "Pending" | "Cancelled";
}

export interface IProduct {
  id: string;
  name: string;
}

export interface IPaginationMetadata {
  pageSize: number;
  page: number;
  totalItems: number;
}

export interface ICompanyResponse {
  metadata: IPaginationMetadata;
  data: ICompany[];
}

export interface IFilter {
  searchValue: string;
  statusList: string[];
}
