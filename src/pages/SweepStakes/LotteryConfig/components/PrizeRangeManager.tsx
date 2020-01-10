import React, { PureComponent } from 'react';
import { Table, Card, Button, Divider, message, Modal, Tooltip, Badge  } from 'antd';

import { AddPrizeRangeManager } from '../form'
import {
  AdvancedProfileData, LuckydrawItem,
  saveLuckyTableRadians,
  SimpleLuckyDraw,
  tableProps,
} from '@/pages/SweepStakes/LotteryConfig/data';
import { connect } from 'dva';
import { Action, Dispatch } from 'redux';
import { pathMatchRegexp } from '@/utils';

import EditPrizeRangeManager from '../form/EditPrizeRangeManager'
import { PaginationProps } from 'antd/es/pagination';
import { TableListParams } from '@/pages/SweepStakes/data';

const statusMap = ['禁用', '启用'];
const statusStringMap = ['error', 'success'];

const { confirm } = Modal

interface columnsType {

}

interface PrizeManagerTableProps {

  dispatch: Dispatch<
    Action<
      | 'LotteryConfigDetails/GetSimpleLuckyDraws'
      | 'LotteryConfigDetails/QueryLuckyTableRadians'
      | 'LotteryConfigDetails/SaveLuckyTableRadian'
      | 'LotteryConfigDetails/DeleteLuckyTableRadian'
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
  saveHandle: (fields: {StartRadian: number, EndRadian: number, IsLuckyRadian: number, Enabled: number}) => void;
}

interface PrizeManagerTableState {
  addModalVisible: boolean;
  editModalVisible: boolean;
  editForm: Partial<saveLuckyTableRadians>;
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
      prizeType: LotteryConfigDetails.prizeType,
      advancedOperation2: LotteryConfigDetails.advancedOperation2
    },
    loading
  })
)
class PrizeRangeManager extends PureComponent<PrizeManagerTableProps, PrizeManagerTableState>{

  state: PrizeManagerTableState = {
    addModalVisible: false,
    editModalVisible: false,
    editForm: {}
  }

  columns: columnsType = [
    {
      title: '奖品名称',
      dataIndex: 'LuckyName',
    },
    {
      title: '开始弧度',
      dataIndex: 'StartRadian',
    },
    {
      title: '结束弧度',
      dataIndex: 'EndRadian',
    },
    {
      title: '状态',
      dataIndex: 'Enabled',
      render: (val: number) => <Badge status={statusStringMap[val]} text={statusMap[val]} />
    },
    {
      title: '操作',
      width: 180,

      render: (text: string, record: any) => (
        <>
          {/*<a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>*/}
          {/*<Divider type="vertical" />*/}
          {/*<a onClick={() => this.removePrizeRadiusHandle(record.Id)}>删除</a>*/}
          <Button
            type="primary"
            size='small'
            style={{marginRight: 12}}
            onClick={() => this.handleUpdateModalVisible(true, record)}
          >
            编辑
          </Button>
          {/*<Tooltip title='编辑'>*/}
            {/*<Button*/}
              {/*type="primary"*/}
              {/*shape="round"*/}
              {/*icon="form"*/}
              {/*size='small'*/}
              {/*onClick={() => this.handleUpdateModalVisible(true, record)}*/}
            {/*/>*/}
          {/*</Tooltip>*/}
          <Button
            type="danger"
            size='small'
            onClick={() => this.removePrizeRadiusHandle(record.Id)}
          >
            删除
          </Button>
          {/*<Tooltip title='删除'>*/}
            {/*<Button*/}
              {/*type="danger"*/}
              {/*shape="round"*/}
              {/*icon="delete"*/}
              {/*size='small'*/}
              {/*onClick={() => this.removePrizeRadiusHandle(record.Id)}*/}
            {/*/>*/}
          {/*</Tooltip>*/}
        </>
      ),
    },
  ];

  componentDidMount() {
    this.PrizeRangeManagerChange();
    this.getPrizeTypeHandle();
  }

  removePrizeRadiusHandle = (Id: string) => {
    const { dispatch } = this.props;
    const _self = this;
    confirm({
      title: '确认删除该奖品弧度设置？',
      onOk() {
        dispatch({
          type: 'LotteryConfigDetails/DeleteLuckyTableRadian',
          payload: { Id },
          callback: () => {
            message.success('删除成功!');
            _self.PrizeRangeManagerChange();
          }
        })
      }
    })
  }


  /**新增*/
  addHandle = () => {
    this.setState((pre) => ({
      addModalVisible: !pre.addModalVisible
    }))
  }

  //奖品弧度管理
  PrizeRangeManagerChange = (fields?: { Index?: number, Size?: number }) => {
    const { dispatch, location } = this.props;
    const match = pathMatchRegexp('/sweepstakes/lotteryconfig/:id', location.pathname)
    if(match) {
      dispatch({
        type: 'LotteryConfigDetails/QueryLuckyTableRadians',
        payload: {
          activityId: match[1],
          Index: 1,
          Size: 10,
          ...fields
        }
      })
    }
  }

  getPrizeTypeHandle = () => {
    const { dispatch, location } = this.props;
    const match = pathMatchRegexp('/sweepstakes/lotteryconfig/:id', location.pathname)
    if(match) {
      dispatch({
        type: 'LotteryConfigDetails/GetSimpleLuckyDraws',
        payload: {
          activityId: match[1],
        }
      })
    }
  }

  //保存抽奖弧度
  PrizeRangeSaveHandle = (fields: {StartRadian: number, EndRadian: number, IsLuckyRadian: number, Enabled: number}) => {
    const { dispatch, location } = this.props;
    const match = pathMatchRegexp('/sweepstakes/lotteryconfig/:id', location.pathname)
    if(match) {
      dispatch({
        type: 'LotteryConfigDetails/SaveLuckyTableRadian',
        payload: {
          ActivityId: match[1],
          ...fields
        },
        callback: () => {
          message.success('新增抽奖弧度设置成功！');
          this.addHandle();
          this.PrizeRangeManagerChange();
        }
      })
    }
  }

  //编辑奖品
  handleUpdateModalVisible = (flag?: boolean, record?: saveLuckyTableRadians) => {
    this.setState({
      editModalVisible: !!flag,
      editForm: record || {},
    });
  };

  handleTableChange = (pagination: Partial<PaginationProps>) => {
    const params: Partial<TableListParams> = {
      Index: pagination.current,
      Size: pagination.pageSize,
    };
    this.PrizeRangeManagerChange(params)
  }

  render() {
    const { loading, LotteryConfigDetails } = this.props;
    const { addModalVisible, editForm, editModalVisible } = this.state;
    const { advancedOperation2, prizeType } = LotteryConfigDetails
    const { list = [], pagination = false } = advancedOperation2;

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
            pagination={paginationProps}
            loading={loading.effects['LotteryConfigDetails/QueryLuckyTableRadians']}
            dataSource={list}
            columns={this.columns}
            size='small'
            onChange={this.handleTableChange}
          />
        </Card>
        <AddPrizeRangeManager
          visible={addModalVisible}
          modalEditHandle={this.addHandle}
          saveHandle={this.PrizeRangeSaveHandle}
          prizeType={prizeType}
        />
        {
          editForm && Object.keys(editForm).length ? (
            <EditPrizeRangeManager
              visible={editModalVisible}
              modalEditHandle={this.handleUpdateModalVisible}
              saveHandle={this.PrizeRangeSaveHandle}
              prizeType={prizeType}
              values={editForm}
            />
          ) : null

        }

      </>
    )
  }
}

export default PrizeRangeManager;
