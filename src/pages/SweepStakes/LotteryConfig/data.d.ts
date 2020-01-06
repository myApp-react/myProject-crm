export interface TableListParams {
  LuckyDrawName: string;
  ActivityId: string;
}

export interface LuckyProps {
  LuckyDrawName: string;
  ActivityId: string;
}

export interface LuckyTableRadiansProps {
  activityId: string;
  Index: number;
  Size: number;
  Id: string;
  ActivityId: string;
  StartRadian: number;
  EndRadian: number;
  IsLuckyRadian: number;
  Enabled: number;
  ChnanceName: string;
  ChannelType: number;
  CardTypeCategory: number;
  CardTypeIds: string;
  TotalCount: number;
  EverydayCount: number;
  SharegetType: number;
  ShareReadedCount: number;
  NeedScores: number;
  NeesRegisteCount: number;
}

export interface saveLuckyTableRadians {
  Id: string;
  DrawId: string;
  ActivityId: string;
  StartRadian: number;
  EndRadian: number;
  LuckyDrawId: string;
  IsLuckyRadian: number;
  Enabled: number;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListItem {
  LuckyDrawId: string;
  DrawName: string;
  DrawType: number;
  CouponId: string;
  CouponName: string;
  CouponCode: string;
  Scores: number;
  Drawlevel: string;
  LuckyRate: number;
  OrderNo: number;
  DrawNum: number;
  WinCount: number;
  SurplusCount: number;
  CanWinCount: number;
}

interface SetCardTypeInfo {
  Id: string;
  Name: string;
}

export interface ChanceSetItem {
  Id: string;
  SetName: string;
  ChannelType: number;
  CardTypeCategory: number;
  TotalChanceCount: number;
  EverydayCount: number;
  ShareReadCount: number;
  NeedScores: number;
  RegisteCount: number;
  GetCount: number;
  UseCount: number;
  Enabled: number;
  CardTypeIds: string;
  CardTypeInfos: SetCardTypeInfo[];
}

export interface tableProps {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface SimpleLuckyDraw {
  LuckyDrawId: string;
  LuckyName: string
}

export interface CouponItemParams {
  CouponType?: number;
  Enable?: number;
}

export interface CouponItem {
  CouponId: string;
  CouponName: string;
}

export interface SysCardType {
  Id: string;
  CardTypeName: string;
}

export interface ActivityDetails {
  ProjectId: string;
  AcitivityId: string;
  AcitivityName: string;
  ProjectName: string;
  ActivityType: number;
  ActivityStartTimeSpan: number | null;
  ActivityEndTimeSpan: number | null;
  PublishTimeSpan: number | null;
  StartStatus: number;
  PublishStatus: number;
  LuckyType: number | null
}

export interface AdvancedProfileData {
  advancedOperation1: tableProps;
  advancedOperation2: tableProps;
  advancedOperation3: tableProps;
  advancedOperation4: tableProps;
  advancedOperation5: tableProps;
  advancedOperation6: tableProps;
  prizeType: SimpleLuckyDraw[];
  CouponItem: CouponItem[];
  CardTypes: SysCardType[];
  ActivityDetails: ActivityDetails;
}

export interface SaveLuckydrawItem {
  Id?: string;
  AcitivityId: string;
  DrawType: number;
  DrawName: string;
  DrawNum?: number;
  CouponId?: string;
  CouponSendNum?: number;
  PointSendvalue?: number;
  DrawLevel?: string;
  EveryActivityLimitNum?: number;
  EverydayLimitNum?: number;
  Orderno: number;
  LuckyRate: number;
  DrawimgurlSeed: string;
  DrawCategoryType: number
}

export interface LuckydrawItem {
  LuckyDrawId: string;
  DrawName:	string;
  DrawType: number;
  CouponId:	string;
  CouponName:	string;
  CouponCode:	string;
  Scores:	number;
  Drawlevel: string;
  LuckyRate: number;
  OrderNo: number;
  DrawNum: number;
  WinCount: number;
  SurplusCount: number;
  CanWinCount: number;
  CouponValue: any;
  DrawCategoryType: number;
  EveryDayLimitCount: number;
  TotalLimitCount: number;
  DrawImageUrl: string;
  Enabled: number;
}

export interface ChangeLuckyDrawStatus {
  luckyDrawId: number;
  status: number;
}

export interface CreatePrizePoolItem {
  ActiivityId: string;
  GenerateType: number;
  DrawIds: string;
  CycleStartTime: string;
  CycleEndTime: string;
  TimePoints: string;
  GenerateCount: number;
  AppointTime: string;
}

export interface LuckyChanceItems {
  activityId: string;
  ChannelType: number;
  UserInfo: string;
  Enabled: number;
  UseStatus: number;
  StartTime: string;
  EndTime: string;
  Index: number;
  Size: number;
}

interface SetCardTypeInfo {
  Id: string;
  Name: string;
}

export interface columnsType {
  Id: string
  SetName: string
  ChannelType: number
  CardTypeCategory: number
  TotalChanceCount: number
  EverydayCount: number
  ShareReadCount: number | null
  NeedScores: number
  RegisteCount: number
  GetCount: number
  UseCount: number
  Enabled: number
  CardTypeIds: string | null
  CardTypeInfos: SetCardTypeInfo[]
}

export interface PoolDrawItemParam {
  ActivityId:	string;
  DrawId?:	string;
  ReleaseStatus?:	number;
  DrawLevel?:	string;
  Enabled?:	number;
  WinStatus?:	number;
  Name?: string;
  Phone?: string;
  ReleaseTimeS?: string;
  ReleaseTimeE?: string;
  WinTimeS?: string;
  WinTimeE?: string;
  Index?: number;
  Size?: number;
}



export interface EditPoolDrawItem {
  ActiivityId: string;
  Ids: string;
  ReleaseTime: string;
}

export interface LuckyRecords {
  activityId:	string;
  LuckyDrawId?:	string;
  LuckyDrawLevel?:	string;
  WinStatus?:	number;
  CardTypeId?:	string;
  WinnerName?:	string;
  WinnerPhone?: string;
  Index?: number;
  Size?: number;
}

export interface SendLuckyItem {
  openId: string;
  activityId: string;
  count: number;
}

export interface LuckyChanceEnableStatus {
  id: string;
  enableStatus: number;
}




