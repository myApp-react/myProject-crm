import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import {
  queryScoresSupplementItems,
  getProjectInfos,
  getServicePointInfos,
  queryCustomerInfo,
  getRepitExamineDto,
  getScoresSupplementContext,
  uploadTiketImage,
  scoresSupplementHandle,
  RepitExamineHandle,
  QueryScoresSupplementSummary,
} from './service';

import { TableListData, ProjectParams, serviceParams, integralParams } from './data.d';
import { pathMatchRegexp } from '@/utils';

export interface integralType {
  data: TableListData;
  projectData: ProjectParams[];
  servicePointData: serviceParams[];
  integralRes: integralParams;
  totalData: {
    Amt: number,
    Scores: number
  }
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: integralType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: integralType;
  effects: {
    GetConfig: Effect;
    GetServicePoint: Effect;
    queryCustomerInfo: Effect;
    getRepitExamineDto: Effect;
    getScoresSupplementContext: Effect;
    uploadTiketImage: Effect;
    RepitExamineHandle: Effect;
    QueryScoresSupplementSummary: Effect;
    fetch: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<integralType>;
    saveProject: Reducer<integralType>;
    saveServicePoint: Reducer<integralType>;
    saveIntegralRes: Reducer<integralType>;
    updateTotal: Reducer<integralType>;

  };
  subscriptions: {
    setup: Subscription,
  };
}

const Model: ModelType = {
  namespace: 'integralList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    projectData: [],
    servicePointData: [],
    integralRes: {
      Rate: {
        Scores: 0,
        Money: 0,
      },
      Scores: 0,
      PlanNames: [],
    },
    totalData: {
      Amt: 0,
      Scores: 0
    }
  },

  effects: {
    *GetConfig({ payload }, { all, call, put }) {
      const response = yield call(getProjectInfos);
      const { Status, Data } = response;
      if(Status === 1){
        yield put({
          type: 'saveProject',
          payload: Data
        });
      }
    },
    *GetServicePoint({ payload }, { call, put }) {
      const response = yield call(getServicePointInfos);
      const { Status, Data } = response;
      if(Status === 1){
        yield put({
          type: 'saveServicePoint',
          payload: Data
        });
      }
    },
    *queryCustomerInfo({ payload, callback }, { call, put }) {
      const response = yield call(queryCustomerInfo, payload);
      const { Status, Data } = response;
      if(Status === 1 && callback){
        callback(Data)
      }
      if(Status === 2 && callback){
        callback(null)
      }
    },
    *getRepitExamineDto({ payload, callback }, { call, put }) {
      const response = yield call(getRepitExamineDto, payload);
      const { Status, Data } = response;
      if(Status === 1 && callback){
        callback(Data)
      }
    },
    *getScoresSupplementContext({ payload, callback }, { call, put }) {
      const response = yield call(getScoresSupplementContext, payload);
      const { Status, Data, Msg } = response;
      if(Status === 1 && callback ){
        callback(Data)
      }
      if(Status === 0 && callback ) {
        callback(null)
        throw {
          message: Msg
        }
      }
    },
    *uploadTiketImage({ payload, callback }, { call, put }) {
      const response = yield call(uploadTiketImage, payload);
      const { status, Data } = response;
      if(status === 1 && callback){
        callback(Data)
      }
    },
    *RepitExamineHandle({ payload, callback }, { call, put }) {
      const response = yield call(RepitExamineHandle, payload);
      const { Status, Data } = response;
      if(Status === 1 && callback){
        callback(Data)
      }
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryScoresSupplementItems, payload);
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
            },
          },
        });
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(scoresSupplementHandle, payload);
      const { Status, Msg } = response;
      if(Status === 1 && callback){
        callback();
      }
      else {
        throw {
          message: Msg
        }
      }
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(queryScoresSupplementItems, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(queryScoresSupplementItems, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *QueryScoresSupplementSummary({ payload, callback }, { call, put }) {
      const response = yield call(QueryScoresSupplementSummary, payload);
      const { Status, Data } = response;
      if (Status === 1 ) {
        yield put({
          type: 'updateTotal',
          payload: Data
        })
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
    saveProject(state, action) {
      return {
        ...state,
        projectData: action.payload,
      };
    },
    saveServicePoint(state, action) {
      return {
        ...state,
        servicePointData: action.payload,
      };
    },
    saveIntegralRes(state, action) {
      return {
        ...state,
        integralRes: action.payload,
      };
    },
    updateTotal(state, action) {
      return {
        ...state,
        totalData: action.payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }): void {
      history.listen(({ pathname, query }: any): void => {
        if (pathMatchRegexp('/integral', pathname)) {
          const payload = {
            Index: 1,
            Size: 15,
            ProjectId: '135f1c84-ad7f-42b8-9c7f-32ed7e5108c7'
          };
          dispatch({ type: 'fetch', payload })
          dispatch({type: 'QueryScoresSupplementSummary', payload: { ProjectId: '135f1c84-ad7f-42b8-9c7f-32ed7e5108c7' }})
        }
      });
    },
  },
};

export default Model;
