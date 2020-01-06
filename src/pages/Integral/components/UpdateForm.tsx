import {
  DatePicker,
  Form,
  Modal,
  Radio,
  Select,
  Row,
  Col,
  Descriptions,
  Button,
  Input,
  InputNumber,
  Empty,
  message,
  Tag,
} from 'antd';
import React, { Component } from 'react';


import { FormComponentProps } from 'antd/es/form';
import { TableListItem } from '../data.d';
import moment from 'moment'
import { Action, Dispatch } from 'redux';
import { Prefix } from '@/utils/constant';
import { connect } from 'dva';
import { debounce } from 'lodash'

import styles from './UpdateForm.less'
import RcViewer from '@hanyk/rc-viewer'
import { appType } from '@/models/app';
import { integralParams } from '@/pages/Integral/data';

export interface FormValueType extends Partial<TableListItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
}

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const options = {
  inline: true,
  minWidth: 360,
  minHeight: 520,
  loop: false,
  slideOnTouch: false,
  toolbar: {
    zoomIn: 3,
    zoomOut: 3,
    oneToOne: 0,
    reset: 0,
    prev: 0,
    play: {
      show: 0,
      size: 'large',
    },
    next: 0,
    rotateLeft: 3,
    rotateRight: 3,
    flipHorizontal: 0,
    flipVertical: 0,
  }
}

interface InfoType {
  Id: string
  ProjectName: string
  VipId: string
  VipName: string
  CardTypeName: string
  RepitImageUrl: string | null
  SourceType: number
}

export interface UpdateFormProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'integralList/getRepitExamineDto'
      | 'integralList/getScoresSupplementContext'
      | 'integralList/RepitExamineHandle'
      >
    >;
  handleUpdateModalVisible: (flag?: boolean, formVals?: FormValueType[]) => void;
  handleUpdate: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Array<TableListItem>;
  app: appType;
  initHandle: () => void;
  loading: any;
}

export interface UpdateFormState {
  currentStep: number;
  ReviewType: number;
  currentInfo: InfoType;
  dealTime: string;
  PlanNames: Array<string>
}

@connect(
  ({
     app,
     loading,
   }: {
    app: appType;
    loading: {
      models: {
        [key: string]: boolean;
      };
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    app,
    loading
  }),
)
class UpdateForm extends Component<UpdateFormProps, UpdateFormState> {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props: UpdateFormProps) {
    super(props);
    this.state = {
      currentStep: 0,
      ReviewType: 1,
      dealTime: moment(),
      currentInfo: {
        Id: '',
        ProjectName: '',
        VipId: '',
        VipName: '',
        CardTypeName: '',
        RepitImageUrl: null,
        SourceType: 0,
      },
      PlanNames: []
    };
  }


  handleChangeReview = (e: React.BaseSyntheticEvent) => {
    const ReviewType = e.target.value;
    this.setState({
      ReviewType
    })
  }

  componentDidMount() {
    const { values } = this.props
    this.getDetails(values[0].Id);
  }

  getDetails = (itemId: string) => {
    const { dispatch } = this.props
    dispatch({
      type: "integralList/getRepitExamineDto",
      payload: {
        itemId
      },
      callback: (currentInfo: InfoType) => {
        this.setState({
          currentInfo
        })
      }
    })
  }


  /**交易时间切换*/
  handleChangeDate = (date: moment, dateString: string) => {
    if(dateString){
      const { form } = this.props;
      const { currentInfo } = this.state;
      const { VipId } = currentInfo;
      const FieldsVal = form.getFieldsValue(['StoreId', 'ReciptAmt']);
      const { StoreId, ReciptAmt } = FieldsVal;
      if(StoreId && ReciptAmt){
        this.handleFetchRes(VipId, StoreId, dateString, ReciptAmt)
      }
    }
  }

  /**ajax*/
  handleFetchRes = (CustomerId: string, StoreId: string, SaleTime: string, Amt: number | string) => {
    const { form, dispatch } = this.props;
    dispatch({
      type: 'integralList/getScoresSupplementContext',
      payload: {
        CustomerId,
        StoreId,
        SaleTime,
        Amt
      },
      callback: (res:integralParams) => {
        if(res){
          const { Rate, PlanNames, Scores } = res;
          form.setFieldsValue({
            ShopPointsRate: `${Rate.Scores} / ${Rate.Money}`,
            currPoint: `${Scores}分`,
          })
          this.setState({ PlanNames })
        }
      }
    })
  }

  getfinallyRes = debounce((value: number | string) => {
    const { form } = this.props;
    const { currentInfo } = this.state;
    const { VipId } = currentInfo;
    const FieldsVal = form.getFieldsValue(['StoreId', 'SaleTime']);
    const { StoreId, SaleTime } = FieldsVal;
    if(StoreId && SaleTime){
      this.handleFetchRes(VipId, StoreId, moment(SaleTime).format(dateFormat), value)
    }
  }, 1000)

  /**小票金额切换*/
  handleReciptAmtChange = (value: number | string) => {
    if(value){
      this.getfinallyRes(value);
    }
  }

  /**店铺切换*/
  handleChangeStore = (value: string) => {
    if(value){
      const { currentInfo } = this.state;
      const { VipId } = currentInfo;
      const { form } = this.props;
      const FieldsVal = form.getFieldsValue(['SaleTime', 'ReciptAmt']);
      const { SaleTime, ReciptAmt } = FieldsVal;
      if(SaleTime && ReciptAmt){
        this.handleFetchRes(VipId, value, moment(SaleTime).format(dateFormat), ReciptAmt)
      }
    }
  }




  /**提交*/
  okHandle = () => {
    const { form, dispatch, handleUpdateModalVisible, values, initHandle } = this.props;
    form.validateFields((err, fields) => {
      if (err) return;
      const { currentInfo } = this.state;
      const { Id, VipId } = currentInfo;
      const { AduitStatus, ReciptCode, ReciptAmt, SaleTime, StoreId, ProductCount, Note } = fields;

      if(AduitStatus === 0 ) {
        dispatch({
          type: 'integralList/RepitExamineHandle',
          payload: {
            Id,
            Note
          },
          callback: (data: any) => {
            message.success('操作成功！');
            handleUpdateModalVisible(false, values)
            initHandle()
          }
        })
      }
      if(AduitStatus === 1 ) {
        dispatch({
          type: 'integralList/RepitExamineHandle',
          payload: {
            Id,
            CustomerId: VipId,
            AduitStatus,
            StoreId,
            SaleTime: moment(SaleTime).format(dateFormat),
            ReciptCode,
            ProductCount,
            ReciptAmt,
            Note
          },
          callback: (data: any) => {
            message.success('操作成功！');
            handleUpdateModalVisible(false, values)
            initHandle()
          }
        })
      }
    });
  };


  handleBatchSubmit = () => {
    const { form, dispatch, handleUpdateModalVisible, values, initHandle } = this.props;
    form.validateFields((err, fields) => {
      if (err) return;
      const { currentInfo } = this.state;
      const { Id, VipId } = currentInfo;
      const { AduitStatus, ReciptCode, ReciptAmt, SaleTime, StoreId, ProductCount, Note } = fields;

      if(AduitStatus === 0 ) {
        dispatch({
          type: 'integralList/RepitExamineHandle',
          payload: { Id, Note },
          callback: (data: any) => {
            message.success('操作成功！');
            this.setState((pre) => ({
              currentStep: pre.currentStep + 1
            }), () => {
                if(this.state.currentStep < this.props.values.length){
                  form.resetFields();
                  this.setState({ ReviewType: 1 })
                  this.getDetails(this.props.values[this.state.currentStep].Id)
                }else {
                  handleUpdateModalVisible(false, values);
                  initHandle();
                }
            })
          }
        })
      }
      if(AduitStatus === 1 ) {
        dispatch({
          type: 'integralList/RepitExamineHandle',
          payload: {
            Id,
            CustomerId: VipId,
            AduitStatus,
            StoreId,
            SaleTime: moment(SaleTime).format(dateFormat),
            ReciptCode,
            ProductCount,
            ReciptAmt,
            Note
          },
          callback: (data: any) => {
            message.success('操作成功！');
            this.setState((pre) => ({
              currentStep: pre.currentStep + 1
            }), () => {
              if(this.state.currentStep < this.props.values.length){
                form.resetFields();
                this.setState({ ReviewType: 1 })
                this.getDetails(this.props.values[this.state.currentStep].Id)
              }else {
                handleUpdateModalVisible(false, values);
                initHandle();
              }
            })
          }
        })
      }
    });
  }


  render() {
    const { updateModalVisible, handleUpdateModalVisible, values, form, app, loading } = this.props;
    const { ReviewType, currentInfo, dealTime, PlanNames } = this.state;
    const { storeData } = app;
    const { RepitImageUrl, ProjectName, CardTypeName, VipName } = currentInfo
    const formLen = values.length;
    const imgSrc = RepitImageUrl ? `${Prefix + RepitImageUrl}` : "";

    return (
      <Modal
        width={970}
        destroyOnClose
        className={styles.review}
        title="审核"
        style={{ top: 40 }}
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
        bodyStyle={{
          padding: '22px 40px 2px'
        }}
        footer={
          formLen === 1 ?
            [
              <Button
                key="back"
                onClick={() => handleUpdateModalVisible(false, values)}
              >
                取消
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={this.okHandle}
                loading={loading.effects['integralList/RepitExamineHandle']}
              >
                {
                  loading.effects['integralList/RepitExamineHandle'] ? '保存中' : '保存'
                }
              </Button>,
            ] :
            [
              <Button key="back" onClick={() => handleUpdateModalVisible(false, values)}>
                取消
              </Button>,
              <Button key="submit" type="primary" onClick={this.handleBatchSubmit}>
                保存并继续审核
              </Button>,
            ]
        }
      >

        <Form>
          <Row gutter={[16, 8]}>
            <Col span={10} >
              <div className={styles.Viewer}>
                {
                  imgSrc ? <RcViewer options={options}>
                    <img src={imgSrc} alt="小票" style={{display: 'none'}}/>
                  </RcViewer> : <Empty description={"暂无图片"} />
                }
              </div>
            </Col>
            <Col span={14} style={{paddingLeft: 60}}>
              <Descriptions title="" bordered column={2} size='small'>
                <Descriptions.Item label="项目名称" span={2}>{ProjectName}</Descriptions.Item>
                <Descriptions.Item label="会员类型" span={1}>{CardTypeName}</Descriptions.Item>
                <Descriptions.Item label="会员信息" span={1}>{VipName}</Descriptions.Item>
              </Descriptions>
              <FormItem label='审核状态' labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} style={{marginTop: 20}}>
                {
                  form.getFieldDecorator('AduitStatus', {
                    rules: [{ required: true, message: '请输入至少五个字符的规则描述！' }],
                    initialValue: 1
                  })(
                    <Radio.Group onChange={this.handleChangeReview}>
                      <Radio value={1}>通过</Radio>
                      <Radio value={0}>驳回</Radio>
                    </Radio.Group>
                  )
                }
              </FormItem>
              {
                ReviewType === 1 ?  <>
                  <FormItem label='交易时间' labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} style={{marginTop: 20}}>
                    {
                      form.getFieldDecorator('SaleTime', {
                        rules: [{ required: true, message: '请选择交易时间！' }],
                        initialValue: dealTime
                      })(
                        <DatePicker
                          format={dateFormat}
                          style={{ width: '100%' }}
                          onChange={this.handleChangeDate}
                        />
                      )
                    }
                  </FormItem>
                  <FormItem label='小票编号'  labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                    {
                      form.getFieldDecorator('ReciptCode', {
                        rules: [{ required: true, message: '请输入小票编号！'}],
                      })(
                        <Input
                          style={{ width: "100%" }}
                          placeholder="请输入小票编号"
                        />
                      )
                    }
                  </FormItem>
                  <FormItem label='小票金额'  labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                    {
                      form.getFieldDecorator('ReciptAmt', {
                        rules: [{ required: true, message: '请输入小票金额！',}],
                      })(
                        <InputNumber
                          style={{ width: '90%' }}
                          min={0}
                          placeholder="请输入小票金额"
                          precision={2}
                          onChange={this.handleReciptAmtChange}
                        />
                      )
                    }
                    <span className='ant-form-text'>元</span>
                  </FormItem>
                  <FormItem label='商品数量' labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                    {
                      form.getFieldDecorator('ProductCount', {
                        rules: [{ required: true, message: '请输入商品数量！',}],
                      })(
                        <InputNumber
                          style={{ width: 136 }}
                          placeholder="商品数量"
                        />
                      )
                    }
                  </FormItem>
                  <FormItem label='商铺名称' labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                    {
                      form.getFieldDecorator('StoreId', {
                        rules: [{ required: true, message: '请选择商铺！',}],
                      })(
                        <Select
                          showSearch
                          style={{ width: '100%' }}
                          placeholder='请选择商铺'
                          onChange={this.handleChangeStore}
                          optionLabelProp="label"
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {
                            storeData.map(_ => (
                              <Option
                                key={_.Id}
                                value={_.Id}
                                label={_.Name}
                              >{_.Name}</Option>
                            ))
                          }
                        </Select>
                      )
                    }
                  </FormItem>
                  <FormItem style={{ marginBottom: 0 }}>
                    <FormItem
                      label='商铺积分率'
                      labelCol={{ span: 9 }}
                      wrapperCol={{ span: 15 }}
                      style={{ display: 'inline-block', width: 'calc(60% - 12px)' }}
                    >
                      {
                        form.getFieldDecorator('ShopPointsRate')(
                          <Input
                            disabled
                            style={{ width: 130, color: '#333' }}
                          />
                        )
                      }
                    </FormItem>
                    <FormItem
                      label='本次积分'
                      labelCol={{ span: 9 }}
                      wrapperCol={{ span: 15 }}
                      style={{ display: 'inline-block', width: 'calc(40% - 12px)' }}
                    >
                      {
                        form.getFieldDecorator('currPoint')(
                          <Input
                            disabled
                            style={{ width: 130, color: '#333' }}
                          />
                        )
                      }
                    </FormItem>
                  </FormItem>
                  <FormItem label='备注' labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                    {
                      form.getFieldDecorator('Note', {
                        rules: [{ required: false, message: '请输入备注！',}],
                      })(
                        <TextArea
                          style={{ width: '100%' }}
                          placeholder="请输入备注"
                        />
                      )
                    }
                  </FormItem>
                  <FormItem
                    label='积分促销规则'
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 19 }}
                  >
                    {
                      PlanNames.map(_ => (
                        <Tag color="volcano" key={_}>{_}</Tag>
                      ))
                    }
                    {
                      PlanNames.length === 0 && '无'
                    }
                  </FormItem>
                </> : (
                  <FormItem label='备注' labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                    {
                      form.getFieldDecorator('Note', {
                        rules: [{ required: true, message: '请输入备注！',}],
                      })(
                        <TextArea
                          style={{ width: '100%' }}
                          rows={4}
                          placeholder="请输入备注"
                        />
                      )
                    }
                  </FormItem>
                )
              }
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<UpdateFormProps>()(UpdateForm);
