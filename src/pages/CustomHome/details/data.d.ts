export interface ImagesType {
  FunctionName: any
  FunctionType: number
  Id: string
  ImageUrl: string
  LinkType: number
  LinkUrl: string
  OrderNo: number
  RollingScreenConfigId: string
  ShowFunctionName: any
  ShowFunctionType: string
  ShowFunctionUrl: any
  Title: string
}


export interface CarouselDetailsType {
  ConfiId: string;
  Id: string;
  Images: Array<ImagesType>;
  IsFloat: number;
  OrderNo: number;
  RollingTime: any;
  type: number;
}

export interface ButtonsType {
  FunctionName: any
  FunctionType: number
  Id: string
  ImageUrl: string
  LinkType: number
  LinkUrl: string
  ModelId: string
  Name: string
  OrderNo: number
  ShowFunctionName: any
  ShowFunctionType: string
  ShowFunctionUrl: any
}

export interface GridDetailsType {
  BackgroundColor: string;
  Buttons: ButtonsType;
  ConfigId: string;
  FontColor: any;
  FontSize: number;
  Id: string;
  OrderNo: number;
  RowShowType: number;
  StyleType: number;
  type: number;
}

export interface ActivityType {
  ConfigId: string
  Id: string
  Image: string
  Name: string
  OrderNo: number
  activityId: string
  activityUrl: any
  type: number
}

export interface TitleType {
  BackColor: string
  BackImage: any
  ConfigId: string
  CustomLink: any
  Fromabove: number
  FuncLink: string
  FuncName: number
  FuncType: number
  HeadLine: string
  HeadLineColor: string
  HeadLineSize: number
  Id: string
  Istemplate: number
  LeftImage: any
  OpenUrl: any
  OrderNo: number
  RightImage: any
  RightWord: string
  RightWordColor: string
  RightWordSize: number
  ShowFunctionName: any
  ShowFunctionType: any
  type: number
}




