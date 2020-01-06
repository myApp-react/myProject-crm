import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { addConfig, queryTableList, editConfigName, copyConfig, removeConfig, releaseConfig } from './service';
import { pathMatchRegexp } from '@/utils';

import { TableListData } from './data';

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
    copy: Effect;
    release: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
  subscriptions: {
    setup: Subscription,
    setupRequestCancel: Subscription,
  };
}

const Model: ModelType = {
  namespace: 'customHome',

  state: {
    data: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTableList, payload);
      const { data, Status, Total } = response;
      if(Status === 1){
        yield put({
          type: 'save',
          payload: {
            list: data,
            pagination: {
              current: Number(payload.Skip),
              pageSize: Number(payload.Take),
              total: Total,
            },
          },
        })
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addConfig, payload);
      const { Status, msg } = response;
      if (Status === 1 && callback) callback();
      else throw msg
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeConfig, payload);
      const { Status, msg } = response;
      if (Status === 1 && callback) callback();
      else throw msg
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(editConfigName, payload);
      const { Status, msg } = response;
      if (Status === 1 && callback) callback();
      else throw msg
    },
    *copy({ payload, callback }, { call, put }) {
      const response = yield call(copyConfig, payload);
      const { Status, msg } = response;
      if (Status === 1 && callback) callback();
      else throw msg
    },
    *release({ payload, callback }, { call, put }) {
      const response = yield call(releaseConfig, payload);
      const { Status, msg } = response;
      if (Status === 1 && callback) callback();
      else throw msg
    },
  },

  reducers: {
    save(state, { payload }) {
      const { list, pagination } = payload
      return {
        ...state,
        data: { list, pagination }
      }
    },
  },
  subscriptions: {
    setupRequestCancel({ history }): void {
      history.listen((location) => {
        const { cancelRequest = new Map() }: any = window;
        cancelRequest.forEach((value: any, key: any) => {
          if (value.pathname !== location.pathname) {
            // value.cancel(CANCEL_REQUEST_MESSAGE)
            // cancelRequest.delete(key)
          }
        })
      })
    },
    setup({ dispatch, history }): void {
      history.listen(({ pathname, query }: any): void => {
        if (pathMatchRegexp('/customhome', pathname)) {
          // console.log('query', query.current ? { Skip: query.current, Take: query.pageSize } : { Skip: 1, Take: 10 })
          const payload = query.current ? { Skip: Number(query.current), Take: Number(query.pageSize) } : { Skip: 1, Take: 10 };
          dispatch({ type: 'fetch', payload })
        }
      });
    },
  },
};

export default Model;
