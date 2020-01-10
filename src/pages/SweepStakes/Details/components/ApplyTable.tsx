import React from 'react';
import { Table } from 'antd'
import {PaginationProps} from "antd/es/pagination";
import {TableListParams} from "@/pages/SweepStakes/data";
interface ApplyTableProps {
  dataSource: {
    list: Array<any>;
    pagination: any
  }
  loading: boolean;
  columns: Array<any>;
  GetApplysListHandle: (params?: { UserInfo?: string, SignInStatus?: number, Index?: number, Size?: number }) => void
}

const ApplyTable: React.FC<ApplyTableProps> = props => {
  const { dataSource, PrizeManagerChange, ...rest } = props;
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

  const handleTableChange = (pagination: Partial<PaginationProps>) => {
    const params: Partial<TableListParams> = {
      Index: pagination.current,
      Size: pagination.pageSize,
    };
    PrizeManagerChange(params)
  }


  return (
    <Table
      rowKey={'Id'}
      dataSource={list}
      pagination={paginationProps}
      size="small"
      scroll={{ y: 270 }}
      onChange={handleTableChange}
      {...rest}
    />
  );
};

export default ApplyTable;
