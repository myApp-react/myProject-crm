import request from 'umi-request';
import { stringify } from 'qs';
import { ActivityApplysItem, ActivityCommentsItem } from '@/pages/SweepStakes/Details/data';
const prefix = process.env.Prefix;

/**获取关注人员信息接口*/
export async function QuerySysPerson(params: string) {
  return request(`${prefix}/CustomerToUi/QuerySysPerson?${stringify(params)}`);
}

/**获取活动详情*/
export async function GetActivityInfo(params: string) {
  return request(`${prefix}/ActivityToUi/GetActivityInfoById?${stringify(params)}`);
}

/**查询活动报名信息列表接口*/
export async function QueryActivityApplys(params: ActivityApplysItem) {
  return request(`${prefix}/ActivityToUi/QueryActivityApplys?${stringify(params)}`);
}

/**删除指定报名记录接口*/
export async function DeleteActivityApplyInfo(params: ActivityApplysItem) {
  return request(`${prefix}/ActivityToUi/DeleteActivityApplyInfo`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**保存报名记录接口*/
export async function SaveActivityApply(params: ActivityApplysItem) {
  return request(`${prefix}/ActivityToUi/SaveActivityApply`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**查询活动评论接口*/
export async function QueryActivityComments(params: ActivityCommentsItem) {
  return request(`${prefix}/ActivityToUi/QueryActivityComments?${stringify(params)}`);
}

/**删除活动评论接口*/
export async function DeleteActivityComment(params: ActivityCommentsItem) {
  return request(`${prefix}/ActivityToUi/DeleteActivityComment`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}





