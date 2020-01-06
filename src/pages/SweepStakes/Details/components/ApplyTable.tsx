import React from 'react';
import { Table } from 'antd'
interface ApplyTableProps {
  dataSource: {
    list: Array<any>;
    pagination: any
  }
  loading: boolean;
  columns: Array<any>;
}

const ApplyTable: React.FC<ApplyTableProps> = props => {
  const { dataSource, ...rest } = props;
  const { list = [], pagination = false } = dataSource;
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
    <Table
      dataSource={list}
      pagination={paginationProps}
      size="small"
      scroll={{ y: 270 }}
      {...rest}
    />
  );
};

export default ApplyTable;
