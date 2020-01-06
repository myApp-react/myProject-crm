import request from 'umi-request';
import { TableListParams, TableListItem } from './data.d';
import { stringify } from 'qs';
import { AddTableParams, uploadParams } from '@/pages/SweepStakes/data';
const prefix = process.env.Prefix;

/**获取活动列表接口*/
export async function GetActivityList(params: TableListItem) {
  return request(`${prefix}/ActivityToUi/GetActivityInfos?${stringify(params)}`);
}


export async function ChangeActivityPublishStatus(params: TableListParams) {
  return request(`${prefix}/ActivityToUi/ChangeActivityPublishStatus`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function DeleteActivity(params: TableListParams) {
  return request(`${prefix}/ActivityToUi/DeleteActivity`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**保存活动*/
export async function SaveAcivity(params: AddTableParams) {
  return request(`${prefix}/ActivityToUi/SaveAcitivity`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**上传活动相关图片接口*/
export async function UploadActivityImage(params: uploadParams) {
  return request(`${prefix}/ActivityToUi/UploadActivityImage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}




export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
