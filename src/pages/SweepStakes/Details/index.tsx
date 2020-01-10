import {
  Badge,
  Button,
  Card,
  Statistic,
  Descriptions,
  Divider,
  Icon,
  Popover,
  Steps,
  Table,
  Tooltip,
  Radio,
  DatePicker,
  Empty,
  Form,
  Input,
  Select, message,
} from 'antd';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import React, { Component, lazy, Suspense } from 'react';

import moment from 'moment';
import { Action, Dispatch } from 'redux';
import { connect } from 'dva';
import { pathMatchRegexp } from '@/utils'
import { AdvancedProfileData } from './data.d';
import styles from './style.less';
import { FormComponentProps } from 'antd/es/form';
import { Prefix } from '@/utils/constant'
import { CustomerInfo } from '@/pages/SweepStakes/LotteryConfig/components/LotteryChanceManager';

const Search = Input.Search;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const DateFormater = 'YYYY.MM.DD HH:mm:ss';
const activityMap = ['', '普通活动', '', '', '抽奖活动', '', ''];
const LuckyTypeMap = ['', '大转盘', '开宝箱', '刮刮乐', '砸金蛋'];
const startStatus = ['未开始', '已开始', '已结束'];
const status = ['未发布', '已发布', '取消发布'];
const ApplyMap = ['否', '是'];
const SignInStatusMap = ['未签到', '已签到'];
const EnabledStatusMap = ['禁用', '启用'];

const ApplyTable = lazy(() => import('./components/ApplyTable'))
const AddActivityApply = lazy(() => import('./components/AddActivityApply'))

const columns = [
  {
    title: '会员名称',
    dataIndex: 'CustomerName',
  },
  {
    title: '电话',
    dataIndex: 'Phone',
  },
  {
    title: '报名时间',
    dataIndex: 'ApplyTimeSpan',
    render: (val: number) => moment(val).format(DateFormater),
  },
  {
    title: '签到时间',
    dataIndex: 'SignInTimeSpan',
    render: (val: number) => {
      if(val) return moment(val).format(DateFormater)
      return '-'
    }
  },
  {
    title: '签到状态',
    dataIndex: 'SignInStatus',
    render: (val: number) => SignInStatusMap[val]
  },
  {
    title: '启用状态',
    dataIndex: 'Enabled',
    render: (val: number) => EnabledStatusMap[val]
  },
];



interface DetailsProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'sweepStakesAndDetails/fetchAdvanced'
      | 'sweepStakesAndDetails/QueryActivityApplys'
      | 'sweepStakesAndDetails/QueryActivityComments'
      | 'sweepStakesAndDetails/QuerySysPerson'
      | 'sweepStakesAndDetails/SaveActivityApply'
      >
    >;
  loading: boolean;
  sweepStakesAndDetails: AdvancedProfileData;
  location: any
}

interface DetailsType {
  AcitivityId: string;
  AcitivityName: string
  ProjectName: string
  ProjectId: string
  ActivityType: number
  ActivityStartTime: string
  ActivityStartTimeSpan: number
  ActivityEndTime: string
  ActivityEndTimeSpan: number
  PublishTime: string | null
  PublishTimeSpan: number
  Publisher: string | null
  Phone: string
  Creater: string
  CreateTime: string
  CreateTimeSpan: number
  ActivityImageUrl: string
  IsNeedApply: number
  IsRecommand: null
  ApplyScores: number
  ApplyStartTime: string | null
  ApplyStartTimeSpan: number | null
  ApplyEndTime: string | null
  ApplyEndTimeSpan: number | null
  ApplyTip: string
  ApplyMaxCount: number
  IsNeedSignIn: number
  Director: string
  ShareImageUrl: string | null
  ShareNote: string
  Note: string
  ActivityDetail: string
  PublishStatus: number
  StartStatus: number
  LuckyType: number
};

interface DetailsState {
  operationKey: string;
  tabActiveKey: string;
  activityDetails: DetailsType
  AddModalVisble: boolean;
  AddFlagVal: {
    [key: string] : boolean
  }
}

@connect(
  ({
    sweepStakesAndDetails,
    loading,
  }: {
    sweepStakesAndDetails: AdvancedProfileData;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    sweepStakesAndDetails,
    loading: loading.effects['sweepStakesAndDetails/fetchAdvanced'],
  }),
)
class Details extends Component<DetailsProps, DetailsState> {

  state: DetailsState = {
    operationKey: 'tab1',
    tabActiveKey: 'detail',
    AddModalVisble: false,
    AddFlagVal: {},
    activityDetails: {
      AcitivityId: '',
      AcitivityName: "",
      ProjectName: "",
      ProjectId: "",
      ActivityType: 999,
      ActivityStartTime: "",
      ActivityStartTimeSpan: 0,
      ActivityEndTime: "",
      ActivityEndTimeSpan: 0,
      PublishTime: null,
      PublishTimeSpan: null,
      Publisher: null,
      Phone: "",
      Creater: "",
      CreateTime: "",
      CreateTimeSpan: 0,
      ActivityImageUrl: "",
      IsNeedApply: 0,
      IsRecommand: null,
      ApplyScores: 0,
      ApplyStartTime: null,
      ApplyStartTimeSpan: null,
      ApplyEndTime: null,
      ApplyEndTimeSpan: null,
      ApplyTip: "",
      ApplyMaxCount: 0,
      IsNeedSignIn: 0,
      Director: "",
      ShareImageUrl: null,
      ShareNote: "",
      Note: "",
      ActivityDetail: '',
      PublishStatus: 12,
      StartStatus: 12,
      LuckyType: 0,
    },

  };

  commentsColumns = [
    {
      title: '会员名称',
      dataIndex: 'UserName',
    },
    {
      title: '电话',
      dataIndex: 'UserPhone',
    },
    {
      title: '评论时间戳',
      dataIndex: 'CreateTimeSpan',
    },
    {
      title: '评论内容',
      dataIndex: 'Comment',
    },
  ];

  componentDidMount() {
    this.GetActivityDetails();
  }

  GetActivityDetails = () => {
    const { dispatch, location } = this.props;
    const match = pathMatchRegexp('/sweepstakes/details/:id', location.pathname);
    if(match) {
      dispatch({
        type: 'sweepStakesAndDetails/fetchAdvanced',
        payload: { AcitivityId: match[1]},
        callback: (res: DetailsType) => {
          this.setState({activityDetails: res})
          // console.log(res)
          if(res.IsNeedApply === 1){
            this.GetApplysListHandle();
          }
        }
      });
    }
  }

  //报名详情
  GetApplysListHandle = (params?: { UserInfo?: string, SignInStatus?: number, Index?: number, Size?: number }) => {
    const { dispatch, location } = this.props;
    const match = pathMatchRegexp('/sweepstakes/details/:id', location.pathname);
    if(match){
      dispatch({
        type: 'sweepStakesAndDetails/QueryActivityApplys',
        payload: {
          AcitivityId: match[1],
          Index: 1,
          Size: 10,
          ...params
        },
      });
    }
  }


  //评论
  GetCommentsListHandle = (params?: { UserInfo: string, StartTime: string, EndTime: string }) => {
    const { dispatch, location } = this.props;
    const match = pathMatchRegexp('/sweepstakes/details/:id', location.pathname);
    if(match) {
      dispatch({
        type: 'sweepStakesAndDetails/QueryActivityComments',
        payload: {
          AcitivityId: match[1],
          Index: 1,
          Size: 10,
          ...params
        },
      });
    }
  }

  onTabChange = (tabActiveKey: string) => {
    this.setState({ tabActiveKey });
  };

  SignInChangeHandle = (e: number | undefined) => {
    const { form } = this.props;
    const SignInStatus = e.target.value;
    const UserInfo = form.getFieldValue('UserInfo');
    const values = { SignInStatus, UserInfo };

    this.GetApplysListHandle(values);
  };

  searchByUserInfoHandle = (val: string) => {
    const { form } = this.props;
    const UserInfo = val;
    const SignInStatus = form.getFieldValue('SignInStatus');
    const values = { SignInStatus, UserInfo };

    this.GetApplysListHandle(values);
  }

  // 新增
  handleUpdateModalVisible = (flag?: boolean, record?: { [key: string] : boolean }) => {
    this.setState({
      AddModalVisble: !!flag,
      AddFlagVal: record || {},
    });
  };

  saveHandle = (fields: { id?: string, ActivityId: string, CustomerId: string, Note: string }, callback: () => void) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sweepStakesAndDetails/SaveActivityApply',
      payload: { ...fields },
      callback: () => {
        message.success('新增报名成功！');
        this.GetApplysListHandle();
        if(callback) callback();
      }
    })
  };

  //搜索用户
  SearchUserInfoHandle = (userInfo: string, callback: (data: CustomerInfo | null) => void) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sweepStakesAndDetails/QuerySysPerson',
      payload: { userInfo },
      callback: (data: CustomerInfo | null) => callback(data)
    })
  }

  render() {
    const { tabActiveKey, activityDetails, AddFlagVal, AddModalVisble } = this.state;
    const { sweepStakesAndDetails, loading, form } = this.props;
    const { ActivityApply, ActivityComments } = sweepStakesAndDetails;
    const {
      AcitivityName,
      ProjectName,
      ActivityType,
      ActivityStartTimeSpan,
      ActivityEndTimeSpan,
      PublishTimeSpan,
      Phone,
      Creater,
      CreateTime,
      Publisher,
      ActivityImageUrl,
      IsRecommand,
      IsNeedApply,
      IsNeedSignIn,
      ApplyScores,
      ApplyStartTimeSpan,
      ApplyEndTimeSpan,
      ActivityDetail,
      Director,
      ApplyMaxCount,
      ShareImageUrl,
      ShareNote,
      ApplyTip, PublishStatus, StartStatus, AcitivityId, LuckyType
    } = activityDetails;

    const description = (
      <RouteContext.Consumer>
        {({ isMobile }) => (
          <Descriptions className={styles.headerList} size='small'  column={isMobile ? 1 : 3}>
            <Descriptions.Item label="项目名称">{ProjectName}</Descriptions.Item>
            <Descriptions.Item label="活动类型">{activityMap[ActivityType]}</Descriptions.Item>
            {
              ActivityType === 4 && <Descriptions.Item label="活动类型">{LuckyTypeMap[LuckyType]}</Descriptions.Item>
            }
            <Descriptions.Item label="活动时间">{ActivityStartTimeSpan && `${moment(ActivityStartTimeSpan).format(DateFormater)} ~ ${moment(ActivityEndTimeSpan).format(DateFormater)}`}</Descriptions.Item>
            <Descriptions.Item label="发布时间">{PublishTimeSpan && moment(PublishTimeSpan).format(DateFormater) || '无'}</Descriptions.Item>
            <Descriptions.Item label="服务电话">{Phone || '无'}</Descriptions.Item>
            <Descriptions.Item label="创建人员">{Creater || '无'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{CreateTime && moment(CreateTime).format(DateFormater)}</Descriptions.Item>
            <Descriptions.Item label="发布人员">{Publisher || '无'}</Descriptions.Item>
          </Descriptions>
        )}
      </RouteContext.Consumer>
    );

    const extra = (
      <div className={styles.moreInfo}>
        <Statistic title="开始状态" value={startStatus[StartStatus]} />
        <Statistic title="发布状态" value={status[PublishStatus]} />
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <Form layout='inline' >
          <FormItem>
            {form.getFieldDecorator('SignInStatus', {
              initialValue: undefined
            })(
              <Radio.Group onChange={this.SignInChangeHandle}>
                <Radio.Button value={undefined}>全部</Radio.Button>
                <Radio.Button value={0}>未签到</Radio.Button>
                <Radio.Button value={1}>已签到</Radio.Button>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem>
            {form.getFieldDecorator('UserInfo')(
              <Search
                allowClear
                placeholder="请输入会员姓名或手机号查询"
                autoComplete='off'
                style={{ width: 230 }}
                onSearch={this.searchByUserInfoHandle}
              />
            )}
          </FormItem>
        </Form>
      </div>
    );

    const extraCommitContent = (
      <div className={styles.extraContent}>
        <Form layout='inline'>
          <FormItem>
            {form.getFieldDecorator('desc12', {
              rules: [{ required: false, message: '请输入手机号！'}],
            })(
              <Input placeholder="请输入手机号" style={{ width: 220 }} autoComplete='off' />
            )}
          </FormItem>
          <FormItem>
            {form.getFieldDecorator('desc112', {
              rules: [{ required: false, message: '请选择活动类型！'}],
            })(
              <RangePicker
                format={DateFormater}
              />
            )}
          </FormItem>
          {/*<FormItem>*/}
            {/*<Button type="primary" htmlType="submit" >查询</Button>*/}
          {/*</FormItem>*/}
        </Form>
      </div>
    );

    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        title={`活动名称：${AcitivityName}`}
        className={styles.pageHeader}
        content={description}
        extraContent={extra}
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
        style={{
          paddingBottom: 200
        }}

      >
        <div className={styles.main}>
          <GridContent>
            <Card
              bordered={false}
              style={{ marginTop: 24,  }}
              loading={loading}
            >
              <Descriptions  column={3} title={'活动详情'}>
                <Descriptions.Item label="活动封面">
                  <Popover
                    content={<div style={{width: 375}}>
                      <img src={`${Prefix}${ActivityImageUrl}`} style={{display: 'block', width: '100%'}} alt=""/>
                    </div>}
                    title="活动封面"
                    placement="right"
                  >
                    <a><Icon type="eye" /> 查看</a>
                  </Popover>
                </Descriptions.Item>
                <Descriptions.Item label="是否推荐">{IsRecommand && ApplyMap[IsRecommand]}</Descriptions.Item>
                {/*<Descriptions.Item label="排序值">1</Descriptions.Item>*/}
                <Descriptions.Item label="是否需要报名">{ApplyMap[IsNeedApply]}</Descriptions.Item>
                <Descriptions.Item label="所需积分">{ApplyScores}</Descriptions.Item>
                <Descriptions.Item label="报名开始时间">{ApplyStartTimeSpan && moment(ApplyStartTimeSpan).format(DateFormater)}</Descriptions.Item>
                <Descriptions.Item label="报名截止时间">{ApplyEndTimeSpan && moment(ApplyEndTimeSpan).format(DateFormater)}</Descriptions.Item>
                <Descriptions.Item label="报名提示信息" span={2}>{ApplyTip || '无'}</Descriptions.Item>
                <Descriptions.Item label="最大报名人数限制">{ApplyMaxCount}</Descriptions.Item>
                <Descriptions.Item label="是否需要签到">{ApplyMap[IsNeedSignIn]}</Descriptions.Item>
                <Descriptions.Item label="活动负责人">{Director || '无'}</Descriptions.Item>
                <Descriptions.Item label="微信分享图片">
                  <Popover
                    content={<div style={{width: 100}}>
                      <img
                        src={ShareImageUrl && `${Prefix}${ShareImageUrl}` || ''}
                        style={{display: 'block', width: '100%'}}
                        alt=""
                      />
                    </div>}
                    title="微信分享图片"
                    placement="right"
                  >
                    <a><Icon type="eye" /> 查看</a>
                  </Popover>
                </Descriptions.Item>
                <Descriptions.Item label="微信分享描述" span={3}>{ShareNote || '无'}</Descriptions.Item>
                <Descriptions.Item label="活动说明">
                  <Popover
                    content={<div style={{width: 375}}>
                      { ActivityDetail && <span dangerouslySetInnerHTML={{__html: decodeURI(ActivityDetail)}} />  || '暂无说明'}
                    </div>}
                    title="活动说明"
                    placement="right"
                  >
                    <a><Icon type="eye" /> 查看</a>
                  </Popover>
                </Descriptions.Item>
              </Descriptions>
            </Card>
            {
              IsNeedApply === 1 && (
                <Card
                  className={styles.tableCard}
                  bordered={false}
                  title="报名详情"
                  style={{ marginTop: 24 }}
                  bodyStyle={{ padding: '0 32px 40px 32px' }}
                  extra={extraContent}
                  loading={loading}
                >
                  <Button
                    type="dashed"
                    style={{ width: '100%', marginBottom: 12 }}
                    icon="plus"
                    onClick={() => this.handleUpdateModalVisible(true, { flag: true })}
                  >
                    添加
                  </Button>
                  <Suspense fallback={null}>
                    <ApplyTable
                      loading={loading}
                      dataSource={ActivityApply}
                      columns={columns}
                      GetApplysListHandle={this.GetApplysListHandle}
                    />
                  </Suspense>
                </Card>
              )
            }
            {/*<Card*/}
              {/*className={styles.tableCard}*/}
              {/*bordered={false}*/}
              {/*title="评论详情"*/}
              {/*style={{ marginTop: 24, marginBottom: 24 }}*/}
              {/*bodyStyle={{ padding: '0 32px 40px 32px' }}*/}
              {/*extra={extraCommitContent}*/}
              {/*loading={loading}*/}
            {/*>*/}
              {/*<Suspense fallback={null}>*/}
                {/*<ApplyTable*/}
                  {/*loading={loading}*/}
                  {/*dataSource={ActivityComments}*/}
                  {/*columns={this.commentsColumns}*/}
                {/*/>*/}
              {/*</Suspense>*/}
            {/*</Card>*/}
            {
              AddFlagVal && Object.keys(AddFlagVal).length ? (
                <Suspense fallback={null}>
                  <AddActivityApply
                    visible={AddModalVisble}
                    modalEditHandle={this.handleUpdateModalVisible}
                    saveHandle={this.saveHandle}
                    SearchUser={this.SearchUserInfoHandle}
                    ActivityId={AcitivityId}
                  />
                </Suspense>
              ) : null
            }
          </GridContent>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<DetailsProps>()(Details);
