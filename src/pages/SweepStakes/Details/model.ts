import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { AdvancedProfileData } from './data.d';
import { GetActivityInfo, QueryActivityApplys, QueryActivityComments, QuerySysPerson, SaveActivityApply } from './service';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: AdvancedProfileData) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: AdvancedProfileData;
  effects: {
    fetchAdvanced: Effect;
    QueryActivityApplys: Effect;
    QueryActivityComments: Effect;
    QuerySysPerson: Effect;
    SaveActivityApply: Effect;
  };
  reducers: {
    show: Reducer<AdvancedProfileData>;
    updateActivityApply: Reducer<AdvancedProfileData>;
    updateActivityComments: Reducer<AdvancedProfileData>;
  };
}

const Model: ModelType = {
  namespace: 'sweepStakesAndDetails',
  state: {
    ActivityApply: {
      list: [],
      pagination: {}
    },
    ActivityComments: {
      list: [],
      pagination: {}
    }
  },
  effects: {
    *fetchAdvanced({ payload, callback }, { call, put }) {
      const response = yield call(GetActivityInfo, payload);
      const { Status, Data } = response;
      if(Status === 1 && callback) callback(Data)
    },
    *QueryActivityApplys({ payload, callback }, { call, put }) {
      const response = yield call(QueryActivityApplys, payload);
      const { Status, Data } = response;
      if(Status === 1 ) {
        const { TotalCount, PageIndex, PageCount, Items } = Data;
        yield put({
          type: 'updateActivityApply',
          payload: {
            list: Items,
            pagination: {
              current: PageIndex,
              pageSize: PageCount,
              total: TotalCount,
            }
          }
        })
      }
    },
    *QueryActivityComments({ payload, callback }, { call, put }) {
      const response = yield call(QueryActivityComments, payload);
      const { Status, Data } = response;
      if(Status === 1 ) {
        const { TotalCount, PageIndex, PageCount, Items } = Data;
        yield put({
          type: 'updateActivityComments',
          payload: {
            list: Items,
            pagination: {
              current: PageIndex,
              pageSize: PageCount,
              total: TotalCount,
            }
          }
        })
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
    *SaveActivityApply({ payload, callback }, { call, put }) {
      const response = yield call(SaveActivityApply, payload);
      const { Status, Msg } = response;
      if( Status === 1 ){
        callback && callback()
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
    updateActivityApply(state, { payload }) {
      return {
        ...state,
        ActivityApply: payload
      };
    },
    updateActivityComments(state, { payload }) {
      return {
        ...state,
        ActivityComments: payload
      };
    },


  },
};

export default Model;
