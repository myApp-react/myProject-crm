import { Alert, Table } from 'antd';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';

import React, { Component } from 'react';

import { TableListItem } from '../../data.d';
import styles from './index.less';


type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: StandardTableColumnProps[];
  data: {
    list: TableListItem[];
    pagination: StandardTableProps<TableListItem>['pagination'];
  };
  selectedRows: TableListItem[];
  onSelectRow: (rows: any) => void;
  totalData: {
    Amt: number,
    Scores: number
  },
  totalLoading: boolean
}

export interface StandardTableColumnProps extends ColumnProps<TableListItem> {
  needTotal?: boolean;
  total?: number;
}

function initTotalList(columns: StandardTableColumnProps[]) {
  if (!columns) {
    return [];
  }
  const totalList: StandardTableColumnProps[] = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

interface StandardTableState {
  selectedRowKeys: string[];
  needTotalList: StandardTableColumnProps[];
}

class StandardTable extends Component<StandardTableProps<TableListItem>, StandardTableState> {
  static getDerivedStateFromProps(nextProps: StandardTableProps<TableListItem>) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  constructor(props: StandardTableProps<TableListItem>) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);
    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  handleRowSelectChange: TableRowSelection<TableListItem>['onChange'] = (
    selectedRowKeys,
    selectedRows: TableListItem[],
  ) => {
    const currySelectedRowKeys = selectedRowKeys as string[];
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }
    this.setState({ selectedRowKeys: currySelectedRowKeys, needTotalList });
  };

  handleTableChange: TableProps<TableListItem>['onChange'] = (
    pagination,
    filters,
    sorter,
    ...rest,
  ) => {
    const { onChange } = this.props;
    if (onChange) {

      onChange(pagination, filters, sorter, ...rest);
    }
  };

  selectRow = (record: TableListItem) => {
    if(record.Status === 1 || record.Status === 2) return;

    let selectedRowKeys = [...this.state.selectedRowKeys];
    let selectedRows = [...this.props.selectedRows];

    if (selectedRowKeys.indexOf(record.Id) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.Id), 1);
      // selectedRows.splice(selectedRows.indexOf(record.Id), 1);
      selectedRows = selectedRows.filter(_ => _.Id !== record.Id);
    } else {
      selectedRowKeys.push(record.Id);
      selectedRows.push(record)
    }

    this.setState((pre) => ({
      selectedRowKeys
    }));
    this.props.onSelectRow(selectedRows);
  }

  render() {
    const { selectedRowKeys } = this.state;
    const { data, totalData, totalLoading, ...rest } = this.props;
    const { Amt, Scores } = totalData;
    const { list = [], pagination = false } = data || {};

    const paginationProps = pagination
      ? {
          showSizeChanger: true,
          showQuickJumper: true,
          size: 'default',
          pageSizeOptions: ['15', '30', '45', '60'],
          showTotal: (total: number) => `总共 ${total} 条数据`,
          ...pagination,
        }
      : false;

    const rowSelection: TableRowSelection<TableListItem> = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: (record: TableListItem) => ({
        disabled: record.Status === 1 || record.Status === 2,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={
              totalLoading ? '获取中...' :
              <>
                <span>小票金额合计：{Amt} &nbsp;&nbsp;&nbsp;&nbsp;   变动积分合计： {Scores}</span>
              </>
            }
            type="info"
            showIcon
          />
        </div>
        <Table
          rowKey={(record: TableListItem) => record.Id}
          rowSelection={rowSelection}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={{
            x: 1880,
            // y: 'calc(100vh - 300px)'
          }}
          // expandedRowRender={record => <p style={{ margin: 0 }}>审核备注: {record.AduitNote || '暂无备注信息'}</p>}
          size='small'
          bordered
          // onRow={(record, e, i) => ({
          //   onClick: (event) => this.selectRow(record)
          // })}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
