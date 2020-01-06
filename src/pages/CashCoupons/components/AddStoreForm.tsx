import { Form, Input, Modal, Row, Col, Select, Button, Icon, InputNumber, Spin, Radio, Alert, Tooltip, DatePicker, Table } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { PureComponent } from 'react';

import styles from './CreateForm.less'
import { TableRowSelection } from 'antd/es/table';
import { TableListItem } from '@/pages/CashCoupons/data';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD HH:mm';

let id = 0;
let singleId = 0;

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};


interface CreateFormProps extends FormComponentProps {
  AddModalVisible: boolean;
  handleModalVisible: () => void;
}

interface CreateFormState {
  limitType: number;
  joinType: number;
  limitEveryStatus: boolean;
  data: Array<any>;
  loading: boolean;
  selectedRowKeys: string[];
}

class CreateCouponsForm extends PureComponent<CreateFormProps, CreateFormState>{

  private  id: number = 0;
  private  singleId: number = 0;

  state: CreateFormState = {
    limitType: 1,
    joinType: 1,
    limitEveryStatus: false,
    data: [],
    loading: false,
    selectedRowKeys: [],
  }

  columns = [
    {
      title: '商铺编号',
      dataIndex: 'name',
      render: text => 213123,
    },
    {
      title: '商铺名称',
      dataIndex: 'age',
    },
  ];

  /**表单提交*/
  okHandle = () => {
    const { form, handleAdd } = this.props
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();

      console.log('Received values of form: ', fieldsValue);
      const { keys, names } = fieldsValue;
      console.log('Merged values:', keys.map(key => names[key]));
      // handleAdd(fieldsValue);
    });
  };

  handleFetch = () => {
    console.log('loading');
    this.setState({ loading: true });
    // fetchData(this.state.data.length).then(newData =>
    //   this.setState(({ data }) => ({
    //     loading: false,
    //     data: data.concat(newData),
    //   })),
    // );
  };

  loadMoreContent = () => (
    <div
      style={{
        textAlign: 'center',
        paddingTop: 40,
        paddingBottom: 40,
        border: '1px solid #e8e8e8',
      }}
    >
      <Spin tip="Loading..." />
    </div>
  );

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      // this.setState({
      //   formValues: values,
      // });
      //
      // dispatch({
      //   type: 'cashCoupons/fetch',
      //   payload: values,
      // });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    // this.setState({
    //   formValues: {},
    // });
    // dispatch({
    //   type: 'cashCoupons/fetch',
    //   payload: {},
    // });
  };

  handleRowSelectChange: TableRowSelection<TableListItem>['onChange'] = (
    selectedRowKeys,
    selectedRows: TableListItem[],
  ) => {
    const currySelectedRowKeys = selectedRowKeys as string[];
    // let { needTotalList } = this.state;
    // needTotalList = needTotalList.map(item => ({
    //   ...item,
    //   total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
    // }));
    // const { onSelectRow } = this.props;
    // if (onSelectRow) {
    //   onSelectRow(selectedRows);
    // }

    this.setState({ selectedRowKeys: currySelectedRowKeys, });

  };

  render() {
    const { AddModalVisible, form, handleAdd, handleModalVisible } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { limitType, joinType, limitEveryStatus, selectedRowKeys } = this.state;

    const data = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
      {
        key: '4',
        name: 'Joe Black1',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
      {
        key: '5',
        name: 'Joe Black1',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
      {
        key: '6',
        name: 'Joe Black1',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
    ];


    const rowSelection: TableRowSelection<TableListItem> = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: (record: TableListItem) => ({
        disabled: record.disabled,
      }),
    };

    return (
      <Modal
        destroyOnClose
        width={700}
        title="添加店铺"
        visible={AddModalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form onSubmit={this.handleSearch}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={24}>
              <FormItem label="项目名称" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: '请选择项目名称！' }],
                })(
                  <Select placeholder="请选择项目名称" style={{ width: '100%' }}>
                    <Select.Option value="0">中铁建186MALL</Select.Option>
                    <Select.Option value="1">逸都汇</Select.Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="楼栋楼层" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请选择楼栋楼层！' }],
                })(
                  <Select placeholder="请选择楼栋楼层" style={{ width: '100%' }}>
                    <Select.Option value="0">中铁建186MALL</Select.Option>
                    <Select.Option value="1">逸都汇</Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={24}>
              <FormItem label="业态筛选" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('status4')(
                  <Select placeholder="请选择限制类型" style={{ width: '100%' }}>
                    <Select.Option value="0">关闭</Select.Option>
                    <Select.Option value="1">运行中</Select.Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="是否选择" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('date')(
                  <Select placeholder="是否选择" style={{ width: '100%' }}>
                    <Select.Option value="0">关闭</Select.Option>
                    <Select.Option value="1">运行中</Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={24}>
              <FormItem label="商铺名称" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('status4')(
                  <Input placeholder='请输入商铺名称' />
                )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ float: 'right', marginBottom: 24 }}>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                    重置
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
        <Row gutter={16}>
          <Col span={24}>
            <Alert message={<>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项
            </>} type="info" style={{marginBottom: 20}} showIcon />
            <Table
              bordered
              rowSelection={rowSelection}
              columns={this.columns}
              dataSource={data}
              pagination={false}
              size="middle"
              scroll={{ y: 240 }}
              footer={() => '实打实大苏打'}
            />
          </Col>
        </Row>
      </Modal>
    )
  }

}

export default Form.create<CreateFormProps>()(CreateCouponsForm);
