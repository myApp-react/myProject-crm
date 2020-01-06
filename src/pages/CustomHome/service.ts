import { stringify } from 'qs'
import request from '@/utils/request';

import { TableListPagination, TableListParams } from './data';
import { SaveConfigParams, TableListItem } from '@/pages/CustomHome/data';

//获取配置列表
export async function queryTableList(params: TableListPagination) {
  return request(`/MallHomePageConfig/QueryMallHomePageConfigs?${stringify(params)}`);
}

export async function queryInfoById(params: TableListParams) {
  return request(`/MallHomePageConfig/GetMallHomePageConfig?${stringify(params)}`);
}

//新增配置项目
export async function addConfig(params: TableListItem) {
  return request(`/MallHomePageConfig/SaveMallHomePageConfig?${stringify(params)}`);
}

export async function editConfigName(params: TableListParams) {
  return request(`/MallHomePageConfig/UpdMallHomePageConfigName?${stringify(params)}`);
}

export async function copyConfig(params: TableListParams) {
  return request(`/MallHomePageConfig/CopyMallConfig`, {
    method: 'POST',
    data: params,
  });
}

export async function removeConfig(params: TableListParams) {
  return request(`/MallHomePageConfig/RemoveMallHomePageConfig?${stringify(params)}`);
}

export async function releaseConfig(params: TableListParams) {
  return request(`/MallHomePageConfig/PublishMallHomePageConfig?${stringify(params)}`);
}

export async function saveConfig(params: SaveConfigParams) {
  return request(`/MallHomePageConfig/SaveMallRollingScreenImageConfig`, {
    method: 'POST',
    data: params,
  });
}

/**保存功能模块*/
export async function saveGridConfig(params: SaveConfigParams) {
  return request(`/MallHomePageConfig/SaveMallHomeFunctionModel`, {
    method: 'POST',
    data: params,
  });
}

/**保存推荐活动*/
export async function saveActivityConfig(params: SaveConfigParams) {
  return request(`/MallHomePageConfig/SaveMallactivity`, {
    method: 'POST',
    data: params,
  });
}

/**获取可以活动列表*/
export async function getActivityList() {
  return request(`/MallHomePageConfig/GetActivity`, {
    method: 'POST'
  });
}

/**获取可以活动列表*/
export async function saveTitleBarConfig(params: SaveConfigParams) {
  return request(`/MallHomePageConfig/SaveMalltitlebar`, {
    method: 'POST',
    data: params,
  });
}









