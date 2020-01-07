/**
 * title: 抽奖活动
 * */

import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  Row,
  Select,
  Tooltip,
  message,
  Menu,
  Dropdown,
  Tag,
  Modal,
} from 'antd';
import React, { Component, Fragment } from 'react';
import Link from 'umi/link'

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem, TableListPagination, TableListParams } from './data.d';

import styles from './style.less';
import { appType } from '@/models/app';
import { AddTableParams } from '@/pages/SweepStakes/data';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { confirm } = Modal;
const { Option } = Select;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 'default' | 'processing' | 'success' | 'error';
const statusMap = ['default', 'processing', 'error'];
const startStatusMap = ['default', 'processing', 'error'];
const startStatus = ['未开始', '已开始', '已结束'];
const status = ['未发布', '已发布', '取消发布'];
const activityMap = ['', '普通活动', '', '', '抽奖活动', '', ''];
const activityColorMap = ['', '#87d068', '#2db7f5', '#f50', '#108ee9', '#eb2f96', '#2f54eb'];
const dateFormat = 'YYYY.MM.DD HH:mm:ss';
const MenuItem = Menu.Item;

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'sweepStakes/add'
      | 'sweepStakes/fetch'
      | 'sweepStakes/remove'
      | 'sweepStakes/update'
      | 'sweepStakes/ChangeActivityPublishStatus'
      | 'sweepStakes/UploadActivityImage'
      | 'app/GetConfig'
    >
  >;
  loading: any;
  sweepStakes: StateType;
  app: appType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  updateFormValues: Partial<TableListItem>;
  formFlag: {
    [key: string]: boolean
  }
}


/* eslint react/no-multi-comp:0 */
@connect(
  ({
    sweepStakes,
    app,
    loading,
  }: {
    sweepStakes: StateType;
    app: appType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    sweepStakes,
    app,
    loading
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    updateFormValues: {},
    formFlag: {}
  };



  columns: StandardTableColumnProps[] = [
    {
      title: '活动名称',
      dataIndex: 'ActivityName',
      fixed: 'left',
      width: 180,
      render(name: string, record: any) {
        // const len = name.length;
        // if(len > 20){
        //   return <Tooltip title={name} placement="right">{String(name).slice(0, 12)}...</Tooltip>
        // }
        // return name
        return <Tooltip title='点击查看详情'>
          <Link to={`/sweepstakes/details/${record.ActivityId}`}>{name}</Link>
        </Tooltip>
      }
    },
    {
      title: '活动类型',
      dataIndex: 'ActivityType',
      width: 120,
      render: (val: number) => <Tag color={activityColorMap[val]}>{activityMap[val]}</Tag>
    },
    {
      title: '开始状态',
      dataIndex: 'StartStauts',
      width: 120,
      render(val: IStatusMapType) {
        return <Badge status={startStatusMap[val]} text={startStatus[val]} />;
      },
    },
    {
      title: '发布状态',
      dataIndex: 'PublishStatus',
      width: 120,
      render(val: IStatusMapType) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '活动范围时间',
      dataIndex: 'ActivityStartTimeSpan',
      width: 280,
      render: (val: string, record: any) => `${moment(val).format(dateFormat)} ~ ${moment(record.ActivityEndTimeSpan).format(dateFormat)}`,
    },
    {
      title: '收藏人数',
      dataIndex: 'CollectCount',
      align: 'right',
      width: 80,
    },
    {
      title: '点击数',
      dataIndex: 'ClickCount',
      align: 'right',
      width: 80,
    },
    {
      title: '发布时间',
      dataIndex: 'PublishTime',
      width: 150,
      render: (val: string) => {
        if(!val) return '-';
        return (
          <span>{moment(val).format(dateFormat)}</span>
        )
      },
    },
    {
      title: '是否需要报名',
      dataIndex: 'IsNeedApply',
      width: 110,
      align: 'right',
      render: (val: number) => val === 0 ? '否' : '是',
    },
    {
      title: '是否需要签到',
      dataIndex: 'IsSingin',
      width: 110,
      align: 'right',
      render: (val: number) => val === 0 ? '否' : '是',
    },
    {
      title: '是否推荐',
      dataIndex: 'IsRecommand',
      width: 110,
      align: 'right',
      render: (val: number) => val === 0 ? '否' : '是',
    },
    {
      title: '操作',
      width: 186,
      fixed: 'right',
      render: (text, record) => (
        <Fragment>
          {/*<Link to={`/sweepstakes/details/${record.ActivityId}`}>详情</Link>*/}
          {/*<Divider type="vertical" />*/}
          {/*<Tooltip title='编辑'>*/}
            {/*<Button*/}
              {/*type='primary'*/}
              {/*// shape="round"*/}
              {/*// icon="form"*/}
              {/*size='small'*/}
              {/*onClick={() => this.handleUpdateModalVisible(true, record)}*/}
            {/*>编辑</Button>*/}
          {/*</Tooltip>*/}
          <Button
            type='primary'
            size='small'
            onClick={() => this.handleUpdateModalVisible(true, record)}
          >编辑</Button>

          {/*<a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>*/}
          <Divider type="vertical" />
          <Button
            type='danger'
            size='small'
            disabled={record.PublishStatus !== 0}
            onClick={() => this.handleRemove(record.ActivityId)}
          >删除</Button>
          {/*<Tooltip title='删除'>*/}
            {/*<Button*/}
              {/*type="danger"*/}
              {/*shape="round"*/}
              {/*icon="delete"*/}
              {/*size='small'*/}
              {/*disabled={record.PublishStatus !== 0}*/}
              {/*onClick={() => this.handleRemove(record.ActivityId)}*/}
            {/*/>*/}
          {/*</Tooltip>*/}
          <Divider type="vertical" />
          <Dropdown overlay={this.tableMoreMenu(record)}>
            <a>更多 <Icon type="down" /></a>
          </Dropdown>
        </Fragment>
      ),
    },
  ];

  tableMoreMenu = (record: any) => {
    return (
      <Menu>
        <MenuItem>
          <Link to={`/sweepstakes/lotteryconfig/${record.ActivityId}`}>
            <Icon type="appstore" />
            <span className={styles['menu-text']}>抽奖管理</span>
          </Link>
        </MenuItem>
        <MenuItem>
          <a onClick={() => this.handleChangeActivityPublishStatus(record.ActivityId, record.PublishStatus)}>
            <Icon type="form" />
            <span className={styles['menu-text']}>{record.PublishStatus === 1 ? '取消发布' : '发布'}</span>
          </a>
        </MenuItem>
      </Menu>
    )
  }

  handleChangeActivityPublishStatus = (AcitivityId: string, PublishStatus: number) => {
    const { dispatch } = this.props;
    const currStatus = PublishStatus === 1 ? 2 : 1;
    const _self = this;
    confirm({
      title: `确认${PublishStatus === 1 ? '取消发布' : '发布'}该活动吗?`,
      onOk() {
        dispatch({
          type: 'sweepStakes/ChangeActivityPublishStatus',
          payload: { AcitivityId, PublishStatus: currStatus },
          callback: () => {
            message.success('操作成功！');
            _self.initFetch()
          }
        })
      },
    });
  }

  handleRemove = (AcitivityId: string) => {
    const { dispatch } = this.props;
    const _self = this;
    confirm({
      title: '确认删除该活动吗？',
      onOk() {
        dispatch({
          type: 'sweepStakes/remove',
          payload: { AcitivityId },
          callback: () => {
            message.success('删除活动成功！');
            _self.initFetch()
          }
        })
      }
    })

  }

  initFetch = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sweepStakes/fetch',
      payload: {
        Index: 1,
        Size: 15,
        ProjectId: '135f1c84-ad7f-42b8-9c7f-32ed7e5108c7'
      },
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'app/GetConfig' });
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
      Index: pagination.current,
      Size: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }


    dispatch({
      type: 'sweepStakes/fetch',
      payload: {
        ...params,
        Index: pagination.current,
        Size: pagination.pageSize,
      },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'sweepStakes/fetch',
      payload: {
        Index: 1,
        Size: 15,
        ProjectId: '135f1c84-ad7f-42b8-9c7f-32ed7e5108c7'
      },
    });
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

      let ActivityStartTime = undefined,
          ActivityEndTime = undefined,
          PublishStartTime = undefined,
          PublishEndTime = undefined;

      const { ActivityRangeDate, PublishRangeDate, ...extra } = fieldsValue;

      if(ActivityRangeDate && ActivityRangeDate.length !== 0) {
        ActivityStartTime = moment(ActivityRangeDate[0]).format(dateFormat);
        ActivityEndTime = moment(ActivityRangeDate[1]).format(dateFormat);
      }else {
        ActivityStartTime = undefined;
        ActivityEndTime = undefined;
      }

      if(PublishRangeDate && PublishRangeDate.length !== 0) {
        PublishStartTime = moment(PublishRangeDate[0]).format(dateFormat);
        PublishEndTime = moment(PublishRangeDate[1]).format(dateFormat);
      }else {
        PublishStartTime = undefined;
        PublishEndTime = undefined;
      }

      const values = {
        ...extra,
        ActivityStartTime,
        ActivityEndTime,
        PublishStartTime,
        PublishEndTime,
        Index: 1,
        Size: 15,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'sweepStakes/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean, formFlag?: { [key: string]: boolean }) => {
    this.setState({
      modalVisible: !!flag,
      formFlag: formFlag || {}
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: TableListItem) => {
    this.setState({
      updateModalVisible: !!flag,
      updateFormValues: record || {},
    });
  };

  handleAdd = (fields: AddTableParams) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sweepStakes/add',
      payload: {
        ...fields
      },
      callback: () => {
        message.success('添加成功');
        this.initFetch();
        this.handleModalVisible();
      }
    });
  };

  handleUpdate = (fields: AddTableParams) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sweepStakes/add',
      payload: {
        ...fields
      },
      callback: () => {
        message.success('修改成功！');
        this.initFetch();
        this.handleUpdateModalVisible(false, this.state.updateFormValues);
      }
    });
  };

  handleUploadImages = (dataStr: string, callback: (data: any) => void) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sweepStakes/UploadActivityImage',
      payload: {dataStr},
      callback: (data: any) => callback(data)
    })
  }

  renderSimpleForm() {
    const { form, app } = this.props;
    const { getFieldDecorator } = form;
    const { projectData } = app;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('ProjectId', {
                initialValue: projectData.length !== 0 && projectData[0].Id || undefined
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
            <FormItem label="活动类型">
              {getFieldDecorator('ActivityType')(
                <Select placeholder="请选择活动类型" style={{ width: '100%' }} allowClear={true}>
                  <Option value={1}>商场活动</Option>
                  <Option value={2}>商铺活动</Option>
                  <Option value={3}>在线活动</Option>
                  <Option value={4}>抽奖活动</Option>
                  <Option value={5}>满赠兑礼活动</Option>
                  <Option value={6}>领券活动</Option>
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
      form: { getFieldDecorator },
      app,
    } = this.props;
    const { projectData } = app;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('ProjectId', {
                initialValue: projectData.length !== 0 && projectData[0].Id || undefined
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
            <FormItem label="活动类型">
              {getFieldDecorator('ActivityType')(
                <Select placeholder="请选择活动类型" style={{ width: '100%' }} allowClear={true}>
                  <Option value={1}>商场活动</Option>
                  <Option value={2}>商铺活动</Option>
                  <Option value={3}>在线活动</Option>
                  <Option value={4}>抽奖活动</Option>
                  <Option value={5}>满赠兑礼活动</Option>
                  <Option value={6}>领券活动</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="活动名称">
              {getFieldDecorator('ActivityName')(<Input placeholder='请输入活动名称' autoComplete='off' style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="发布状态">
              {getFieldDecorator('PublishStatus')(
                <Select
                  placeholder="请选择发布状态"
                  style={{ width: '100%' }}
                  allowClear={true}
                >
                  <Option value={0}>未发布</Option>
                  <Option value={1}>已发布</Option>
                  <Option value={2}>取消发布</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="活动时间">
              {getFieldDecorator('ActivityRangeDate')(
                <RangePicker
                  format={dateFormat}
                  ranges={{
                    '今日': [moment().startOf('days'), moment().endOf('days')],
                    '本月': [moment().startOf('month'), moment().endOf('month')],
                  }}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="发布时间">
              {getFieldDecorator('PublishRangeDate')(
                <RangePicker
                  format={dateFormat}
                  ranges={{
                    '今日': [moment().startOf('days'), moment().endOf('days')],
                    '本月': [moment().startOf('month'), moment().endOf('month')],
                  }}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="开始状态">
              {getFieldDecorator('StartStauts')(
                <Select
                  placeholder="请选择开始状态"
                  style={{ width: '100%' }}
                  allowClear={true}
                >
                  <Option value={0}>未开始</Option>
                  <Option value={1}>已开始</Option>
                  <Option value={2}>已结束</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
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
      sweepStakes: { data }, app, loading } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, updateFormValues, formFlag } = this.state;
    const { projectData } = app;
    const parentMethods = {
      handleUploadImages: this.handleUploadImages,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUploadImages: this.handleUploadImages,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, {IsFlag: true})}>
                新建
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading.effects['sweepStakes/fetch']}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {formFlag && Object.keys(formFlag).length && (
            <CreateForm
              {...parentMethods}
              modalVisible={modalVisible}
              projectData={projectData}
            />
          )
        }
        {updateFormValues && Object.keys(updateFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={updateFormValues}
            projectData={projectData}
          />
        ) : null}
      </>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
