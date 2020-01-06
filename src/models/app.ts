import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { ProjectParams, serviceParams, storeParams } from './data.d';
import { getProjectInfos, getServicePointInfos, getStoreInfos } from './service';

export interface appType {
  projectData: ProjectParams[];
  servicePointData: serviceParams[];
  storeData: storeParams[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: appType) => T) => T },
) => void;

export interface GlobalModelType {
  namespace: string;
  state: appType;
  effects: {
    GetConfig: Effect;
    GetServicePoint: Effect;
    GetStoreInfo: Effect;
  };
  reducers: {
    saveProject: Reducer<appType>;
    saveServicePoint: Reducer<appType>;
    saveStore: Reducer<appType>;
  };
}

const GlobalModel: GlobalModelType = {
  namespace: 'app',
  state: {
    projectData: [],
    servicePointData: [],
    storeData: [],
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
    *GetStoreInfo({ payload }, { call, put }) {
      const response = yield call(getStoreInfos);
      const { Status, Data } = response;
      if(Status === 1){
        yield put({
          type: 'saveStore',
          payload: Data
        });
      }
    },
  },

  reducers: {
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
    saveStore(state, action) {
      return {
        ...state,
        storeData: action.payload,
      };
    },
  },
};

export default GlobalModel;
