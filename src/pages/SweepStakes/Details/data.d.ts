export interface ActivityApplysItem {
  AcitivityId: string;
  UserInfo: string;
  SignInStatus: number;
  Index: number;
  Size: number;
  id: string;
  ActivityId: string;
  CustomerId: string;
  Note: string;
}

export interface ActivityCommentsItem {
  id: string;
  AcitivityId: string;
  UserInfo: string;
  StartTime: string;
  EndTime: string;
  Index: number;
  Size: number;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface ActivityApplyItem {
  Id: string;
  CustomerId: string;
  CustomerName: string;
  Phone: string;
  ApplyTimeSpan: number;
  SignInStatus: number;
  Enabled: number;
}

export interface ActivityCommentsItem {
  Id: string;
  UserName: string;
  UserPhone: string;
  CreateTimeSpan: number;
  Comment: string;
}



export interface AdvancedProfileData {
  ActivityApply: {
    list: ActivityApplyItem[];
    pagination: Partial<TableListPagination>;
  }
  ActivityComments: {
    list: ActivityCommentsItem[];
    pagination: Partial<TableListPagination>;
  }
}

