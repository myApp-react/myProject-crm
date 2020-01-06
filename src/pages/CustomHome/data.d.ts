export interface TableListItem {
  Id: string;
  key: number;
  disabled?: boolean;
  href: string;
  ConfigName: string;
  CreatorName: string;
  PublishStatus: number;
  ShowAddTime: Date;
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

export interface SaveConfigParams {
  configJson: string;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  current: number;
}

export interface CarouselType {
  ConfiId: string;
  Id: string;
  Images: Array<any>;
  IsFloat: number;
  OrderNo: number;
  RollingTime: any;
  type: number;
}

export interface GridType {
  BackgroundColor: string
  Buttons: Array<any>
  ConfigId: string
  FontColor: any
  FontSize: number
  Id: string
  OrderNo: 2
  RowShowType: 0
  StyleType: 5
  type: 2
}



