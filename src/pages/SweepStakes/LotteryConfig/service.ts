import request from 'umi-request';
import request1 from '@/utils/request'
import { stringify } from 'qs';
import { LuckyProps, LuckyTableRadiansProps } from './data'
import {
  ChangeLuckyDrawStatus,
  CouponItemParams,
  CreatePrizePoolItem, EditPoolDrawItem, LuckyChanceEnableStatus, LuckyChanceItems, LuckyRecords, PoolDrawItemParam,
  SaveLuckydrawItem, saveLuckyTableRadians, SendLuckyItem,
} from '@/pages/SweepStakes/LotteryConfig/data';
import { uploadParams } from '@/pages/SweepStakes/data';
const prefix = process.env.Prefix;


/**上传活动相关图片接口*/
export async function UploadActivityImage(params: uploadParams) {
  return request(`${prefix}/ActivityToUi/UploadActivityImage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**获取奖品列表*/
export async function QueryDrawItems(params: LuckyProps) {
  return request1(`/LuckyToUi/QueryDrawItems?${stringify(params)}`);
}


/**获取奖品简单信息列表接口 奖品类别*/
export async function GetSimpleLuckyDraws(params: LuckyTableRadiansProps) {
  return request(`${prefix}/LuckyToUi/GetSimpleLuckyDraws?${stringify(params)}`);
}

/**变更奖品状态接口*/
export async function ChangeLuckyDrawStatus(params: ChangeLuckyDrawStatus) {
  return request(`${prefix}/LuckyToUi/ChangeLuckyDrawStatus`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**删除奖品接口*/
export async function DeleteLuckyDraw(params: ChangeLuckyDrawStatus) {
  return request(`${prefix}/LuckyToUi/DeleteLuckyDraw`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}



/**获取代金券种类简单信息接口*/
export async function QuerySimpleCouponItem(params: CouponItemParams) {
  return request(`${prefix}/CouponToUi/QuerySimpleCouponItem?${stringify(params)}`);
}

/**保存奖品接口 修改同一接口*/
export async function SaveLuckydraw(params: SaveLuckydrawItem) {
  return request(`${prefix}/LuckyToUi/SaveLuckydraw`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**生成奖池接口*/
export async function GenerateLuckyPool(params: CreatePrizePoolItem) {
  return request(`${prefix}/LuckyToUi/GenerateLuckyPool`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}



/**查询奖品弧度列表接口*/
export async function QueryLuckyTableRadians(params: LuckyTableRadiansProps) {
  return request(`${prefix}/LuckyToUi/QueryLuckyTableRadians?${stringify(params)}`);
}

/**保存抽奖弧度接口*/
export async function SaveLuckyTableRadian(params: saveLuckyTableRadians) {
  return request(`${prefix}/LuckyToUi/SaveLuckyTableRadian`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**删除抽奖刻度接口*/
export async function DeleteLuckyTableRadian(params: LuckyTableRadiansProps) {
  return request(`${prefix}/LuckyToUi/DeleteLuckyTableRadian`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**查询抽奖机会设置列表接口*/
export async function QueryChanceSetItemContainer(params: LuckyTableRadiansProps) {
  return request(`${prefix}/LuckyToUi/QueryChanceSetItemContainer?${stringify(params)}`);
}

/**保存抽奖机会设置*/
export async function SaveLuckyChanceSet(params: LuckyTableRadiansProps) {
  return request(`${prefix}/LuckyToUi/SaveLuckyChanceSet`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**变更机会设置状态*/
export async function ChangeChanceSetEnable(params: LuckyTableRadiansProps) {
  return request(`${prefix}/LuckyToUi/ChangeChanceSetEnable`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**删除抽奖机会设置接口*/
export async function DeleteLuckyChanceSet(params: LuckyTableRadiansProps) {
  return request(`${prefix}/LuckyToUi/DeleteLuckyChanceSet`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}




/**获取活动详情*/
export async function GetActivityInfo(params: string) {
  return request(`${prefix}/ActivityToUi/GetActivityInfoById?${stringify(params)}`);
}


/**获取抽奖机会管理列表接口*/
export async function QueryLuckyChanceItems(params: LuckyChanceItems) {
  return request(`${prefix}/LuckyToUi/QueryLuckyChanceItems?${stringify(params)}`);
}


/**查询奖池记录接口*/
export async function QueryPoolDrawItemParam(params: PoolDrawItemParam) {
  return request(`${prefix}/LuckyToUi/QueryPoolDrawItemParam?${stringify(params)}`);
}

/**编辑奖池记录接口*/
export async function ChangeLuckyPoolItem(params: EditPoolDrawItem) {
  return request(`${prefix}/LuckyToUi/ChangeLuckyPoolItem`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**作废奖池项接口*/
export async function CancelLuckyPool(params: EditPoolDrawItem) {
  return request(`${prefix}/LuckyToUi/CancelLuckyPool`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**查询抽奖记录接口*/
export async function QueryLuckyRecords(params: LuckyRecords) {
  return request(`${prefix}/LuckyToUi/QueryLuckyRecords?${stringify(params)}`);
}

/**获取卡类型列表接口*/
export async function GetCardTypes(params: string) {
  return request(`${prefix}/CustomerToUi/GetCardTypes?${stringify(params)}`);
}



/**获取关注人员信息接口*/
export async function QuerySysPerson(params: string) {
  return request(`${prefix}/CustomerToUi/QuerySysPerson?${stringify(params)}`);
}

/**赠送抽奖机会接口*/
export async function SendLuckyChance(params: SendLuckyItem) {
  return request(`${prefix}/LuckyToUi/SendLuckyChance`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**变更抽奖机会状态接口*/
export async function ChangeLuckyChanceEnableStatus(params: LuckyChanceEnableStatus) {
  return request(`${prefix}/LuckyToUi/ChangeLuckyChanceEnableStatus`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

















