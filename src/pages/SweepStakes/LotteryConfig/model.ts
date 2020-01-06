import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap, Subscription } from 'dva';
import { AdvancedProfileData } from './data.d';
import {
  QueryDrawItems,
  QueryLuckyTableRadians,
  QueryChanceSetItemContainer,
  GetActivityInfo,
  SaveLuckyTableRadian,
  GetSimpleLuckyDraws,
  QuerySimpleCouponItem,
  SaveLuckydraw,
  UploadActivityImage,
  ChangeLuckyDrawStatus,
  DeleteLuckyDraw,
  GenerateLuckyPool,
  DeleteLuckyTableRadian,
  SaveLuckyChanceSet,
  ChangeChanceSetEnable,
  DeleteLuckyChanceSet,
  QueryLuckyChanceItems,
  QueryPoolDrawItemParam,
  QueryLuckyRecords,
  ChangeLuckyPoolItem,
  CancelLuckyPool,
  QuerySysPerson,
  SendLuckyChance,
  GetCardTypes,
  ChangeLuckyChanceEnableStatus,
} from './service';
import { pathMatchRegexp } from '@/utils';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: AdvancedProfileData) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: AdvancedProfileData;
  effects: {
    fetchAdvanced: Effect;
    QueryLuckyTableRadians: Effect;
    QueryChanceSetItemContainer: Effect;
    GetActivityInfo: Effect;
    SaveLuckyTableRadian: Effect;
    GetSimpleLuckyDraws: Effect;
    QuerySimpleCouponItem: Effect;
    SaveLuckydraw: Effect;
    UploadActivityImage: Effect;
    ChangeLuckyDrawStatus: Effect;
    DeleteLuckyDraw: Effect;
    GenerateLuckyPool: Effect;
    DeleteLuckyTableRadian: Effect;
    SaveLuckyChanceSet: Effect;
    ChangeChanceSetEnable: Effect;
    DeleteLuckyChanceSet: Effect;
    QueryLuckyChanceItems: Effect;
    QueryPoolDrawItemParam: Effect;
    QueryLuckyRecords: Effect;
    ChangeLuckyPoolItem: Effect;
    CancelLuckyPool: Effect;
    QuerySysPerson: Effect;
    SendLuckyChance: Effect;
    GetCardTypes: Effect;
    ChangeLuckyChanceEnableStatus: Effect;
  };
  reducers: {
    show: Reducer<AdvancedProfileData>;
    updateTab1: Reducer<AdvancedProfileData>;
    updateTab2: Reducer<AdvancedProfileData>;
    updateTab3: Reducer<AdvancedProfileData>;
    updateTab4: Reducer<AdvancedProfileData>;
    updateTab5: Reducer<AdvancedProfileData>;
    updateTab6: Reducer<AdvancedProfileData>;
    updatePrizeType: Reducer<AdvancedProfileData>;
    updateCouponItem: Reducer<AdvancedProfileData>;
    updateCardType: Reducer<AdvancedProfileData>;
    updateDetails: Reducer<AdvancedProfileData>;
  };
  subscriptions: {
    setup: Subscription,
  };
}

const Model: ModelType = {
  namespace: 'LotteryConfigDetails',

  state: {
    advancedOperation1: {
      list: [],
      pagination: {},
    },
    advancedOperation2: {
      list: [],
      pagination: {},
    },
    advancedOperation3: {
      list: [],
      pagination: {},
    },
    advancedOperation4: {
      list: [],
      pagination: {},
    },
    advancedOperation5: {
      list: [],
      pagination: {},
    },
    advancedOperation6: {
      list: [],
      pagination: {},
    },
    prizeType: [],
    CouponItem: [],
    CardTypes: [],
    ActivityDetails: {
      AcitivityId: '',
      ProjectId: '',
      AcitivityName: '',
      ProjectName: '',
      ActivityType: 0,
      ActivityStartTimeSpan: null,
      ActivityEndTimeSpan: null,
      PublishTimeSpan: null,
      StartStatus: 0,
      PublishStatus: 0,
      LuckyType: null
    }
  },

  effects: {
    *fetchAdvanced({ payload }, { call, put }) {
      const response = yield call(QueryDrawItems, payload);
      const { Status, Data } = response;
      if(Status === 1) {
        const { TotalCount, Items } = Data;
        yield put({
          type: 'updateTab1',
          payload: {
            list: Items,
            pagination: {
              current: Number(payload.Index),
              pageSize: Number(payload.Size),
              total: TotalCount,
            }
          },
        });
      }
    },
    *QueryLuckyTableRadians({ payload }, { call, put }) {
      const response = yield call(QueryLuckyTableRadians, payload);
      const { Status, Data } = response;
      if(Status === 1) {
        const { TotalCount, Items } = Data;
        yield put({
          type: 'updateTab2',
          payload: {
            list: Items,
            pagination: {
              current: Number(payload.Index),
              pageSize: Number(payload.Size),
              total: TotalCount,
            }
          },
        });
      }
    },
    *QueryChanceSetItemContainer({ payload }, { call, put }) {
      const response = yield call(QueryChanceSetItemContainer, payload);
      const { Status, Data } = response;
      if(Status === 1) {
        const { TotalCount, Items } = Data;
        yield put({
          type: 'updateTab3',
          payload: {
            list: Items,
            pagination: {
              current: Number(payload.Index),
              pageSize: Number(payload.Size),
              total: TotalCount,
            }
          },
        });
      }
    },
    *QueryLuckyChanceItems({ payload }, { call, put }) {
      const response = yield call(QueryLuckyChanceItems, payload);
      const { Status, Data } = response;
      if(Status === 1) {
        const { TotalCount, Items } = Data;
        yield put({
          type: 'updateTab4',
          payload: {
            list: Items,
            pagination: {
              current: Number(payload.Index),
              pageSize: Number(payload.Size),
              total: TotalCount,
            }
          },
        });
      }
    },
    *QueryPoolDrawItemParam({ payload }, { call, put }) {
      const response = yield call(QueryPoolDrawItemParam, payload);
      const { Status, Data } = response;
      if(Status === 1) {
        const { TotalCount, Items } = Data;
        yield put({
          type: 'updateTab5',
          payload: {
            list: Items,
            pagination: {
              current: Number(payload.Index),
              pageSize: Number(payload.Size),
              total: TotalCount,
            }
          },
        });
      }
    },
    *QueryLuckyRecords({ payload }, { call, put }) {
      const response = yield call(QueryLuckyRecords, payload);
      const { Status, Data } = response;
      if(Status === 1) {
        const { TotalCount, Items } = Data;
        yield put({
          type: 'updateTab6',
          payload: {
            list: Items,
            pagination: {
              current: Number(payload.Index),
              pageSize: Number(payload.Size),
              total: TotalCount,
            }
          },
        });
      }
    },


    *GetActivityInfo({ payload, callback }, { call, put }) {
      const response = yield call(GetActivityInfo, payload);
      const { Status, Data } = response;
      if(Status === 1) {
        const {
          ProjectId,
          AcitivityId,
          AcitivityName,
          ProjectName,
          ActivityType,
          ActivityStartTimeSpan,
          ActivityEndTimeSpan,
          PublishTimeSpan,
          StartStatus,
          PublishStatus,
          LuckyType
        } = Data;
        yield put({
          type: 'updateDetails',
          payload: {
            ProjectId,
            AcitivityId,
            AcitivityName,
            ProjectName,
            ActivityType,
            ActivityStartTimeSpan,
            ActivityEndTimeSpan,
            PublishTimeSpan,
            StartStatus,
            PublishStatus,
            LuckyType
          }
        })
      }
    },
    *SaveLuckyTableRadian({ payload, callback }, { call, put }) {
      const response = yield call(SaveLuckyTableRadian, payload);
      const { Status, Msg } = response;
      if(Status === 1 ) {
        callback && callback()
      }else {
        throw {
          message: Msg
        }
      }
    },
    *GetSimpleLuckyDraws({ payload, callback }, { call, put }) {
      const response = yield call(GetSimpleLuckyDraws, payload);
      const { Status, Data } = response;
      if(Status === 1 ) {
        yield put({
          type: 'updatePrizeType',
          payload: Data
        })
      }
    },
    *QuerySimpleCouponItem({ payload, callback }, { call, put }) {
      const response = yield call(QuerySimpleCouponItem, payload);
      const { Status, Data, Msg } = response;
      if(Status === 1 ) {
        yield put({
          type: 'updateCouponItem',
          payload: Data
        })
      }else {
        throw {
          message: Msg
        }
      }
    },
    *SaveLuckydraw({ payload, callback }, { call, put }) {
      const response = yield call(SaveLuckydraw, payload);
      const { Status, Msg } = response;
      if( Status === 1 ){
        callback && callback()
      }else {
        throw {
          message: Msg
        }
      }
    },
    *UploadActivityImage({ payload, callback }, { call, put }) {
      const response = yield call(UploadActivityImage, payload);
      const { status, Msg, Data } = response;
      if( status === 1 ){
        callback && callback(Data)
      }else {
        throw {
          message: Msg
        }
      }
    },
    *ChangeLuckyDrawStatus({ payload, callback }, { call, put }) {
      const response = yield call(ChangeLuckyDrawStatus, payload);
      const { Status } = response;
      if( Status === 1 ){
        callback && callback(true)
      }else {
        callback && callback(false)
      }
    },
    *DeleteLuckyDraw({ payload, callback }, { call, put }) {
      const response = yield call(DeleteLuckyDraw, payload);
      const { Status } = response;
      if( Status === 1 ){
        callback && callback(true)
      }else {
        callback && callback(false)
      }
    },
    *GenerateLuckyPool({ payload, callback }, { call, put }) {
      const response = yield call(GenerateLuckyPool, payload);
      const { Status, Msg } = response;
      if( Status === 1 ){
        callback && callback()
      }else {
        throw {
          message: Msg
        }
      }
    },
    *DeleteLuckyTableRadian({ payload, callback }, { call, put }) {
      const response = yield call(DeleteLuckyTableRadian, payload);
      const { Status, Msg } = response;
      if( Status === 1 ){
        callback && callback()
      }else {
        throw {
          message: Msg
        }
      }
    },
    *SaveLuckyChanceSet({ payload, callback }, { call, put }) {
      const response = yield call(SaveLuckyChanceSet, payload);
      const { Status, Msg } = response;
      if( Status === 1 ){
        callback && callback()
      }else {
        throw {
          message: Msg
        }
      }
    },
    *ChangeChanceSetEnable({ payload, callback }, { call, put }) {
      const response = yield call(ChangeChanceSetEnable, payload);
      const { Status, Msg } = response;
      if( Status === 1 ){
        callback && callback()
      }else {
        throw {
          message: Msg
        }
      }
    },
    *DeleteLuckyChanceSet({ payload, callback }, { call, put }) {
      const response = yield call(DeleteLuckyChanceSet, payload);
      const { Status, Msg } = response;
      if( Status === 1 ){
        callback && callback()
      }else {
        throw {
          message: Msg
        }
      }
    },
    *ChangeLuckyPoolItem({ payload, callback }, { call, put }) {
      const response = yield call(ChangeLuckyPoolItem, payload);
      const { Status, Msg } = response;
      if( Status === 1 ){
        callback && callback()
      }else {
        throw {
          message: Msg
        }
      }
    },
    *CancelLuckyPool({ payload, callback }, { call, put }) {
      const response = yield call(CancelLuckyPool, payload);
      const { Status, Msg } = response;
      if( Status === 1 ){
        callback && callback()
      }else {
        throw {
          message: Msg
        }
      }
    },
    *QuerySysPerson({ payload, callback }, { call, put }) {
      const response = yield call(QuerySysPerson, payload);
      const { Status, Msg, Data } = response;
      if( Status === 1 ){
        callback && callback(Data)
      }else {
        callback && callback(Data)
      }
    },
    *SendLuckyChance({ payload, callback }, { call, put }) {
      const response = yield call(SendLuckyChance, payload);
      const { Status, Msg } = response;
      if( Status === 1 ){
        callback && callback()
      }else {
        throw {
          message: Msg
        }
      }
    },
    *GetCardTypes({ payload, callback }, { call, put }) {
      const response = yield call(GetCardTypes, payload);
      const { Status, Msg, Data } = response;
      if( Status === 1 ){
        yield put({
          type: 'updateCardType',
          payload: Data
        })
      }else {
        throw {
          message: Msg
        }
      }
    },
    *ChangeLuckyChanceEnableStatus({ payload, callback }, { call, put }) {
      const response = yield call(ChangeLuckyChanceEnableStatus, payload);
      const { Status, Msg } = response;
      if( Status === 1 ){
        callback && callback();
      }else {
        throw { message: Msg }
      }
    },







  },
  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    updateTab1(state, action) {
      return {
        ...state,
        advancedOperation1: action.payload,
      };
    },
    updateTab2(state, action) {
      return {
        ...state,
        advancedOperation2: action.payload,
      };
    },
    updateTab3(state, action) {
      return {
        ...state,
        advancedOperation3: action.payload,
      };
    },
    updateTab4(state, action) {
      return {
        ...state,
        advancedOperation4: action.payload,
      };
    },
    updateTab5(state, action) {
      return {
        ...state,
        advancedOperation5: action.payload,
      };
    },
    updateTab6(state, action) {
      return {
        ...state,
        advancedOperation6: action.payload,
      };
    },

    updatePrizeType(state, action) {
      return {
        ...state,
        prizeType: action.payload,
      };
    },
    updateCouponItem(state, action) {
      return {
        ...state,
        CouponItem: action.payload,
      };
    },
    updateCardType(state, action) {
      return {
        ...state,
        CardTypes: action.payload,
      };
    },
    updateDetails(state, action) {
      return {
        ...state,
        ActivityDetails: action.payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }): void {
      history.listen(({ pathname, query }: any): void => {
        const match = pathMatchRegexp('/sweepstakes/lotteryconfig/:id', pathname);
        if(match){
          dispatch({
            type: 'GetActivityInfo',
            payload: {
              AcitivityId: match[1]
            }
          });
        }
      });
    },
  },
};

export default Model;
