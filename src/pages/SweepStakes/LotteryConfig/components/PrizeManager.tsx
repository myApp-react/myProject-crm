import React, { PureComponent } from 'react';
import { Table, Card, Form, Input, Button, Divider, Switch, Dropdown, Icon, Menu, Badge, Tooltip, message, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';

import { AddPrizeManager, CreatPrizePool, AddPrizePoolGift } from '../form'
import styles from './index.less'
import {
  AdvancedProfileData,
  CreatePrizePoolItem,
  LuckydrawItem,
  SaveLuckydrawItem,
} from '@/pages/SweepStakes/LotteryConfig/data';
import { Action, Dispatch } from 'redux';

import EditPrizeManager from '../form/EditPrizeManager'
import EditPrizePoolGift from '../form/EditPrizePoolGift'

import { connect } from 'dva';
import { pathMatchRegexp } from '@/utils';
import { TableListItem } from '@/pages/Integral/data';
import { PaginationProps } from 'antd/es/pagination';
import { TableListParams } from '@/pages/SweepStakes/data';
const FormItem = Form.Item;
const { Search } = Input;
const { confirm } = Modal;

const PrizeTypeMap = ['', '代金券', '积分', '再试一次', '定额红包', '随机红包'];
const PoolStatus = ['', 'success', 'error'];
const IsPrizePool = ['', '是', '否'];


interface columnsType {

}

interface PrizeManagerTableProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'LotteryConfigDetails/fetchAdvanced'
      | 'LotteryConfigDetails/SaveLuckydraw'
      | 'LotteryConfigDetails/QuerySimpleCouponItem'
      | 'LotteryConfigDetails/UploadActivityImage'
      | 'LotteryConfigDetails/ChangeLuckyDrawStatus'
      | 'LotteryConfigDetails/DeleteLuckyDraw'
      | 'LotteryConfigDetails/GenerateLuckyPool'
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

interface PrizeManagerTableState {
  addModalVisible: boolean;
  addPrizeGiftModalVisible: boolean;
  selectedRowKeys: Array<any>;
  selectedRows: Array<any>;
  createPrizePoolForm: Array<any>;
  createPrizePoolVisible: boolean;
  EditPrizeModalVisible: boolean;
  EditPrizeForm: Partial<SaveLuckydrawItem>
  EditPrizePoolModalVisible: boolean;
  EditPrizePoolForm: Partial<SaveLuckydrawItem>

}

const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    props: {},
  };
  if (index === 0) {
    obj.props.colSpan = 0;
  }
  return obj;
};

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
      CouponItem: LotteryConfigDetails.CouponItem,
      advancedOperation1: LotteryConfigDetails.advancedOperation1
    },
    loading
  })
)
class PrizeManagerTable extends PureComponent<PrizeManagerTableProps, PrizeManagerTableState>{

  state: PrizeManagerTableState = {
    addModalVisible: false,
    addPrizeGiftModalVisible: false,
    selectedRowKeys: [],
    selectedRows: [],
    createPrizePoolVisible: false,
    createPrizePoolForm: [],
    EditPrizeModalVisible: false,
    EditPrizeForm: {},
    EditPrizePoolModalVisible: false,
    EditPrizePoolForm: {},

  }

  columns: columnsType = [
    {
      title: '奖品名称',
      dataIndex: 'DrawName',
      width: 160,
      render: (val: string) => {
        const Len = val.length;
        if(Len > 10 ) return <Tooltip title={val}>{`${val.slice(0, 10)}...`}</Tooltip>
        return val
      }
    },
    {
      title: '奖品类型',
      dataIndex: 'DrawType',
      width: 76,
      render: (val: number) => PrizeTypeMap[val]
    },
    {
      title: '优惠券名称',
      dataIndex: 'CouponName',
      width: 130,
      render: (val: string) => {
        const Len = val.length;
        if(Len > 8 ) return <Tooltip title={val}>{`${val.slice(0, 8)}...`}</Tooltip>
        return val
      }
    },
    {
      title: '优惠券编码',
      width: 150,
      dataIndex: 'CouponCode',
    },
    {
      title: '奖品等级',
      dataIndex: 'Drawlevel',
    },
    {
      title: '中奖率',
      dataIndex: 'LuckyRate',
      render: (val: string, record: any) => {
        return `${val}/10000`
      }
    },
    {
      title: '排序',
      dataIndex: 'OrderNo',
      render: (val: number) => {
        return <Badge
          count={val}
          style={{
            zIndex: 0,
            backgroundColor: '#333',
            color: '#fff',
          }}
        />
      }
    },
    {
      title: '奖池奖品',
      dataIndex: 'DrawCategoryType',
      width: 76,
      render: (val: number) => <Badge status={PoolStatus[val]} text={IsPrizePool[val]} />
    },
    {
      title: '奖品总数',
      dataIndex: 'DrawNum',
      width: 80,
    },
    {
      title: '剩余礼品数',
      dataIndex: 'SurplusCount',
    },
    {
      title: '已抽取礼品数',
      dataIndex: 'WinCount',
      width: 110,
    },
    {
      title: '奖池可抽礼品数',
      width: 120,
      dataIndex: 'CanWinCount',
    },
    {
      title: '操作',
      width: 288,
      fixed: 'right',
      render: (text: string, record: any, index: number) => {
        return (
          <>
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
              checked={record.Enabled === 1}
              onChange={() => this.changePrizeStatusHandle(record.LuckyDrawId, record.Enabled)}
            />
            <Divider type="vertical" />
            {/*<a>奖池管理</a>*/}
            <Button
              type="primary"
              size='small'
              onClick={() => this.handleUpdatePoolModalVisible(true, record)}
            >
              奖池管理
            </Button>
            {/*<Tooltip title='奖池管理'>*/}
              {/*<Button*/}
                {/*type="primary"*/}
                {/*shape="round"*/}
                {/*icon="unordered-list"*/}
                {/*size='small'*/}
                {/*onClick={() => this.handleUpdatePoolModalVisible(true, record)}*/}
              {/*/>*/}
            {/*</Tooltip>*/}
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
              disabled={record.DrawCategoryType !== 2}
              onClick={() => this.removePrizeHandle(record.LuckyDrawId)}
            >删除</Button>
            {/*<Tooltip title='删除'>*/}
              {/*<Button*/}
                {/*type="danger"*/}
                {/*shape="round"*/}
                {/*icon="delete"*/}
                {/*size='small'*/}
                {/*disabled={record.DrawCategoryType !== 2}*/}
                {/*onClick={() => this.removePrizeHandle(record.LuckyDrawId)}*/}
              {/*/>*/}
            {/*</Tooltip>*/}
          </>
        )
      }
    },
  ];



  componentDidMount() {
    this.PrizeManagerChange();
    this.getVoucherTypeHandle();
  }

  changePrizeStatusHandle = (luckyDrawId: number, status: number) => {
    const { dispatch } = this.props;
    const currStatus = status === 1 ? 0 : 1;
    const key = 'updatable';

    message.loading({ content: 'Loading...', key });
    dispatch({
      type: 'LotteryConfigDetails/ChangeLuckyDrawStatus',
      payload: {
        luckyDrawId,
        status: currStatus
      },
      callback: (flag: boolean) => {
        this.setState({selectedRowKeys: []})
        if(flag){
          message.success({ content: '操作成功！', key });
          this.PrizeManagerChange();
        }else {
          message.error({ content: '操作失败！', key });
        }
      }
    })
  }

  removePrizeHandle = (luckyDrawId: number,) => {

    const { dispatch } = this.props;
    const key = 'remove';
    // const _self = this;
    confirm({
      title: '确认删除该奖品?',
      content: '删除后不可恢复',
      onOk() {
        message.loading({ content: '删除中...', key });
        dispatch({
          type: 'LotteryConfigDetails/DeleteLuckyDraw',
          payload: {
            luckyDrawId
          },
          callback: (flag: boolean) => {
            if(flag){
              message.success({ content: '删除成功！', key });
              this.PrizeManagerChange();
            }else {
              message.error({ content: '删除失败！', key });
            }
          }
        })
      },
    });


  }


  PrizeManagerChange = (fields?: {Index?: number, Size?: number, LuckyDrawName?: string}) => {
    const { dispatch, location } = this.props;
    const match = pathMatchRegexp('/sweepstakes/lotteryconfig/:id', location.pathname)
    if(match) {
      dispatch({
        type: 'LotteryConfigDetails/fetchAdvanced',
        payload: {
          ActivityId: match[1],
          Index: 1,
          Size: 10,
          ...fields
        }
      })
    }
  }

  uploadImagesHandle = (dataStr: string, callback: (data: string) => void) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'LotteryConfigDetails/UploadActivityImage',
      payload: {
        dataStr
      },
      callback: (data: string) => callback(data)
    })
  }

  //获取代金券种类
  getVoucherTypeHandle = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'LotteryConfigDetails/QuerySimpleCouponItem',
      payload: {
        Enable: 1,
      }
    })
  }


  okHandle = (value: string) => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { LuckyDrawName } = fieldsValue;

      this.PrizeManagerChange(fieldsValue)
    });
  };

  /**新增奖品操作*/
  addHandle = () => {
    this.setState((pre) => ({
      addModalVisible: !pre.addModalVisible
    }))
  }

  addPrizePoolGiftHandle = () => {
    this.setState((pre) => ({
      addPrizeGiftModalVisible: !pre.addPrizeGiftModalVisible
    }))
  }

  //编辑奖品
  handleUpdateModalVisible = (flag?: boolean, record?: LuckydrawItem) => {
    this.setState({
      EditPrizeModalVisible: !!flag,
      EditPrizeForm: record || {},
    });
  };

  // 编辑奖池
  handleUpdatePoolModalVisible = (flag?: boolean, record?: LuckydrawItem) => {
    this.setState({
      EditPrizePoolModalVisible: !!flag,
      EditPrizePoolForm: record || {},
    });
  };



  selectRow = (record: any) => {
    const selectedRowKeys = [...this.state.selectedRowKeys];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    } else {
      selectedRowKeys.push(record.key);
    }
    this.setState({ selectedRowKeys });
  }

  onSelectedRowKeysChange = (selectedRowKeys: any, selectedRows: any) => {
    this.setState({ selectedRowKeys, selectedRows });
  }

  /**生成奖池操作*/
  handleCreatePrizePool = (flag?: boolean, selectedRow?: Array<any>) => {
    this.setState({
      createPrizePoolVisible: !!flag,
      createPrizePoolForm: selectedRow || []
    })
  }

  //保存奖品
  savePrizeAllHandle = (fields: SaveLuckydrawItem) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'LotteryConfigDetails/SaveLuckydraw',
      payload: {
        ...fields
      },
      callback: () => {
        message.success('操作成功！')
        this.PrizeManagerChange();
        if(fields.DrawCategoryType === 1){
          this.addPrizePoolGiftHandle()
        }
        if(fields.DrawCategoryType === 2){
          this.addHandle()
        }
      }
    })
  }

  //生成奖池保存
  savePrizePoolHandle = (fields: CreatePrizePoolItem, callback: () => void) => {
    console.log(12)
    const { dispatch } = this.props;
    dispatch({
      type: 'LotteryConfigDetails/GenerateLuckyPool',
      payload: {
        ...fields
      },
      callback: () => {
        message.success('生成奖池成功！');
        this.PrizeManagerChange();
        callback()
      }
    })
  }

  handleTableChange = (pagination: Partial<PaginationProps>) => {
    const params: Partial<TableListParams> = {
      Index: pagination.current,
      Size: pagination.pageSize,
    };
    this.PrizeManagerChange(params)
  }


  render() {
    const { loading, form, LotteryConfigDetails, location } = this.props;
    const { CouponItem, advancedOperation1  } = LotteryConfigDetails;
    const {
      addModalVisible,
      selectedRowKeys,
      createPrizePoolVisible,
      createPrizePoolForm,
      selectedRows,
      addPrizeGiftModalVisible,
      EditPrizeForm,
      EditPrizeModalVisible,
      EditPrizePoolForm,
      EditPrizePoolModalVisible,
    } = this.state
    const { list = [], pagination = false } = advancedOperation1;

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

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
      getCheckboxProps: (record: any) => ({
        disabled: record.DrawCategoryType === 2 || record.Enabled === 0, // Column configuration not to be checked
      }),

    };

    //新增奖品方法集
    const AddPrizeMethod = {
      modalEditHandle: this.addHandle,
      savePrizeAllHandle: this.savePrizeAllHandle,
      uploadImagesHandle: this.uploadImagesHandle,
    }

    //新增奖品池方法集
    const AddPrizePoolMethod = {
      modalEditHandle: this.addPrizePoolGiftHandle,
      savePrizeAllHandle: this.savePrizeAllHandle,
      uploadImagesHandle: this.uploadImagesHandle,
    }

    //编辑
    const EditPrizeMethod = {
      modalEditHandle: this.handleUpdateModalVisible,
      savePrizeAllHandle: this.savePrizeAllHandle,
      uploadImagesHandle: this.uploadImagesHandle,
    }

    const EditPrizePoolMethod = {
      modalEditHandle: this.handleUpdatePoolModalVisible,
      savePrizeAllHandle: this.savePrizeAllHandle,
      uploadImagesHandle: this.uploadImagesHandle,
    }

    const CreatePrizePoolMethod = {
      saveHandle: this.savePrizePoolHandle,
      modalEditHandle: this.handleCreatePrizePool
    }


    return (
      <>
        <Card
          style={{ marginBottom: 24 }}
          bordered={false}
          title={
            <>
              <Button icon='plus' type="primary" onClick={this.addHandle} style={{marginRight: 12}}>新增奖品</Button>
              <Button icon='plus' type="primary" onClick={this.addPrizePoolGiftHandle} style={{marginRight: 12}}>新增奖池奖品</Button>
              {selectedRowKeys.length > 0 && (
                <Button onClick={() => this.handleCreatePrizePool(true, selectedRows)}>批量生成奖池</Button>
              )}
            </>
          }
          extra={
            <Form layout="inline">
              <FormItem>
                {form.getFieldDecorator('LuckyDrawName', {
                  rules: [{ required: false, message: '请输入奖品名称' }],
                })(
                  <Search
                    placeholder="请输入奖品名称"
                    autoComplete='off'
                    allowClear
                    style={{width: 260}}
                    onSearch={this.okHandle}
                  />,
                )}
              </FormItem>
            </Form>
          }
        >
          <Table
            bordered={true}
            rowKey="LuckyDrawId"
            loading={loading.effects['LotteryConfigDetails/fetchAdvanced']}
            rowSelection={rowSelection}
            dataSource={list}
            pagination={paginationProps}
            columns={this.columns}
            size='middle'
            scroll={{ x: 1660 }}
            onChange={this.handleTableChange}
          />
        </Card>
        <AddPrizeManager
          {...AddPrizeMethod}
          visible={addModalVisible}
          CouponItem={CouponItem}
          AcitivityId={match && match[1]}
          uploadLoading={loading.effects['LotteryConfigDetails/UploadActivityImage']}
        />
        <AddPrizePoolGift
          {...AddPrizePoolMethod}
          visible={addPrizeGiftModalVisible}
          CouponItem={CouponItem}
          AcitivityId={match && match[1]}
          uploadLoading={loading.effects['LotteryConfigDetails/UploadActivityImage']}
        />

        {
          EditPrizeForm && Object.keys(EditPrizeForm).length ? (
            <EditPrizeManager
              {...EditPrizeMethod}
              visible={EditPrizeModalVisible}
              values={EditPrizeForm}
              CouponItem={CouponItem}
              AcitivityId={match && match[1]}
              uploadLoading={loading.effects['LotteryConfigDetails/UploadActivityImage']}
            />
          ) : null
        }
        {
          EditPrizePoolForm && Object.keys(EditPrizePoolForm).length ? (
            <EditPrizePoolGift
              {...EditPrizePoolMethod}
              visible={EditPrizePoolModalVisible}
              values={EditPrizePoolForm}
              CouponItem={CouponItem}
              AcitivityId={match && match[1]}
              uploadLoading={loading.effects['LotteryConfigDetails/UploadActivityImage']}
            />
          ) : null
        }

        {
          createPrizePoolForm && createPrizePoolForm.length !== 0 && (
            <CreatPrizePool
              AcitivityId={match && match[1] || ''}
              visible={createPrizePoolVisible}
              createPrizePoolForm={createPrizePoolForm}
              {...CreatePrizePoolMethod}
            />
          )
        }
    </>
  )
  }
}

export default Form.create<PrizeManagerTableProps>()(PrizeManagerTable);
