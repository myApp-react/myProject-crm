import React, { PureComponent } from 'react';
import { Table, Card, Form, Input, Button, Row, Col, Select, DatePicker, Icon, Tooltip } from 'antd';
import { FormComponentProps } from 'antd/es/form';

import styles from './index.less';
import { connect } from 'dva';
import { AdvancedProfileData, LuckyRecords, PoolDrawItemParam } from '@/pages/SweepStakes/LotteryConfig/data';
import { Action, Dispatch } from 'redux';
import { pathMatchRegexp } from '@/utils';
import { PaginationProps } from 'antd/es/pagination';
import { TableListParams } from '@/pages/SweepStakes/data';
const FormItem = Form.Item;
const { Search } = Input;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

interface columnsType {

}

interface PrizeListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'LotteryConfigDetails/QueryLuckyRecords'
      | 'LotteryConfigDetails/GetCardTypes'
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

interface PrizeListState {
  expandForm: boolean;
  selectedRowKeys: Array<any>;
  formValues: { [key: string]: string };
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
      ActivityDetails: LotteryConfigDetails.ActivityDetails,
      CardTypes: LotteryConfigDetails.CardTypes,
      advancedOperation6: LotteryConfigDetails.advancedOperation6
    },
    loading
  })
)
class PrizeList extends PureComponent<PrizeListProps, PrizeListState>{

  state: PrizeListState = {
    expandForm: false,
    formValues: {},
    selectedRowKeys: []
  }

  columns: columnsType = [
    {
      title: '抽奖时间',
      dataIndex: 'OperationTimeSpan',
    },
    {
      title: '抽奖人',
      dataIndex: 'WinnerName',
    },
    {
      title: '抽奖人',
      dataIndex: 'WinnerPhone',
    },
    {
      title: '抽奖人会员类型',
      dataIndex: 'LuckyDrawName1',
    },
    {
      title: '中奖状态',
      dataIndex: 'WinStatus',
    },
    {
      title: '奖品类型',
      dataIndex: 'DrawType',
    },
    {
      title: '奖品等级',
      dataIndex: 'LuckyDrawLevel',
    },

    {
      title: '奖品名称',
      dataIndex: 'LuckyDrawName',
    },
    {
      title: '奖品值',
      dataIndex: 'memo',
    },
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
    this.initFetch()
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

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });
      this.initFetch(values)
    });
  };

  initFetch = (fields?: LuckyRecords) => {
    const { dispatch, location } = this.props;
    const match = pathMatchRegexp('/sweepstakes/lotteryconfig/:id', location.pathname);
    if(match) {
      dispatch({
        type: 'LotteryConfigDetails/QueryLuckyRecords',
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
    this.initFetch();
    this.getCardTypeHandle();
    this.GetPrizeTypeHandle();
  }

  renderSimpleForm() {
    const { form, LotteryConfigDetails } = this.props;
    const { getFieldDecorator } = form;
    const { prizeType } = LotteryConfigDetails
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="奖品名称">
              {getFieldDecorator('LuckyDrawId')(
                <Select placeholder="请选择奖品名称">
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
              {getFieldDecorator('LuckyDrawLevel')(
                <Select placeholder="请选择奖品等级">
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
    const { CardTypes, prizeType } = LotteryConfigDetails
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="奖品名称">
              {getFieldDecorator('LuckyDrawId')(
                <Select placeholder="请选择奖品">
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
              {getFieldDecorator('LuckyDrawLevel')(
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
            <FormItem label="中奖状态">
              {getFieldDecorator('WinStatus')(
                <Select placeholder="请选择中奖状态">
                  <Select.Option value={1}>已中奖</Select.Option>
                  <Select.Option value={0}>未中奖</Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="会员类型">
              {getFieldDecorator('CardTypeId')(
                <Select placeholder="请选择会员类型" style={{ width: '100%' }} allowClear>
                  {
                    CardTypes.map(_ => (
                      <Select.Option key={_.Id} value={_.Id}>{_.CardTypeName}</Select.Option>
                    ))
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="中奖人员">
              {getFieldDecorator('WinnerName')(
                <Input placeholder="请输入中奖人员"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="中奖人电话">
              {getFieldDecorator('WinnerPhone')(
                <Input placeholder="请输入中奖人电话"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="中奖时间">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择开始状态" style={{ width: '100%' }}>
                  <Select.Option value="0">未开始</Select.Option>
                  <Select.Option value="1">已开始</Select.Option>
                  <Select.Option value="2">已结束</Select.Option>
                </Select>,
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

  selectRow = (record) => {
    const selectedRowKeys = [...this.state.selectedRowKeys];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    } else {
      selectedRowKeys.push(record.key);
    }
    this.setState({ selectedRowKeys });
  }

  onSelectedRowKeysChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  handleTableChange = (pagination: Partial<PaginationProps>) => {
    const params: Partial<TableListParams> = {
      Index: pagination.current,
      Size: pagination.pageSize,
    };
    this.initFetch(params)
  }

  render() {
    const { loading, LotteryConfigDetails } = this.props;
    const { advancedOperation6 } = LotteryConfigDetails;
    const { list = [], pagination = false } = advancedOperation6;
    const { selectedRowKeys } = this.state;

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
    };

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
        >
          <Table
            rowKey={'Id'}
            bordered
            pagination={paginationProps}
            loading={loading.effects['LotteryConfigDetails/QueryLuckyRecords']}
            dataSource={list}
            columns={this.columns}
            size='small'
            onChange={this.handleTableChange}
          />
        </Card>

      </>
    )
  }
}

export default Form.create<PrizeListProps>()(PrizeList);
