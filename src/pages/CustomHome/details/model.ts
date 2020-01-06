import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { addConfig, queryInfoById, saveConfig, saveGridConfig, getActivityList, saveActivityConfig, saveTitleBarConfig } from '../service';
import { pathMatchRegexp } from '@/utils';
import { CarouselDetailsType, GridDetailsType, ActivityType } from '@/pages/CustomHome/details/data';


export interface StateType {
  initData: any;
  ActivityList: Array<any>;
  carouselDetails: CarouselDetailsType;
  gridDetails: GridDetailsType;
  activityDetails: ActivityType;
  titleDetails: ActivityType;
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
    saveConfig: Effect;
    saveGridConfig: Effect;
    getActivityList: Effect;
    saveActivityConfig: Effect;
    saveTitleBarConfig: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    updateActivityList: Reducer<StateType>;
    edit: Reducer<StateType>;
    updateCarousel: Reducer<StateType>;
    updateGrid: Reducer<StateType>;
    updateActivity: Reducer<StateType>;
    updateTitle: Reducer<StateType>;
  };
  subscriptions: {
    setup: Subscription,
  };
}

const Model: ModelType = {
  namespace: 'customHomeDetails',
  state: {
    initData: [],
    ActivityList: [],
    carouselDetails: {//滚动屏设置信息
      ConfiId: "",
      Id: "",
      Images: [],
      IsFloat: 1,
      OrderNo: 1,
      RollingTime: 1000,
      type: 1,
    },
    gridDetails: {//功能菜单设置信息
      BackgroundColor: '',
      Buttons: [],
      ConfigId: '',
      FontColor: null,
      FontSize: 14,
      Id: '',
      OrderNo: 0,
      RowShowType: 0,
      StyleType: 0,
      type: 2,
    },
    activityDetails: {
      ConfigId: '',
      Id: '',
      Image: "",
      Name: "",
      OrderNo: 4,
      activityId: "",
      activityUrl: null,
      type: 5,
    },
    titleDetails: {
      BackColor: "#fff",
      BackImage: null,
      ConfigId: "e9631ced-c0e7-4354-bf2f-2cb7914d0a10",
      CustomLink: null,
      Fromabove: 0,
      FuncLink: "",
      FuncName: 0,
      FuncType: 0,
      HeadLine: "标题",
      HeadLineColor: "#333",
      HeadLineSize: 14,
      Id: "bb67bb50-15dd-4dea-b8a4-04ce9044bc2e",
      Istemplate: 1,
      LeftImage: null,
      OpenUrl: 0,
      OrderNo: 3,
      RightImage: null,
      RightWord: "更多",
      RightWordColor: "#999",
      RightWordSize: 14,
      ShowFunctionName: null,
      ShowFunctionType: null,
      type: 4,
    }
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryInfoById, payload);
      const { data, Status } = response;
      if(Status === 1){
        yield put({
          type: 'save',
          payload: { data },
        });
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addConfig, payload);
      const { Status } = response;
      if (Status === 1 && callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(queryInfoById, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *saveConfig({ payload, callback }, { call, put }) {
      const response = yield call(saveConfig, payload);
      const { Status } = response;
      if (Status === 1 && callback) callback();
    },
    *saveGridConfig({ payload, callback }, { call, put }) {
      const response = yield call(saveGridConfig, payload);
      const { Status, msg } = response;
      if (Status === 1 && callback) callback();
      else throw msg
    },
    *saveActivityConfig({ payload, callback }, { call, put }) {
      const response = yield call(saveActivityConfig, payload);
      const { Status, msg } = response;
      if (Status === 1 && callback) callback();
      else throw msg
    },
    *getActivityList({ payload }, { call, put }) {
      const response = yield call(getActivityList);
      const { Status, msg, data } = response;
      if (Status === 1) {
        yield put({
          type: 'updateActivityList',
          payload: {data},
        });
      }
      else throw msg
    },
    *saveTitleBarConfig({ payload, callback }, { call, put }) {
      const response = yield call(saveTitleBarConfig, payload);
      const { Status, msg } = response;
      if (Status === 1 && callback) callback();
      else throw msg
    },



  },
  reducers: {
    save(state, { payload: { data } }) {
      return { ...state, initData: data }
    },
    updateActivityList(state, { payload: { data } }) {
      return { ...state, ActivityList: data }
    },
    edit(state, { payload }) {
      return { ...state, initData: payload }
    },
    updateCarousel(state, { payload }) {
      return { ...state, carouselDetails: payload }
    },
    updateGrid(state, { payload }) {
      return { ...state, gridDetails: payload }
    },
    updateActivity(state, { payload }) {
      return { ...state, activityDetails: payload }
    },
    updateTitle(state, { payload }) {
      return { ...state, titleDetails: payload }
    },
  },

  subscriptions: {
    setup({ dispatch, history }): void {
      history.listen(({ pathname, query }: any): void => {
        const match = pathMatchRegexp('/customhome/details/:id', pathname);
        if (match) {
          const payload = { ConfigId: match[1]};
          dispatch({ type: 'fetch', payload })
        }
      });
    },
  },
};

export default Model;
