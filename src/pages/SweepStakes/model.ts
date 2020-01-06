import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import {
  SaveAcivity,
  ChangeActivityPublishStatus,
  DeleteActivity,
  updateRule,
  GetActivityList,
  UploadActivityImage,

} from './service';

import { TableListData } from './data.d';
import { pathMatchRegexp } from '@/utils';

export interface StateType {
  data: TableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
    ChangeActivityPublishStatus: Effect;
    UploadActivityImage: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
  subscriptions: {
    setup: Subscription,
  };
}

const Model: ModelType = {
  namespace: 'sweepStakes',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(GetActivityList, payload);
      const { Status, Data } = response;
      if(Status === 1){
        const { TotalCount, List } = Data;
        yield put({
          type: 'save',
          payload: {
            list: List,
            pagination: {
              current: Number(payload.Index),
              pageSize: Number(payload.Size),
              total: TotalCount,
            }
          },
        });
      }

    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(SaveAcivity, payload);
      const { Status, Msg } = response;
      if(Status === 1) {
        if (callback) callback();
      }else {
        throw {
          message: Msg
        }
      }

    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(DeleteActivity, payload);
      const { Status, Msg } = response;
      if (Status === 1) {
        callback && callback();
      }else {
        throw {
          message: Msg
        }
      }
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *ChangeActivityPublishStatus({ payload, callback }, { call, put }) {
      const response = yield call(ChangeActivityPublishStatus, payload);
      const { Status, Msg } = response;
      if (Status === 1) {
        callback && callback();
      }else {
        throw {
          message: Msg
        }
      }
    },
    *UploadActivityImage({ payload, callback }, { call, put }) {
      const response = yield call(UploadActivityImage, payload);
      const { status, Msg, Data } = response;
      if (status === 1) {
        callback && callback(Data);
      }else {
        throw {
          message: Msg
        }
      }
    },



  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }): void {
      history.listen(({ pathname, query }: any): void => {
        if (pathMatchRegexp('/sweepstakes', pathname)) {
          const payload = query.current ? {
            Index: Number(query.current),
            Size: Number(query.pageSize),
            ProjectId: '135f1c84-ad7f-42b8-9c7f-32ed7e5108c7'
          } : { Index: 1, Size: 15, ProjectId: '135f1c84-ad7f-42b8-9c7f-32ed7e5108c7' };
          dispatch({type: 'GetConfig'});
          dispatch({ type: 'fetch', payload });
        }
      });
    },
  },
};

export default Model;
