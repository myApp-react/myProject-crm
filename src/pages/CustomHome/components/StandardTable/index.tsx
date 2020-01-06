import { Table } from 'antd';
import { ColumnProps, TableProps } from 'antd/es/table';
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
}

export interface StandardTableColumnProps extends ColumnProps<TableListItem> {
  needTotal?: boolean;
  total?: number;
}


class StandardTable extends Component<StandardTableProps<TableListItem>, {}> {


  handleTableChange: TableProps<TableListItem>['onChange'] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, extra);
    }
  };

  render() {
    const { data, rowKey, ...rest } = this.props;
    const { list = [], pagination = false } = data;

    const paginationProps = pagination
      ? {
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: number) => `总共 ${total} 条数据`,
          ...pagination,
        }
      : false;
    return (
      <div className={styles.standardTable}>
        <Table
          // rowKey={rowKey || 'key'}
          dataSource={list}
          pagination={paginationProps}
          rowKey={(record: any) => record.Id}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
