import React, { PureComponent } from 'react';
import { Table, Card, Form, Input, Button, Row, Col, Select, DatePicker, Icon, Tooltip, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';

import styles from './index.less';
import { connect } from 'dva';
import { AdvancedProfileData, PoolDrawItemParam, saveLuckyTableRadians } from '@/pages/SweepStakes/LotteryConfig/data';
import { Action, Dispatch } from 'redux';
import { pathMatchRegexp } from '@/utils';
import moment from 'moment'
const FormItem = Form.Item;

import EditPrizePoolManager from '../form/EditPrizePoolManager'
import { PaginationProps } from 'antd/es/pagination';
import { TableListParams } from '@/pages/SweepStakes/data';

const { RangePicker } = DatePicker;
const prizeMap = ['', '代金券', '积分', '再试一次', '定额红包', '随机红包'];
const ReleaseMap = ['未释放', '已释放'];
const WinnedMap = ['未抽取', '已抽取'];
const DateFormat = 'YYYY.MM.DD HH:mm:ss';


export interface PrizePoolColumns {
  Id: string;
  DrawName: string;
  DrawLevel: string;
  DrawType: number;
  ReleaseTimeSpan: number;
  IsRelease: number;
  IsWinned: number;
  PersonName: string;
  Phone: string;
  WinTimeSpan: number;
  UpdateTimeSpan: number;
  UpdateName: string;
  Enabled: number;
}

interface PrizePoolProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'LotteryConfigDetails/QueryPoolDrawItemParam'
      | 'LotteryConfigDetails/ChangeLuckyPoolItem'
      | 'LotteryConfigDetails/CancelLuckyPool'
      | 'LotteryConfigDetails/GetSimpleLuckyDraws'
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

interface PrizePoolState {
  expandForm: boolean;
  selectedRowKeys: Array<any>;
  selectedRows: Array<any>;
  formValues: { [key: string]: string };
  editModalVisible: boolean;
  editFormValues: PrizePoolColumns[];

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
      advancedOperation5: LotteryConfigDetails.advancedOperation5
    },
    loading
  })
)
class PrizePool extends PureComponent<PrizePoolProps, PrizePoolState>{

  state: PrizePoolState = {
    expandForm: false,
    formValues: {},
    selectedRowKeys: [],
    selectedRows: [],
    editModalVisible: false,
    editFormValues: [],
  }

  columns = [
    {
      title: '奖品名称',
      dataIndex: 'DrawName',
    },
    {
      title: '奖品等级',
      dataIndex: 'DrawLevel',
    },
    {
      title: '奖品类型',
      dataIndex: 'DrawType',
      render: (val: number) => prizeMap[val]
    },
    {
      title: '释放时间',
      dataIndex: 'ReleaseTimeSpan',
      width: 140,
      render: (val: number) => moment(val).format(DateFormat)
    },
    {
      title: '释放状态',
      dataIndex: 'IsRelease',
      width: 80,
      render: (val: number) => ReleaseMap[val]
    },
    {
      title: '抽取状态',
      dataIndex: 'IsWinned',
      width: 80,
      render: (val: number) => WinnedMap[val]
    },
    {
      title: '中奖人',
      dataIndex: 'PersonName',
      render: (val: string) => {
        if(val) return val;
        return '-'
      }
    },
    {
      title: '中奖人电话',
      dataIndex: 'Phone',
      render: (val: string) => {
        if(val) return val;
        return '-'
      }

    },
    {
      title: '中奖时间',
      dataIndex: 'WinTimeSpan',
      render: (val: string) => {
        if(val) return val;
        return '-'
      }
    },
    {
      title: '最后修改人',
      dataIndex: 'UpdateName',
      render: (val: string) => {
        if(val) return val;
        return '-'
      }
    },
    {
      title: '最后修改时间',
      dataIndex: 'UpdateTimeSpan',
      render: (val: string) => {
        if(val) return val;
        return '-'
      }
    }
  ];

  okHandle = (value: string) => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(value)
      console.log(fieldsValue)
      // form.resetFields();
    });
  };

  //重置搜索表单
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.handelInitFetch();
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };


  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let ReleaseTimeS = undefined,
          ReleaseTimeE = undefined,
          WinTimeS = undefined,
          WinTimeE = undefined;
      const { ReleaseRangeDate, WinRangeDate, ...rest } = fieldsValue;

      if(ReleaseRangeDate && ReleaseRangeDate.length !== 0) {
        ReleaseTimeS = moment(ReleaseRangeDate[0]).format(DateFormat);
        ReleaseTimeE = moment(ReleaseRangeDate[1]).format(DateFormat);
      }else {
        ReleaseTimeS = undefined;
        ReleaseTimeE = undefined;
      }

      if(WinRangeDate && WinRangeDate.length !== 0) {
        WinTimeS = moment(WinRangeDate[0]).format(DateFormat);
        WinTimeE = moment(WinRangeDate[1]).format(DateFormat);
      }else {
        WinTimeS = undefined;
        WinTimeE = undefined;
      }

      const values = { ...rest, ReleaseTimeS, ReleaseTimeE, WinTimeS, WinTimeE, };

      this.setState({
        formValues: values,
      });
      // console.log(values)
      this.handelInitFetch(values);
    });
  };

  handelInitFetch = (fields?: PoolDrawItemParam) => {
    const { dispatch, location } = this.props;
    const match = pathMatchRegexp('/sweepstakes/lotteryconfig/:id', location.pathname);
    if(match) {
      dispatch({
        type: 'LotteryConfigDetails/QueryPoolDrawItemParam',
        payload: {
          activityId: match[1],
          Index: 1,
          Size: 10,
          ...fields
        }
      })
    }
  }

  //编辑释放时间
  handleUpdateModalVisible = (flag?: boolean, record?: PrizePoolColumns[]) => {
    this.setState({
      editModalVisible: !!flag,
      editFormValues: record || [],
    });
  };

  GetPrizeTypeHandle = () => {
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


  componentDidMount() {
    this.handelInitFetch();
    this.GetPrizeTypeHandle();
  }

  //批量编辑保存
  batchSaveHandle = (fields: { ReleaseTime: string }, callback: () => void) => {
    const { dispatch, location } = this.props;
    const match = pathMatchRegexp('/sweepstakes/lotteryconfig/:id', location.pathname);
    const Ids = this.state.selectedRowKeys.join(',');
    const key = 'Save';
    message.loading({ content: '正在保存中...', key });
    if(match) {
      dispatch({
        type: 'LotteryConfigDetails/ChangeLuckyPoolItem',
        payload: {
          ...fields, Ids, ActiivityId: match[1],
        },
        callback: () => {
          message.success({ content: '修改成功！', key, duration: 2 });
          this.handelInitFetch();
          callback();
        }
      })
    }
  }

  //批量作废
  batchDisableHandle = () => {
    const { dispatch, location } = this.props;
    const match = pathMatchRegexp('/sweepstakes/lotteryconfig/:id', location.pathname);
    const Ids = this.state.selectedRowKeys.join(',');
    const key = 'Disable';
    message.loading({ content: '正在作废中...', key });
    if(match) {
      dispatch({
        type: 'LotteryConfigDetails/CancelLuckyPool',
        payload: {
          Ids, ActiivityId: match[1],
        },
        callback: () => {
          message.success({ content: '作废成功', key, duration: 2 });
          this.handelInitFetch();
          this.setState({ selectedRowKeys: [], selectedRows: [] });
        }
      })
    }
  }


  renderSimpleForm() {
    const { form, LotteryConfigDetails } = this.props;
    const { getFieldDecorator } = form;
    const { prizeType } = LotteryConfigDetails;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="奖品名称">
              {getFieldDecorator('DrawId')(
                <Select placeholder="请选择奖品名称" allowClear>
                  {
                    prizeType.map(_ => (
                      <Select.Option key={_.LuckyDrawId} value={_.LuckyDrawId}>{_.LuckyName}</Select.Option>
                    ))
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="奖品等级">
              {getFieldDecorator('DrawLevel')(
                <Select placeholder="请选择获取途径">
                  <Select.Option value="0">会员权益</Select.Option>
                  <Select.Option value="1">积分兑换</Select.Option>
                  <Select.Option value="2">分享赠送</Select.Option>
                  <Select.Option value="3">推荐注册赠送</Select.Option>
                  <Select.Option value="4">手工赠送</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator }, LotteryConfigDetails
    } = this.props;

    const { prizeType } = LotteryConfigDetails;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="奖品名称">
              {getFieldDecorator('DrawId')(
                <Select placeholder="请选择获取途径" allowClear>
                  {
                    prizeType.map(_ => (
                      <Select.Option key={_.LuckyDrawId} value={_.LuckyDrawId}>{_.LuckyName}</Select.Option>
                    ))
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="奖品等级">
              {getFieldDecorator('DrawLevel')(
                <Select placeholder="请选择获取途径">
                  <Select.Option value="0">会员权益</Select.Option>
                  <Select.Option value="1">积分兑换</Select.Option>
                  <Select.Option value="2">分享赠送</Select.Option>
                  <Select.Option value="3">推荐注册赠送</Select.Option>
                  <Select.Option value="4">手工赠送</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="释放状态">
              {getFieldDecorator('ReleaseStatus')(
                <Select placeholder="请选择释放状态" allowClear>
                  <Select.Option value={0}>未释放</Select.Option>
                  <Select.Option value={1}>已释放</Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="有效状态">
              {getFieldDecorator('Enabled')(
                <Select placeholder="请选择有效状态" style={{ width: '100%' }} allowClear>
                  <Select.Option value={0}>无效</Select.Option>
                  <Select.Option value={1}>有效</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="抽取状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择抽取状态" style={{ width: '100%' }} allowClear>
                  <Select.Option value="0">已抽取</Select.Option>
                  <Select.Option value="1">未抽取</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="中奖人员">
              {getFieldDecorator('Name')(
                <Input placeholder="请输入中奖人员"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="中奖人电话">
              {getFieldDecorator('Phone')(
                <Input placeholder="请输入中奖人电话"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="释放时间">
              {getFieldDecorator('ReleaseRangeDate')(
                <RangePicker
                  ranges={{
                    '今日': [moment().startOf('days'), moment().endOf('days')],
                    '本月': [moment().startOf('month'), moment().endOf('month')],
                  }}
                  format={DateFormat}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="中奖时间">
              {getFieldDecorator('WinRangeDate')(
                <RangePicker
                  ranges={{
                    '今日': [moment().startOf('days'), moment().endOf('days')],
                    '本月': [moment().startOf('month'), moment().endOf('month')],
                  }}
                  format={DateFormat}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

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

  handleTableChange = (pagination: Partial<PaginationProps>) => {
    const params: Partial<TableListParams> = {
      Index: pagination.current,
      Size: pagination.pageSize,
    };
    this.handelInitFetch(params)
  }

  render() {
    const { loading, form, LotteryConfigDetails } = this.props;
    const { advancedOperation5 } = LotteryConfigDetails;
    const { list = [], pagination = false } = advancedOperation5;
    const { selectedRowKeys, editModalVisible, editFormValues, selectedRows } = this.state;

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
        disabled: record.Enabled === 0, // Column configuration not to be checked
      }),
    };


    const isDisabled = selectedRowKeys.length === 0;
    return (
      <>
        <Card
          bordered={false}
          style={{ borderRadius: '2px 2px 0 0' }}
          className={styles.tableListForm}
        >
          {this.renderForm()}
        </Card>
        <Card
          style={{ marginBottom: 24 }}
          bordered={false}
          title={
            <>
              <Tooltip title='选择多行，可批量编辑' >
                <Button
                  type="primary"
                  style={{marginRight: 12}}
                  disabled={isDisabled}
                  onClick={() => this.handleUpdateModalVisible(true, selectedRows)}
                >编辑</Button>
              </Tooltip>
              <Button
                type="danger"
                disabled={isDisabled}
                onClick={this.batchDisableHandle}
              >作废</Button>
            </>
          }
        >
          <Table
            bordered
            rowKey={'Id'}
            rowSelection={rowSelection}
            pagination={paginationProps}
            loading={loading.effects['LotteryConfigDetails/QueryPoolDrawItemParam']}
            dataSource={list}
            columns={this.columns}
            size='small'
            onChange={this.handleTableChange}
            // onRow={(record) => ({
            //   onClick: () => { this.selectRow(record) }
            // })}
          />
          {
            editFormValues && editFormValues.length !== 0 && (
              <EditPrizePoolManager
                visible={editModalVisible}
                values={editFormValues}
                modalEditHandle={this.handleUpdateModalVisible}
                saveHandle={this.batchSaveHandle}
              />
            )
          }
        </Card>
      </>
    )
  }
}

export default Form.create<PrizePoolProps>()(PrizePool);
