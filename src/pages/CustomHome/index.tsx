import {
  Badge,
  Button,
  Card,
  Divider,
  Form,
  message,
  Popconfirm,
  Tooltip
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
import EditForm from './components/EditForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { TableListItem, TableListPagination, TableListParams } from './data.d';
import { handleRefresh } from '@/utils'

import styles from './style.less';

const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 'default' | 'processing' | 'success' | 'error';
const statusMap = ['default', 'processing'];
const status = ['未发布', '已发布'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'customHome/add'
      | 'customHome/fetch'
      | 'customHome/remove'
      | 'customHome/update'
      | 'customHome/copy'
      | 'customHome/release'
    >
  >;
  loading: boolean;
  location: any;
  customHome: StateType;
}

interface TableListState {
  modalVisible: boolean;
  editModalVisible: boolean;
  formValues: { [key: string]: string };
  editFormValues: Partial<TableListItem>;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    customHome,
    loading,
  }: {
    customHome: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    customHome,
    loading: loading.models.customHome,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    editModalVisible: false,
    formValues: {},
    editFormValues: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '配置名称',
      dataIndex: 'ConfigName',
      render: (name: string, record: any) => {//PublishStatus
        return <Fragment>
          <Tooltip title="点击进入详情编辑" placement="right">
            <Link to={`/customhome/details/${record.Id}`}>{name}</Link>
          </Tooltip>
        </Fragment>
      }
    },
    {
      title: '创建人',
      dataIndex: 'CreatorName',
    },
    {
      title: '创建时间',
      dataIndex: 'ShowAddTime',
      render: (val: Date) => <span>{moment(new Date(val)).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '状态',
      dataIndex: 'PublishStatus',
      render(val: IStatusMapType) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleEditModalVisible(true, record)}>编辑名称</a>
          <Divider type="vertical" />
          <Popconfirm
            placement="topRight"
            title={`是否复制该条？`}
            okText="确定"
            cancelText="取消"
            onConfirm={e => this.handleCopy(record, e)}
          >
            <a>复制</a>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm
            placement="topRight"
            title={`是否发布该配置？`}
            okText="确定"
            cancelText="取消"
            onConfirm={e => this.handleRelease(record, e)}
          >
            <a>发布</a>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm
            placement="topRight"
            title={`是否删除该条？`}
            okText="确定"
            cancelText="取消"
            onConfirm={e => this.handleRemove(record, e)}
          >
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {

  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { location } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    handleRefresh(params, location)
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
        type: 'customHome/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };


  handleEditModalVisible = (flag?: boolean, record?: TableListItem) => {
    this.setState({
      editModalVisible: !!flag,
      editFormValues: record || {},
    });
  }

  handleAdd = (fields: { ConfigName: any }) => {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'customHome/add',
      payload: {
        ConfigId: '',
        ConfigName: fields.ConfigName,
      },
      callback: () => {
        message.success('新增配置成功');
        this.handleModalVisible();
        handleRefresh({}, location)
      }
    })
  };


  handleEdit = (fields: { ConfigName: string, Id: string }) => {
    const { dispatch, location } = this.props;
    this.handleEditModalVisible();
    dispatch({
      type: 'customHome/update',
      payload: {
        configId: fields.Id,
        ConfigName: fields.ConfigName,
      },
      callback: () => {
        message.success('修改配置名称成功');
        handleRefresh({}, location)
      }
    });
  };

  handleCopy = (fields: { Id: string }, e: any) => {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'customHome/copy',
      payload: {
        configId: fields.Id,
      },
      callback: () => {
        message.success('复制成功');
        handleRefresh({}, location)
      }
    });
  }

  handleRemove = (fields: { Id: string }, e: any) => {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'customHome/remove',
      payload: {
        configId: fields.Id,
      },
      callback: () => {
        message.success('删除成功');
        handleRefresh({}, location)
      }
    });
  }

  handleRelease = (fields: { Id: string }, e: any) => {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'customHome/release',
      payload: {
        configId: fields.Id,
      },
      callback: () => {
        message.success('发布项目成功');
        handleRefresh({}, location)
      }
    });
  }

  render() {
    const {
      customHome: { data },
      loading,
    } = this.props;

    const { modalVisible, editFormValues, editModalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const editMethods = {
      handleEditModalVisible: this.handleEditModalVisible,
      handleEdit: this.handleEdit,
    };


    return (
      <>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <StandardTable
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {editFormValues && Object.keys(editFormValues).length ? (
          <EditForm
            {...editMethods}
            editModalVisible={editModalVisible}
            values={editFormValues}
          />
        ) : null}
      </>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
