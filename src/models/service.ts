// import request from 'umi-request';
import request from '@/utils/request';
import { TableListItem } from './data.d';
import { stringify } from 'qs';

// const prefix = process.env.Prefix;
const prefix = ''

/**获取项目信息*/
export async function getProjectInfos() {
  return request(`${prefix}/BaseDataToUi/GetProjectInfos`);
}

/**获取全部服务点*/
export async function getServicePointInfos() {
  return request(`${prefix}/BaseDataToUi/GetServicePointInfos`);
}

/**获取全部商铺信息接口*/
export async function getStoreInfos() {
  return request(`${prefix}/BaseDataToUi/GetStoreInfos`);
}

/**查询会员信息接口*/
export async function queryCustomerInfo(params: TableListItem) {
  return request(`${prefix}/CustomerToUi/QueryCustomerInfo?${stringify(params)}`);
}

/**查询积分补录记录接口*/
export async function queryScoresSupplementItems(params: TableListItem) {
  return request(`${prefix}/ScoresSupplementToUi/QueryScoresSupplementItems?${stringify(params)}`);
}

/**获取积分补录计算结果接口*/
export async function getScoresSupplementContext(params: TableListItem) {
  return request(`${prefix}/ScoresSupplementToUi/GetScoresSupplementContext`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**积分补录操作接口*/
export async function scoresSupplementHandle(params: TableListItem) {
  return request(`${prefix}/ScoresSupplementToUi/ScoresSupplementHandle`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
/**-------------------*/
/**获取待审核小票补录信息接口*/
export async function getRepitExamineDto(params: TableListItem) {
  return request(`${prefix}/ScoresSupplementToUi/GetRepitExamineDto?${stringify(params)}`);
}

/**审核积分补录小票接口*/
export async function GetRepitExamineDto(params: TableListItem) {
  return request(`${prefix}/ScoresSupplementToUi/GetRepitExamineDto`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
/**-------------------*/
/**上传小票图片接口*/
export async function uploadTiketImage(params: TableListItem) {
  return request(`${prefix}/ScoresSupplementToUi/UploadTiketImage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
