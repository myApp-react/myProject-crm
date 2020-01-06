export interface requestParams {
  userInfo: string;
  ProjectId: string;
  ScoureType: number;
  RepitCode: string;
  StoreName: string;
  UserInfo: string;
  StartSupplementTime: string;
  EndSupplementTime: string;
  StartTransactionTime: string;
  EndTransactionTime: string;
  Status: number;
  Index: number;
  Size: number;
  SortBy: string;
  CustomerId: string;
  StoreId: string;
  SaleTime: string;
  Amt: string;
  ServicePointId: string;
  ReciptCode: string;
  ProductCount: number;
  ReciptAmt: any;
  ImageGuid: string;
  Note: string;
  itemId: string;
  Id: string;
  AduitStatus: number;
  dataStr: string;
}

export interface TableListItem {
  key: number;
  userInfo: string;
  ProjectId: string;
  ScoureType: number;
  RepitCode: string;
  StoreName: string;
  UserInfo: string;
  StartSupplementTime: string;
  EndSupplementTime: string;
  StartTransactionTime: string;
  EndTransactionTime: string;
  Status: number;
  Index: number;
  Size: number;
  SortBy: string;
  CustomerId: string;
  StoreId: string;
  SaleTime: string;
  Amt: string;
  ServicePointId: string;
  ReciptCode: string;
  ProductCount: number;
  ReciptAmt: any;
  ImageGuid: string;
  Note: string;
  itemId: string;
  Id: string;
  AduitStatus: number;
  dataStr: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  SortType: number | undefined;
  SortBy: string | undefined;
  Status: number | undefined;
  Size: number;
  Index: number;
  ProjectId: string;
  ScoureType: number | undefined;
  RepitCode: string | undefined;
  StoreName: string | undefined;
  UserInfo: string | undefined;
  StartSupplementTime: string | undefined;
  EndSupplementTime: string | undefined;
  StartTransactionTime: string | undefined;
  EndTransactionTime: string | undefined;
}

export interface ProjectParams {
  Id: string;
  ProjectName: string;
}

export interface serviceParams {
  Id: string;
  ServicePointName: string;
}

interface IntegralRate {
  Money: any;
  Scores: any;
}

export interface integralParams {
  Rate: IntegralRate;
  Scores: any;
  PlanNames: string[]
}






