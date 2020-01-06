import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Row,
  Select,
  message,
  Typography,
  Tooltip,
  Tag,
} from 'antd';
import React, { Component } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { integralType } from './model';
import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import ViewDetailsForm from './components/ViewDetailsForm'
import { TableListItem, TableListPagination, TableListParams } from './data.d';

import styles from './style.less';
import { appType } from '@/models/app';

const { RangePicker } = DatePicker;
const { Paragraph } = Typography;

const FormItem = Form.Item;
const { Option } = Select;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const dateFormat = 'YYYY.MM.DD HH:mm:ss';
const statusMap = ['default', 'success', 'error'];
const statusMap1 = ['geekblue', 'green', 'red'];

const status = ['未审核', '审核通过', '审核驳回'];
const ScoureType = ['', '微网站', '后台管理'];
const DateFormat = 'YYYY-MM-DD HH:mm:ss';
const initStart = moment().subtract(15, 'days').startOf('days');
const initEnd = moment().endOf('days');
const SortType = {
  'ascend': 0,
  'descend': 1,
};

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'integralList/add'
      | 'integralList/fetch'
      | 'integralList/update'
      | 'integralList/QueryScoresSupplementSummary'
      | 'app/GetConfig'
      | 'app/GetStoreInfo'
      | 'app/GetServicePoint'
    >
  >;
  loading: boolean;
  location: any;
  integralList: integralType;
  app: appType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  detailsModalVisible: boolean;
  detailsForm: string;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Array<TableListItem>;
  initDate: Array<any>;

}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    integralList,
    app,
    loading,
  }: {
    integralList: integralType;
    app: appType;
    loading: {
      models: {
        [key: string]: boolean;
      };
      effects: {
        [key: string]: boolean;
      }
    };
  }) => ({
    integralList,
    app,
    loading
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    detailsModalVisible: false,
    detailsForm: '',
    expandForm: false,
    selectedRows: [],
    formValues: {
      ProjectId: '135f1c84-ad7f-42b8-9c7f-32ed7e5108c7'
    },
    stepFormValues: [],
    initDate: [initStart, initEnd],
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '补录时间',
      dataIndex: 'SupplementTimeSpan',
      sorter: true,
      width: 150,
      fixed: 'left',
      render: (val: string, record: any) => <Tooltip title='点击查看详情'>
        <a
          onClick={() => this.handleDetailsModalVisible(true, record.Id)}
        >
          {moment(val).format('YYYY-MM-DD HH:mm:ss')}
        </a>
      </Tooltip>,
    },
    {
      title: '小票编号',
      dataIndex: 'RepitCode',
      width: 140,
      fixed: 'left',
      render: (text: number) => {
        if(!text) return '-';
        const textLen = String(text).length;
        if(textLen > 11){
          return (
            <Paragraph copyable={{text: text }} className={styles.copy}>{`${text.slice(0, 11)}...`}</Paragraph>
          )
        }
        return (
          <Paragraph copyable={{text: text }} className={styles.copy}>{text}</Paragraph>
        )
      },
    },

    {
      title: '项目名称',
      dataIndex: 'ProjectName',
    },
    {
      title: '服务台',
      dataIndex: 'ServicePointName',
      render: (name: string) => {
        if(name) return name;
        return '-'
      },
    },
    {
      title: '商铺名称',
      dataIndex: 'StoreName',
      render: (name: string) => {
        if(name) return name;
        return '-'
      },
    },
    {
      title: '会员名称',
      dataIndex: 'CustomerName',
      width: 125,
      render: (name: string) => {
        if(!name) return '-';
        const len = name.length;
        if(len > 7) return <Tooltip title={name}>{name.slice(0, 7)}...</Tooltip>;
        return name;
      },
    },
    {
      title: '手机号',
      dataIndex: 'Phone',
      width: 120
    },
    {
      title: '交易日期',
      dataIndex: 'TransactionTimeSpan',
      width: 150,
      sorter: true,
      render: (res: string) => {
        if(res) return moment(res).format('YYYY-MM-DD HH:mm:ss');
        return '-'
      },
    },
    {
      title: '小票金额',
      dataIndex: 'RepitAmt',
      sorter: true,
      width: 100,
      className: 'column-money',
      render: (res: number) => {
        if(res || res === 0) return `￥${res}`
        return `-`
      },
    },
    {
      title: '变动积分',
      width: 100,
      dataIndex: 'ChnangeScores',
      sorter: true,
      needTotal: false,
      className: 'column-Scores',
    },
    {
      title: '来源',
      width: 75,
      dataIndex: 'ScoureType',
      render(val: number) {
        return ScoureType[val]
      },
    },
    {
      title: '审核状态',
      width: 90,
      dataIndex: 'Status',
      render(val: number) {
        // return <Badge status={statusMap[val]} text={status[val]} />;
        return <Tag color={statusMap1[val]} >{status[val]}</Tag>;
      },
    },
    {
      title: '审核时间',
      dataIndex: 'AduitTimeSpan',
      sorter: true,
      width: 148,
      render: (val: string) => {
        if(val) return moment(val).format('YYYY-MM-DD HH:mm:ss');
        return '-'
      },
    },
    {
      title: '审核人',
      width: 90,
      dataIndex: 'Aduiter',
      render: (val: string) => {
        if(val) return val;
        return '-'
      },
    },
    {
      title: '审核备注',
      dataIndex: 'AduitNote',
      width: 180,
      ellipsis: true,
      render: (val: string) => {
        if(val) return val;
        return '-'
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'app/GetConfig' });
    dispatch({ type: 'app/GetStoreInfo' });
    dispatch({ type: 'app/GetServicePoint' });
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.SortBy = `${sorter.field}`;
      if(sorter.order){
        params.SortType = SortType[sorter.order];
      }else {
        delete params.SortType
      }
    }

    dispatch({
      type: 'integralList/fetch',
      payload: {
        ...params,
        Index: pagination.current,
        Size: pagination.pageSize,
      }
    })
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {
        ProjectId: '135f1c84-ad7f-42b8-9c7f-32ed7e5108c7'
      },
    });
    dispatch({
      type: 'integralList/fetch',
      payload: {
        ProjectId: '135f1c84-ad7f-42b8-9c7f-32ed7e5108c7',
        Index: 1,
        Size: 15,
      },
    });

    dispatch({
      type: 'integralList/QueryScoresSupplementSummary',
      payload: {
        ProjectId: '135f1c84-ad7f-42b8-9c7f-32ed7e5108c7',
      }
    })

  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let StartSupplementTime = undefined,
        EndSupplementTime = undefined,
        StartTransactionTime = undefined,
        EndTransactionTime = undefined;

      const { StartSupplementRangeDate, dealRangeDate, ...extra } = fieldsValue;

      if(StartSupplementRangeDate && StartSupplementRangeDate.length !== 0) {
          StartSupplementTime = moment(StartSupplementRangeDate[0]).format(DateFormat);
          EndSupplementTime = moment(StartSupplementRangeDate[1]).format(DateFormat);
      }else {
        StartSupplementTime = undefined;
        EndSupplementTime = undefined;
      }

      if(dealRangeDate && dealRangeDate.length !== 0) {
        StartTransactionTime = moment(dealRangeDate[0]).format(DateFormat);
        EndTransactionTime = moment(dealRangeDate[1]).format(DateFormat);
      }else {
        StartTransactionTime = undefined;
        EndTransactionTime = undefined;
      }

      const values = {
        ...extra,
        StartSupplementTime,
        EndSupplementTime,
        StartTransactionTime,
        EndTransactionTime,

      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'integralList/fetch',
        payload: {
          ...values,
          Index: 1,
          Size: 15,
        },
      });
      this.getTotalHandle(values)
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: TableListItem[]) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || [],
    });
  };

  handleDetailsModalVisible = (flag?: boolean, itemId?: string) => {
    this.setState({
      detailsModalVisible: !!flag,
      detailsForm: itemId || '',
    });
  }

  initHandle = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'integralList/fetch',
      payload: {
        Index: 1,
        Size: 15,
        ProjectId: '135f1c84-ad7f-42b8-9c7f-32ed7e5108c7'
      },
    });
    this.setState({
      selectedRows: []
    })
  }

  handleAdd = (fields: {
    ProjectId: string,
    ServicePointId: string,
    CustomerId: string,
    StoreId: string,
    SaleTime: string,
    ReciptCode: string,
    ProductCount: number,
    ReciptAmt: any,
    ImageGuid: string,
  }, callback: () => void) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'integralList/add',
      payload: fields,
      callback: () => {
        // 添加完成
        message.success('添加成功');
        this.handleModalVisible();
        this.initHandle()
        callback()
      }
    });
  };

  getTotalHandle = (params: {
    ProjectId: string,
    ScoureType: number,
    RepitCode: string,
    StoreName: string,
    UserInfo: string,
    StartSupplementTime: string,
    EndSupplementTime: string,
    StartTransactionTime: string,
    EndTransactionTime: string,
    Status: number
  }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'integralList/QueryScoresSupplementSummary',
      payload: {
        ...params
      }
    })
  };

  renderSimpleForm() {
    const { form, app } = this.props;
    const { projectData } = app;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('ProjectId', {
                initialValue: projectData[0] && projectData[0].Id || undefined
              })(
                <Select placeholder="请选择项目名称" style={{ width: '100%' }}>
                  {
                    projectData.map(_ => (
                      <Option key={_.Id} value={_.Id}>{_.ProjectName}</Option>
                    ))
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="积分来源">
              {getFieldDecorator('ScoureType')(
                <Select
                  placeholder="请选择积分来源"
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Option value={1}>微网站</Option>
                  <Option value={2}>后台录入</Option>
                </Select>
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
      app
    } = this.props;
    const { projectData } = app;
    const { initDate } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout='inline'>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('ProjectId')(
                <Select placeholder="请选择项目名称" style={{ width: '100%' }}>
                  {
                    projectData.map(_ => (
                      <Option key={_.Id} value={_.Id}>{_.ProjectName}</Option>
                    ))
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="积分来源">
              {getFieldDecorator('ScoureType')(
                <Select
                  placeholder="请选择积分来源"
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Option value={1}>微网站</Option>
                  <Option value={2}>后台录入</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="小票编号">
              {getFieldDecorator('RepitCode')(<Input placeholder="请输入小票编号" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="商铺名称">
              {getFieldDecorator('StoreName')(
                <Input placeholder="请输入商铺名称" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="会员搜索">
              {getFieldDecorator('UserInfo')(<Input placeholder="卡号/名称/手机号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="审批状态">
              {getFieldDecorator('Status', {
                initialValue: 0
              })(
                <Select
                  placeholder="请选择审批状态"
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Option value={0}>未审核</Option>
                  <Option value={1}>审核通过</Option>
                  <Option value={2}>审核驳回</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="补录时间">
              {getFieldDecorator('StartSupplementRangeDate', ({
                initialValue: initDate
              }))(
                <RangePicker
                  style={{ width: '100%' }}
                  format={dateFormat}
                  ranges={{
                    '今日': [moment().startOf('days'), moment().endOf('days')],
                    '本月': [moment().startOf('month'), moment().endOf('month')],
                  }}
                  placeholder={['开始时间', '截止时间']}
                  showTime={{ format: 'HH:mm:ss' }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="交易时间">
              {getFieldDecorator('dealRangeDate')(
                <RangePicker
                  style={{ width: '100%' }}
                  format={dateFormat}
                  ranges={{
                    '今日': [moment().startOf('days'), moment().endOf('days')],
                    '本月': [moment().startOf('month'), moment().endOf('month')],
                  }}
                  placeholder={['开始时间', '截止时间']}
                  showTime={{ format: 'HH:mm:ss' }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      integralList: { data, projectData, totalData },
      loading,
    } = this.props;

    const { selectedRows, modalVisible, updateModalVisible, stepFormValues, detailsForm, detailsModalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      initHandle: this.initHandle,
    };
    return (
      <>
        <Card bordered={false} bodyStyle={{paddingBottom: 150}}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(true)}
              >
                积分补录
              </Button>
              <Button
                type="primary"
                disabled={selectedRows.length === 0}
                onClick={() => this.handleUpdateModalVisible(true, selectedRows)}
              >
                审核
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading.effects['integralList/fetch']}
              totalLoading={loading.effects['integralList/QueryScoresSupplementSummary']}
              data={data}
              columns={this.columns}
              totalData={totalData}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          projectData={projectData}
        />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
        {
          detailsForm && (
            <ViewDetailsForm
              detailsModalVisible={detailsModalVisible}
              values={detailsForm}
              handleDetailsModalVisible={this.handleDetailsModalVisible}
            />
          )
        }
      </>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
