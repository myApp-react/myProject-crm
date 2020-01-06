import React, { PureComponent } from 'react';
import { Table, Card, Button, Divider, message, Switch, Modal, Tooltip, Icon, Popover, Tag } from 'antd';

import { AddLotteryChanceSet } from '../form';
import { Action, Dispatch } from 'redux';
import { pathMatchRegexp } from '@/utils';
import { connect } from 'dva';
import {
  AdvancedProfileData, columnsType,
  LuckyTableRadiansProps,
  saveLuckyTableRadians, SysCardType,
} from '@/pages/SweepStakes/LotteryConfig/data';

import EditLotteryChanceSet from '../form/EditLotteryChanceSet';
import { PaginationProps } from 'antd/es/pagination';
import { TableListParams } from '@/pages/SweepStakes/data';

const { confirm } = Modal;
const wayMap = ['', '会员权益', '积分兑换', '分享赠送', '推荐注册赠送'];
const CardTypeMap = ['', '全部会员', '指定卡类型', '非会员', '全部人员'];

interface LotteryChanceSetProps {
  dispatch: Dispatch<
    Action<
      | 'LotteryConfigDetails/QueryChanceSetItemContainer'
      | 'LotteryConfigDetails/SaveLuckyChanceSet'
      | 'LotteryConfigDetails/ChangeChanceSetEnable'
      | 'LotteryConfigDetails/DeleteLuckyChanceSet'
      | 'LotteryConfigDetails/GetCardTypes'
      >
    >;
  location: any;
  loading: {
    models: {
      [key: string]: boolean;
    };
    effects: {
      [key: string]: boolean;
    }
  };
  LotteryConfigDetails: AdvancedProfileData;
}

interface LotteryChanceSetState {
  addModalVisible: boolean;
  editModalVisible: boolean;
  editFormValues: Partial<columnsType>;
  currId: string;
}

@connect(
  ({
     LotteryConfigDetails,
     loading,
   }: {
    LotteryConfigDetails: AdvancedProfileData;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    LotteryConfigDetails: {
      ActivityDetails: LotteryConfigDetails.ActivityDetails,
      CardTypes: LotteryConfigDetails.CardTypes,
      advancedOperation3: LotteryConfigDetails.advancedOperation3
    },
    loading
  })
)
class LotteryChanceSet extends PureComponent<LotteryChanceSetProps, LotteryChanceSetState>{

  state: LotteryChanceSetState = {
    addModalVisible: false,
    editModalVisible: false,
    editFormValues: {},
    currId: ''
  };

  columns = [
    {
      title: '抽奖机会名称',
      dataIndex: 'SetName',
      width: 120,
    },
    {
      title: '获取途径',
      dataIndex: 'ChannelType',
      render: (val: number) => wayMap[val]
    },
    {
      title: '会员类型',
      dataIndex: 'CardTypeCategory',
      render: (val: number) => {
        if( val === 2 ) return <>
          <Popover
            title='卡类型详细信息'
            content={<>
              <Tag color="#87d068">#87d068</Tag>
            </>}
          >
            {CardTypeMap[val]} <Icon type="info-circle" style={{color: '#2196F3'}}/>
          </Popover>
        </>;
        return CardTypeMap[val]
      }
    },
    {
      title: '可获取总次数',
      dataIndex: 'TotalChanceCount',
    },
    {
      title: '每天可获取次数',
      dataIndex: 'EverydayCount',
    },
    {
      title: '获取所需积分',
      dataIndex: 'NeedScores',
    },
    {
      title: '注册数',
      dataIndex: 'RegisteCount',
    },
    {
      title: '需分享次数',
      dataIndex: 'ShareReadCount',
      render: (val: number | null) => {
        if( val ) return val;
        return '-'
      }
    },
    {
      title: '已获取次数',
      dataIndex: 'GetCount',
    },
    {
      title: '已使用次数',
      dataIndex: 'UseCount',
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (text: string, record: any) => (
        <>
          <Switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
            checked={record.Enabled === 1}
            loading={
              this.state.currId === record.Id &&
              this.props.loading.effects['LotteryConfigDetails/ChangeChanceSetEnable']
            }
            onChange={() => this.handleChangeStatus(record.Id, record.Enabled)}
          />
          <Divider type="vertical" />
          <Button
            type="primary"
            size='small'
            onClick={() => this.handleUpdateModalVisible(true, record)}
          >编辑</Button>
          {/*<Tooltip title='编辑'>*/}
            {/*<Button*/}
              {/*type="primary"*/}
              {/*shape="round"*/}
              {/*icon="form"*/}
              {/*size='small'*/}
              {/*onClick={() => this.handleUpdateModalVisible(true, record)}*/}
            {/*/>*/}
          {/*</Tooltip>*/}
          <Divider type="vertical" />
          <Button
            type="danger"
            size='small'
            onClick={() => this.removeHandle(record.Id)}
          >删除</Button>
          {/*<Tooltip title='删除'>*/}
            {/*<Button*/}
              {/*type="danger"*/}
              {/*shape="round"*/}
              {/*icon="delete"*/}
              {/*size='small'*/}
              {/*onClick={() => this.removeHandle(record.Id)}*/}
            {/*/>*/}
          {/*</Tooltip>*/}
        </>
      ),
    },
  ];

  //更改状态
  handleChangeStatus = (id: string, enableStatus: number) => {
    const { dispatch } = this.props;
    this.setState({currId: id})
    const currEnabled = enableStatus === 0 ? 1 : 0;
    dispatch({
      type: 'LotteryConfigDetails/ChangeChanceSetEnable',
      payload: { id, enableStatus: currEnabled },
      callback: () => {
        message.success('更改状态成功');
        this.LotteryChanceSetChange();
      }
    });

  }

  removeHandle = (setId: string) => {
    const { dispatch } = this.props;
    const _self = this;
    confirm({
      title: '确认删除该条数据吗？',
      onOk() {
        dispatch({
          type: 'LotteryConfigDetails/DeleteLuckyChanceSet',
          payload: { setId },
          callback: () => {
            message.success('删除成功！');
            _self.LotteryChanceSetChange();
          }
        })
      }
    })

  }

  //编辑
  handleUpdateModalVisible = (flag?: boolean, record?: columnsType) => {
    this.setState({
      editModalVisible: !!flag,
      editFormValues: record || {},
    });
  };

  componentDidMount() {
    this.LotteryChanceSetChange();
    this.getCardTypeHandle();
  }


  //抽奖机会切换
  LotteryChanceSetChange = (fields?: { Index?: number, Size?: number }) => {
    const { dispatch, location } = this.props;
    const match = pathMatchRegexp('/sweepstakes/lotteryconfig/:id', location.pathname)
    if(match) {
      dispatch({
        type: 'LotteryConfigDetails/QueryChanceSetItemContainer',
        payload: {
          activityId: match[1],
          Index: 1,
          Size: 10,
          ...fields
        }
      })
    }
  }

  getCardTypeHandle = () => {
    const { LotteryConfigDetails, dispatch } = this.props;
    const { ActivityDetails } = LotteryConfigDetails;
    const { ProjectId } = ActivityDetails;
    dispatch({
      type: 'LotteryConfigDetails/GetCardTypes',
      payload: { projectId: ProjectId }
    })

  }

  /**新增*/
  addHandle = () => {
    this.setState((pre) => ({
      addModalVisible: !pre.addModalVisible
    }))
  }

  saveHandle = (fields: LuckyTableRadiansProps) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'LotteryConfigDetails/SaveLuckyChanceSet',
      payload: {...fields},
      callback: () => {
        message.success('新增成功！');
        this.addHandle();
        this.LotteryChanceSetChange();
      }
    })
  }

  handleTableChange = (pagination: Partial<PaginationProps>) => {
    const params: Partial<TableListParams> = {
      Index: pagination.current,
      Size: pagination.pageSize,
    };
    this.LotteryChanceSetChange(params)
  }

  render() {
    const { loading, LotteryConfigDetails, location } = this.props;
    const { advancedOperation3, CardTypes } = LotteryConfigDetails
    const { addModalVisible, editFormValues, editModalVisible } = this.state;
    const { list = [], pagination = false } = advancedOperation3;
    const match = pathMatchRegexp('/sweepstakes/lotteryconfig/:id', location.pathname);

    const paginationProps = pagination
      ? {
        showSizeChanger: true,
        showQuickJumper: true,
        size: 'default',
        showTotal: (total: number) => `总共 ${total} 条数据`,
        ...pagination,
      }
      : false;

    return (
      <>
        <Card
          style={{ marginBottom: 24 }}
          bordered={false}
          title={<Button icon='plus' type="primary" onClick={this.addHandle}>新增</Button>}
        >
          <Table
            bordered
            rowKey={'Id'}
            loading={loading.effects['LotteryConfigDetails/QueryChanceSetItemContainer']}
            pagination={paginationProps}
            dataSource={list}
            columns={this.columns}
            size='small'
            scroll={{ x: 1500 }}
            onChange={this.handleTableChange}
          />
        </Card>
        <AddLotteryChanceSet
          visible={addModalVisible}
          ActivityId={match && match[1]}
          modalEditHandle={this.addHandle}
          saveHandle={this.saveHandle}
          CardTypes={CardTypes}
        />
        {
          editFormValues && Object.keys(editFormValues).length ? (
            <EditLotteryChanceSet
              visible={editModalVisible}
              ActivityId={match && match[1]}
              modalEditHandle={this.handleUpdateModalVisible}
              saveHandle={this.saveHandle}
              values={editFormValues}
            />
          ) : null
        }
      </>
    )
  }
}

export default LotteryChanceSet;
