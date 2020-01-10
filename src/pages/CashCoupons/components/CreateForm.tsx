import { Form, Input, Modal, Row, Col, Select, Button, Icon, InputNumber, Card, Radio, Table, Alert, Tooltip, DatePicker } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { PureComponent } from 'react';

import AddStoreForm from './AddStoreForm'
import styles from './CreateForm.less'

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
  modalVisible: boolean;
  handleAdd: (fieldsValue: { desc: string }) => void;
  handleModalVisible: () => void;
}

interface CreateFormState {
  limitType: number;
  joinType: number;
  limitEveryStatus: boolean;
  AddModalVisible: boolean;
}

class CreateCouponsForm extends PureComponent<CreateFormProps, CreateFormState>{

  private  id: number = 0;
  private  singleId: number = 0;

  state: CreateFormState = {
    limitType: 1,
    joinType: 1,
    limitEveryStatus: false,
    AddModalVisible: false,
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
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
        <a>删除</a>
      </span>
      ),
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

  /**删除*/
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(this.id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleAddEvery = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('singleKeys');

    const nextKeys = keys.concat(this.singleId++);
    // can use data-binding to set
    // important! notify form to detect changes
    console.log('keys', nextKeys)
    if(nextKeys.length === 1){
      this.setState({
        limitEveryStatus: true
      })
    }
    form.setFieldsValue({
      singleKeys: nextKeys,
    });
  }

  /**删除*/
  handleRemove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('singleKeys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      singleKeys: keys.filter(key => key !== k),
    });
  };


  /**限制类型切换*/
  handleLimitChange = (e: React.BaseSyntheticEvent) => {
    this.singleId = 0;
    this.id = 0;
    const limitType = e.target.value;
    this.setState({
      limitType,
      limitEveryStatus: false
    })
  }

  /**参与商铺切换*/
  handleJoinChange = (e: React.BaseSyntheticEvent) => {
    const joinType = e.target.value;
    this.setState({
      joinType
    })
  }

  /**渲染满减*/
  renderSingleLimitHtml = () => {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');

    return keys.map((k: any, index: number) => (
      <>
        <div key={k}>
          <Col span={20}  >
            <Col span={12}>
              <FormItem
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                label="消费满"
                required={false}
              >
                {getFieldDecorator(`limit-a[${k}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: "请输入消费金额",
                    },
                  ],
                })(
                  <InputNumber
                    min={0}
                    placeholder="金额"
                    precision={2}
                    style={{ width: '100%', marginRight: 8 }}
                  />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                required={false}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="可用券金额"
              >
                {getFieldDecorator(`limit-b[${k}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: "请输入券金额",
                    },
                  ],
                })(
                  <InputNumber
                    min={0}
                    placeholder="金额"
                    precision={2}
                    style={{ width: '100%', marginRight: 8 }}
                  />)}
              </FormItem>
            </Col>
          </Col>
          <Col span={4}>
            {keys.length > 1 ? (
              <Tooltip title='点击删除' placement='right'>
                <Icon
                  className={styles['dynamic-delete-button']}
                  type="minus-circle-o"
                  onClick={() => this.remove(k)}
                />
              </Tooltip>

            ) : null}
          </Col>
        </div>
      </>
    ))
  }

  /**渲染每满减*/
  renderEveryLimitHtml = () => {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    getFieldDecorator('singleKeys', { initialValue: [] });
    const keys = getFieldValue('singleKeys');

    return keys.map((k: any, index: number) => (
      <>
        <Col span={20}>
          <Col span={12}>
            <FormItem
              {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="每消费满"
              required={false}
              key={k}
            >
              {getFieldDecorator(`single-limit-a[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "请输入消费金额",
                  },
                ],
              })(
                <InputNumber
                  min={0}
                  placeholder="金额"
                  precision={2}
                  style={{ width: '100%', marginRight: 8 }}
                />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
              required={false}
              key={k+1}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="可用券金额"
            >
              {getFieldDecorator(`single-limit-b[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "请输入券金额",
                  },
                ],
              })(
                <InputNumber
                  min={0}
                  placeholder="金额"
                  precision={2}
                  style={{ width: '100%', marginRight: 8 }}
                />)}
            </FormItem>
          </Col>
        </Col>
        <Col span={4}>
          {keys.length > 1 ? (
            <Tooltip title='点击删除' placement='right'>
              <Icon
                className={styles['dynamic-delete-button']}
                type="minus-circle-o"
                onClick={() => this.handleRemove(k)}
              />
            </Tooltip>

          ) : null}
        </Col>
      </>
    ))
  }

  HandleAddStore = () => {
    this.setState((pre) => ({
      AddModalVisible: !pre.AddModalVisible,
    }))
  }

  componentWillUnmount() {
    this.singleId = 0;
    this.id = 0;
  }

  render() {
    const { modalVisible, form, handleAdd, handleModalVisible } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { limitType, joinType, limitEveryStatus, AddModalVisible } = this.state;

    // getFieldDecorator('keys', { initialValue: [] });
    // const keys = getFieldValue('keys');
    //
    // const formItems = keys.map((k: any, index: number) => (
    //   <>
    //     <Col span={20}>
    //       <Col span={12}>
    //         <FormItem
    //           {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
    //           labelCol={{ span: 6 }}
    //           wrapperCol={{ span: 18 }}
    //           label="消费满"
    //           required={false}
    //           key={k}
    //         >
    //           {getFieldDecorator(`limit-a[${k}]`, {
    //             validateTrigger: ['onChange', 'onBlur'],
    //             rules: [
    //               {
    //                 required: true,
    //                 whitespace: true,
    //                 message: "请输入消费金额",
    //               },
    //             ],
    //           })(
    //             <InputNumber
    //               min={0}
    //               placeholder="金额"
    //               precision={2}
    //               style={{ width: '100%', marginRight: 8 }}
    //             />)}
    //         </FormItem>
    //       </Col>
    //       <Col span={12}>
    //         <FormItem
    //           {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
    //           required={false}
    //           key={k+1}
    //           labelCol={{ span: 8 }}
    //           wrapperCol={{ span: 16 }}
    //           label="可用券金额"
    //         >
    //           {getFieldDecorator(`limit-b[${k}]`, {
    //             validateTrigger: ['onChange', 'onBlur'],
    //             rules: [
    //               {
    //                 required: true,
    //                 whitespace: true,
    //                 message: "请输入券金额",
    //               },
    //             ],
    //           })(
    //             <InputNumber
    //               min={0}
    //               placeholder="金额"
    //               precision={2}
    //               style={{ width: '100%', marginRight: 8 }}
    //             />)}
    //         </FormItem>
    //       </Col>
    //     </Col>
    //     <Col span={4}>
    //       {keys.length > 1 ? (
    //         <Tooltip title='点击删除' placement='right'>
    //           <Icon
    //             className={styles['dynamic-delete-button']}
    //             type="minus-circle-o"
    //             onClick={() => this.remove(k)}
    //           />
    //         </Tooltip>
    //
    //       ) : null}
    //     </Col>
    //   </>
    // ));

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

    return (
      <Modal
        destroyOnClose
        width={880}
        title="新建现金券复用活动"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Row gutter={16}>
          <Col span={12}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="项目名称">
              {getFieldDecorator('project_name', {
                rules: [{ required: true, message: '请选择项目名称！' }],
              })(
                <Select style={{ width: '100%' }} placeholder='请选择项目名称'>
                  <Select.Option value="1">砸金蛋活动</Select.Option>
                  <Select.Option value="2">转盘抽奖活动</Select.Option>
                  <Select.Option value="3">普通活动</Select.Option>
                  <Select.Option value="4">报名活动</Select.Option>
                  <Select.Option value="5">刮刮乐活动</Select.Option>
                  <Select.Option value="6">开宝箱活动</Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="编号">
              {getFieldDecorator('num', {
                rules: [{ required: true, message: '请输入至少五个字符的规则描述！', }],
              })(<InputNumber placeholder="请输入编号" min={0} style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="规则名称">
              {getFieldDecorator('rule_name', {
                rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
              })(<Input placeholder="请输入规则名称" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="限制类型">
              {getFieldDecorator('limit_type', {
                rules: [{ required: true, message: '请输入至少五个字符的规则描述！', }],
                initialValue: 1
              })(
                <Radio.Group onChange={this.handleLimitChange}>
                  <Radio value={1}>满限</Radio>
                  <Radio value={2}>每满限</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="起止时间">
              {getFieldDecorator('range_Date', {
                rules: [{ required: true, message: '请输入至少五个字符的规则描述！', }],
              })(
                <RangePicker showTime format={dateFormat} style={{ width: '100%' }}/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="最多可用数">
              {getFieldDecorator('abledcount', {
                rules: [{ required: true, message: '请输入至少五个字符的规则描述！', }],
              })(<InputNumber placeholder="请输入最多可用数" min={0} style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <Card type="inner" title="使用限制" className={styles['limit-card']}>
              {
                limitType === 1
                  ? <>
                    {this.renderSingleLimitHtml()}
                    <Col span={24}>
                      <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
                        <Icon type="plus" /> 添加满限条件
                      </Button>
                    </Col>
                  </>
                  : <>
                    {this.renderEveryLimitHtml()}
                    {
                      !limitEveryStatus && (
                        <Col span={24}>
                          <Button type="dashed" onClick={this.handleAddEvery} style={{ width: '100%' }}>
                            <Icon type="plus" /> 添加每满限条件
                          </Button>
                        </Col>
                      )
                    }
                  </>
              }
            </Card>
          </Col>
          <Col span={12}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="参与商铺">
              {getFieldDecorator('STORE_TYPE', {
                rules: [{ required: true, message: '请输入至少五个字符的规则描述！',}],
                initialValue: 1
              })(
                <Radio.Group onChange={this.handleJoinChange}>
                  <Radio value={1}>全场参与</Radio>
                  <Radio value={2}>指定商铺参与</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Col>

          <>
            <Col span={12}>
              <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} style={{textAlign: "right"}}>
                <Button type="primary" style={{marginRight: 12}} onClick={this.HandleAddStore}>
                  <Icon type="plus" /> 添加商铺
                </Button>
                <Button type="danger">
                  <Icon type="close" /> 清空
                </Button>
              </FormItem>
            </Col>
            <Col span={24}>
              <Table
                title={() => <Alert message={<>
                  <Icon type="tags" theme="filled" style={{color: '#ff4d4f'}} /> 设置参与商铺&nbsp;&nbsp;共 <a style={{ fontWeight: 600 }}>200</a> 个商铺
                </>} type="info" />}
                columns={this.columns}
                dataSource={data}
                size="small"
                scroll={{ y: 240 }}
              />
            </Col>
          </>
        </Row>
        <AddStoreForm
          AddModalVisible={AddModalVisible}
          handleModalVisible={this.HandleAddStore}
        />
      </Modal>
    )
  }

}

export default Form.create<CreateFormProps>()(CreateCouponsForm);
