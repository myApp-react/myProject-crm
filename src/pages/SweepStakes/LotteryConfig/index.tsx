import { Statistic, Descriptions } from 'antd';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import React, { PureComponent, lazy, Suspense } from 'react';

import { handleRefresh } from '@/utils';
import { Action, Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { AdvancedProfileData } from './data.d';
import styles from './style.less';

const PrizeManager = lazy(() => import('./components/PrizeManager'));
const PrizeRangeManager = lazy(() => import('./components/PrizeRangeManager'));
const LotteryChanceSet = lazy(() => import('./components/LotteryChanceSet'));
const LotteryChanceManager = lazy(() => import('./components/LotteryChanceManager'));
const PrizePool = lazy(() => import('./components/PrizePool'));
const PrizeList = lazy(() => import('./components/PrizeList'));

const activityMap = ['', '普通活动', '', '', '抽奖活动', '', ''];
const DateFormat = 'YYYY-MM-DD HH:mm:ss';
const startStatus = ['未开始', '已开始', '已结束'];
const status = ['未发布', '已发布', '取消发布'];

const tabTurntableList = [
  {
    key: 'PrizeManager',
    tab: '奖品管理',
  },
  {
    key: 'PrizeRangeManager',
    tab: '奖品弧度管理',
  },
  {
    key: 'LotteryChanceSet',
    tab: '抽奖机会设置',
  },
  {
    key: 'LotteryChanceManager',
    tab: '抽奖机会管理',
  },
  {
    key: 'PrizePool',
    tab: '奖池管理',
  },
  {
    key: 'PrizeList',
    tab: '抽奖记录',
  },
]



const tabList = [
  {
    key: 'PrizeManager',
    tab: '奖品管理',
  },
  {
    key: 'LotteryChanceSet',
    tab: '抽奖机会设置',
  },
  {
    key: 'LotteryChanceManager',
    tab: '抽奖机会管理',
  },
  {
    key: 'PrizePool',
    tab: '奖池管理',
  },
  {
    key: 'PrizeList',
    tab: '抽奖记录',
  },
]



interface DetailsProps {
  loading: {
    models: {
      [key: string]: boolean;
    };
    effects: {
      [key: string]: boolean;
    }
  };
  LotteryConfigDetails: AdvancedProfileData;
  dispatch: Dispatch<
    Action<
      | 'LotteryConfigDetails/fetchAdvanced'
      | 'LotteryConfigDetails/QueryLuckyTableRadians'
      | 'LotteryConfigDetails/QueryChanceSetItemContainer'
      | 'LotteryConfigDetails/SaveLuckyTableRadian'
      | 'LotteryConfigDetails/GetSimpleLuckyDraws'
      | 'LotteryConfigDetails/QuerySimpleCouponItem'
      >
    >;
  location: any;
}

interface DetailsState {
  tabActiveKey: string;
}

@connect(
  ({
     LotteryConfigDetails,
    loading,
  }: {
    LotteryConfigDetails: AdvancedProfileData;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    LotteryConfigDetails,
    loading,
  }),
)
class Details extends PureComponent<DetailsProps, DetailsState> {
  public state: DetailsState = {
    tabActiveKey: 'PrizeManager',
  };

  componentDidMount() {
    const { location } = this.props;
    if(location.query && Object.keys(location.query).length){
      this.setState({
        tabActiveKey: location.query.key
      })
    }
  }

  onTabChange = (tabActiveKey: string) => {
    const { location } = this.props;
    this.setState({ tabActiveKey }, () => {
      handleRefresh({key: tabActiveKey}, location)
    });

  };

  render() {
    const { tabActiveKey } = this.state;
    const { LotteryConfigDetails, location } = this.props;
    const { ActivityDetails  } = LotteryConfigDetails;
    const {
      PublishStatus,
      StartStatus,
      AcitivityName,
      ActivityType,
      ProjectName,
      PublishTimeSpan,
      ActivityStartTimeSpan,
      ActivityEndTimeSpan,
      LuckyType
    } = ActivityDetails;

    const extra = (
      <div className={styles.moreInfo}>
        <Statistic title="开始状态" value={startStatus[StartStatus]} />
        <Statistic title="发布状态" value={status[PublishStatus]} />
      </div>
    );

    const description = (
      <RouteContext.Consumer>
        {({ isMobile }) => (
          <Descriptions className={styles.headerList} size="small" column={isMobile ? 1 : 2}>
            <Descriptions.Item label="项目名称">{ProjectName}</Descriptions.Item>
            <Descriptions.Item label="活动类型">{activityMap[ActivityType]}</Descriptions.Item>
            <Descriptions.Item label="发布时间">{PublishTimeSpan && moment(PublishTimeSpan).format(DateFormat) || '无'}</Descriptions.Item>
            <Descriptions.Item label="活动时间">
              {
                ActivityStartTimeSpan &&
                ActivityEndTimeSpan &&
                moment(ActivityStartTimeSpan).format(DateFormat)+ ' 至 ' +moment(ActivityEndTimeSpan).format(DateFormat)
              }</Descriptions.Item>
          </Descriptions>
        )}
      </RouteContext.Consumer>
    );

    const contentList = {
      PrizeManager: (
        <Suspense fallback={null}>
          <PrizeManager location={location} />
        </Suspense>
      ),
      PrizeRangeManager: (
        <Suspense fallback={null}>
          <PrizeRangeManager location={location} />
        </Suspense>
      ),
      LotteryChanceSet: (
        <Suspense fallback={null}>
          <LotteryChanceSet
            location={location}
          />
        </Suspense>
      ),
      LotteryChanceManager: (
        <Suspense fallback={null}>
          <LotteryChanceManager
            location={location}
          />
        </Suspense>
      ),
      PrizePool: (
        <Suspense fallback={<div>loading...</div>}>
          <PrizePool
            location={location}
          />
        </Suspense>
      ),
      PrizeList: (
        <Suspense fallback={<div>loading...</div>}>
          <PrizeList
            location={location}
          />
        </Suspense>
      ),
    };
    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        title={`活动名称：${AcitivityName}`}
        className={styles.pageHeader}
        content={description}
        extraContent={extra}
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
        animated={false}
        tabList={LuckyType && LuckyType === 1 ? tabTurntableList : tabList}
      >
        <div className={styles.main}>
          <GridContent>
            { contentList[tabActiveKey] }
          </GridContent>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Details;
