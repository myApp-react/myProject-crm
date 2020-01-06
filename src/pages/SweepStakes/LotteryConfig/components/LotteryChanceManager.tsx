import React, { PureComponent } from 'react';
import {
  Table,
  Card,
  Form,
  Input,
  Button,
  Divider,
  Row,
  Col,
  Select,
  InputNumber,
  DatePicker,
  Icon,
  Switch,
  Tooltip,
  message,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { PaginationProps } from 'antd/es/pagination';

import styles from './index.less';
import moment from 'moment';

const FormItem = Form.Item;
const { Search } = Input;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const ChannelTypeMap = ['', '会员权益', '积分兑换', '分享获取', '注册推荐', '手工赠送', '再试一次', '活动赠送'];
const UseStatusMap = ['未使用', '已使用'];

import { AddLotteryChanceManager } from '../form';
import { connect } from 'dva';
import { AdvancedProfileData } from '@/pages/SweepStakes/LotteryConfig/data';
import { Action, Dispatch } from 'redux';
import { pathMatchRegexp } from '@/utils';
import { TableListParams } from '@/pages/SweepStakes/data';


interface columnsType {

}

export interface CustomerInfo {
  PersonName: string;
  OpenId: string;
  PersonPhone: string;
  CustomerId: string;
}

interface LotteryChanceManagerProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'LotteryConfigDetails/GetSimpleLuckyDraws'
      | 'LotteryConfigDetails/QueryLuckyTableRadians'
      | 'LotteryConfigDetails/SaveLuckyTableRadian'
      | 'LotteryConfigDetails/DeleteLuckyTableRadian'
      | 'LotteryConfigDetails/QueryLuckyChanceItems'
      | 'LotteryConfigDetails/QuerySysPerson'
      | 'LotteryConfigDetails/SendLuckyChance'
      | 'LotteryConfigDetails/ChangeLuckyChanceEnableStatus'
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

interface LotteryChanceManagerState {
  expandForm: boolean;
  formValues: { [key: string]: string };
  addModalVisible: boolean;
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
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    LotteryConfigDetails: {
      prizeType: LotteryConfigDetails.prizeType,
      advancedOperation4: LotteryConfigDetails.advancedOperation4
    },
    loading
  })
)
class LotteryChanceManager extends PureComponent<LotteryChanceManagerProps, LotteryChanceManagerState>{

  state: LotteryChanceManagerState = {
    expandForm: false,
    formValues: {},
    addModalVisible: false,
  }

  columns: columnsType = [
    {
      title: '抽奖人姓名',
      dataIndex: 'Name',
    },
    {
      title: '抽奖人电话',
      dataIndex: 'Phone',
      render: (val: string) => {
        if(val) return val;
        return '-'
      }
    },
    {
      title: '获取途径',
      dataIndex: 'ChannelType',
      render: (val: number) => ChannelTypeMap[val]
    },
    {
      title: '获取时间',
      dataIndex: 'GetTimeSpan',
      render: (val: number) => moment(val).format(dateFormat)
    },
    {
      title: '使用状态',
      dataIndex: 'UseStatus',
      render: (val: number) => UseStatusMap[val]
    },
    {
      title: '赠送人',
      dataIndex: 'memo11',
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
      render: (val: number | null) => {
        if(val) return moment(val).format(dateFormat);
        return '-'
      }
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      render: (text: string, record: any) => (
        <>
          <Switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
            checked={record.enableStatus === 1}
            onChange={() => this.handleChangeLucwyStatus(record.Id, record.enableStatus)}
          />
          {/*<Tooltip title='导出'>*/}
            {/*<Button type="primary" size='small' shape="round" icon="cloud-download" disabled/>*/}
          {/*</Tooltip>*/}

        </>
      ),
    },
  ];

  handleChangeLucwyStatus = (id: string, enableStatus: number) => {
    const currStatus = enableStatus === 0 ? 1 : 0;
    const { dispatch } = this.props;
    dispatch({
      type: 'LotteryConfigDetails/ChangeLuckyChanceEnableStatus',
      payload: { id, enableStatus: currStatus },
      callback: () => {
        message.success('变更状态成功！');
        this.initFetch();
      }
    })
  }

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
    this.initFetch();
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };


  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let StartTime = undefined,
          EndTime = undefined;
      const { RangeDate, ...rest } = fieldsValue;
      if(RangeDate && RangeDate.length !== 0){
        StartTime = moment(RangeDate[0]).format(dateFormat)
        EndTime = moment(RangeDate[1]).format(dateFormat)
      }else {
        StartTime = undefined;
        EndTime = undefined;
      }

      const values = {
        ...rest,
        StartTime,
        EndTime
      };

      this.setState({
        formValues: values,
      });
      console.log(values)
      this.initFetch(values)
    });
  };

  initFetch = (fields?: {
    ChannelType?: number,
    UserInfo?: string,
    Enabled?: number,
    UseStatus?: number,
    StartTime?: string,
    EndTime?: string,
    Index?: number,
    Size?: number }) => {
    const { dispatch, location } = this.props;
    const match = pathMatchRegexp('/sweepstakes/lotteryconfig/:id', location.pathname);
    if(match) {
      dispatch({
        type: 'LotteryConfigDetails/QueryLuckyChanceItems',
        payload: {
          activityId: match[1],
          Index: 1,
          Size: 10,
          ...fields
        }
      })
    }

  }


  componentDidMount() {
    this.initFetch()
  }

  SearchUserInfoHandle = (userInfo: string, callback: (data: CustomerInfo | null) => void) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'LotteryConfigDetails/QuerySysPerson',
      payload: { userInfo },
      callback: (data: CustomerInfo | null) => callback(data)
    })
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="获取途径">
              {getFieldDecorator('ChannelType')(
                <Select placeholder="请选择获取途径">
                  <Select.Option value={1}>会员权益</Select.Option>
                  <Select.Option value={2}>积分兑换</Select.Option>
                  <Select.Option value={3}>分享赠送</Select.Option>
                  <Select.Option value={4}>推荐注册赠送</Select.Option>
                  <Select.Option value={5}>手工赠送</Select.Option>
                  <Select.Option value={6}>再试一次</Select.Option>
                  <Select.Option value={7}>活动赠送</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="抽奖人员">
              {getFieldDecorator('UserInfo')(
                <Input placeholder='请输入手机号、卡号、昵称' />,
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
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="获取途径">
              {getFieldDecorator('ChannelType')(
                <Select placeholder="请选择获取途径">
                  <Select.Option value={1}>会员权益</Select.Option>
                  <Select.Option value={2}>积分兑换</Select.Option>
                  <Select.Option value={3}>分享赠送</Select.Option>
                  <Select.Option value={4}>推荐注册赠送</Select.Option>
                  <Select.Option value={5}>手工赠送</Select.Option>
                  <Select.Option value={6}>再试一次</Select.Option>
                  <Select.Option value={7}>活动赠送</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="抽奖人员">
              {getFieldDecorator('UserInfo')(
                <Input placeholder='请输入手机号、卡号、昵称' />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="有效状态">
              {getFieldDecorator('Enabled')(
                <Select placeholder="请选择有效状态" style={{ width: '100%' }} allowClear>
                  <Select.Option value={1}>启用</Select.Option>
                  <Select.Option value={2}>禁用</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          {/*<Col md={8} sm={24}>*/}
            {/*<FormItem label="单人获取总数量大于">*/}
              {/*{getFieldDecorator('number')(*/}
                {/*<InputNumber placeholder='请输入数量' autoComplete='off' style={{ width: '100%' }} />)}*/}
            {/*</FormItem>*/}
          {/*</Col>*/}
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('UseStatus')(
                <Select placeholder="请选择使用状态" style={{ width: '100%' }} allowClear>
                  <Select.Option value="0">有效</Select.Option>
                  <Select.Option value="1">无效</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="时间范围">
              {getFieldDecorator('RangeDate')(
                <RangePicker
                  format={dateFormat}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
          </Col>
        </Row>

      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  /**新增*/
  addHandle = () => {
    this.setState((pre) => ({
      addModalVisible: !pre.addModalVisible
    }))
  }

  saveHandle = (fields: { openId: string, count: number }, callback: () => void) => {
    const { dispatch, location } = this.props;
    const match = pathMatchRegexp('/sweepstakes/lotteryconfig/:id', location.pathname);
    if(match) {
      dispatch({
        type: 'LotteryConfigDetails/SendLuckyChance',
        payload: {
          activityId: match[1],
          ...fields
        },
        callback: () => {
          message.success('新增成功！');
          this.initFetch();
          callback()
        }
      })
    }
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
    const { advancedOperation4 } = LotteryConfigDetails;
    const { addModalVisible } = this.state;
    const { list = [], pagination = false } = advancedOperation4;
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
              <Button icon='plus' type="primary" style={{marginRight: 12}} onClick={this.addHandle}>新增</Button>
              <Button icon='cloud-upload' type="primary"  style={{marginRight: 12}} disabled>导入</Button>
              <Button icon='cloud-upload' type="primary" disabled>导出</Button>
            </>
          }
        >
          <Table
            bordered
            rowKey={'Id'}
            pagination={paginationProps}
            loading={loading.effects['LotteryConfigDetails/QueryLuckyChanceItems']}
            dataSource={list}
            columns={this.columns}
            size='small'
            onChange={this.handleTableChange}
          />
        </Card>
        <AddLotteryChanceManager
          visible={addModalVisible}
          modalEditHandle={this.addHandle}
          SearchUser={this.SearchUserInfoHandle}
          saveHandle={this.saveHandle}
        />
      </>
    )
  }
}

export default Form.create<LotteryChanceManagerProps>()(LotteryChanceManager);
