import {
  Skeleton,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  Switch,
  message,
} from 'antd';
import React, { Component, Suspense, lazy } from 'react';

import Prompt from 'umi/prompt';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
// import CreateForm from './components/CreateForm';
import { StandardTableColumnProps } from './components/StandardTable';
import { FormValueType } from './components/UpdateForm';
import { TableListItem, TableListPagination, TableListParams } from './data.d';

import styles from './style.less';

const StandardTable = lazy(() => import('./components/StandardTable'));
const UpdateForm = lazy(() => import('./components/UpdateForm'));
const CreateForm = lazy(() => import('./components/CreateForm'));

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 'default' | 'processing' | 'success' | 'error';
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'cashCoupons/add'
      | 'cashCoupons/fetch'
      | 'cashCoupons/remove'
      | 'cashCoupons/update'
    >
  >;
  loading: boolean;
  cashCoupons: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    cashCoupons,
    loading,
  }: {
    cashCoupons: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    cashCoupons,
    loading: loading.models.cashCoupons,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '规则名称',
      dataIndex: 'desc1',
      width: 180,
      fixed: 'left'
    },
    {
      title: '编号',
      dataIndex: 'name',
    },
    {
      title: '项目',
      dataIndex: 'desc',
    },
    {
      title: '有效期',
      dataIndex: 'desc2',
      width: 160,
    },
    {
      title: '限制类型',
      dataIndex: 'desc3',
    },
    {
      title: '单笔可用张数',
      dataIndex: 'desc4',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '创建人',
      dataIndex: 'remark1',
    },
    {
      title: '创建时间',
      dataIndex: 'remark2',
    },
    {
      title: '最后修改人',
      dataIndex: 'remark3',
    },
    {
      title: '最后修改时间',
      dataIndex: 'updatedAt',
      width: 160,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (text, record) => (
        <>
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <a href="">删除</a>
        </>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cashCoupons/fetch',
    });
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
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'cashCoupons/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'cashCoupons/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = (e: { key: string }) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'cashCoupons/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
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

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'cashCoupons/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: FormValueType) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = (fields: { desc: any }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cashCoupons/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = (fields: FormValueType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cashCoupons/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('status')(
                <Select placeholder="请选择项目名称" style={{ width: '100%' }}>
                  <Option value="0">中铁建186MALL</Option>
                  <Option value="1">逸都汇</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入规则名称" />)}
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
            <FormItem label="项目名称">
              {getFieldDecorator('status')(
                <Select placeholder="请选择项目名称" style={{ width: '100%' }}>
                  <Option value="0">中铁建186MALL</Option>
                  <Option value="1">逸都汇</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入规则名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">启用</Option>
                  <Option value="1">禁用</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="限制类型">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择限制类型" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="起止时间">
              {getFieldDecorator('date')(
                <RangePicker style={{ width: '100%' }} placeholder="请输入更新日期" />,
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

  render() {
    const {
      cashCoupons: { data },
      loading,
    } = this.props;

    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
        <>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                </Button>
                {selectedRows.length > 0 && (
                  <span>
                    <Button>批量操作</Button>
                    <Dropdown overlay={menu}>
                      <Button>
                        更多操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                )}
              </div>
              <Suspense fallback={null}>
                <StandardTable
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={this.columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </Suspense>
            </div>
          </Card>
          <Suspense fallback={null}>
            <CreateForm {...parentMethods} modalVisible={modalVisible} />
          </Suspense>
          {stepFormValues && Object.keys(stepFormValues).length && (
            <Suspense fallback={null}>
              <UpdateForm
                {...updateMethods}
                updateModalVisible={updateModalVisible}
                values={stepFormValues}
              />
            </Suspense>
          )}
        </>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
