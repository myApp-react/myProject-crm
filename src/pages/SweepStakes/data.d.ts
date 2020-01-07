export interface TableListItem {
  key: number;
  ActivityId: string;
  ProjectId: string;
  ActivityType: number;
  ActivityName: string;
  PublishStatus: number;
  ActivityStartTime: string;
  ActivityEndTime: string;
  PublishStartTime: string;
  PublishEndTime: string;
  StartStauts: number;
  IsNeedApply: number;
  IsSingin: number;
  IsRecommand: number;
  PublishTimeSpan: number | null;
  PublishTime: number | null;
  ActivityStartTimeSpan: number;
  ActivityEndTimeSpan: number;
  CollectCount: number;
  ClickCount: number;
  ShareDesc: string;
  OrderNo: number;
  ActivityDetail: string;
  ShareImageUrl: string;
  ActivityImageUrl: string;
  TurnTableImageUrl: string;
  ReproductionUrl: string;

  Index: number;
  Size: number;
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
  sorter: string;
  status: string;
  name: string;
  Size: number;
  Index: number;
}

export interface uploadParams {
  dataStr: string;
}

export interface AddTableParams {
  AcitivityId?: string;
  ActivityType: number;
  ProjectId: string;
  ActivityName: string;
  ActivityDetail: string;
  OrderNo: number;
  ActivityStartTime: string;
  ActivityEndTime: string;
  LuckyStartTime?: string;
  LuckyEndTime?: string;
  LuckyType?: number;
  ActivityImageSeed?: string;
  ShareImageSeed?: string;
  ShareDiscrip?: string;
  Note?: string;
  IsNeedApply?: number;
  ApplyStartTime?: string;
  ApplyEndTime?: string;
  ApplyMaxCount?: number;
  ApplyScores?: number;
  IsRecommand?: number;
  IsNeedSignIn?: number;
  Phone?: string
}
