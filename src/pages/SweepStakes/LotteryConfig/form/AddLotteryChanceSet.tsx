import React, { PureComponent } from 'react';
import { Form, Modal, Row, Col, Input, InputNumber, Radio, Switch, Button, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';


import styles from './index.less'
import { LuckyTableRadiansProps, SysCardType } from '@/pages/SweepStakes/LotteryConfig/data';
const FormItem = Form.Item;


interface AddLotteryChanceSetProps extends FormComponentProps {
  ActivityId: string;
  visible: boolean;
  CardTypes: SysCardType[]
  modalEditHandle: () => void;
  saveHandle: (fields: LuckyTableRadiansProps) => void;
}

interface AddLotteryChanceSetState {
  shareCountStatus: number;
  joinType: number;
  ChannelType: number;
}

class AddLotteryChanceSet extends PureComponent<AddLotteryChanceSetProps, AddLotteryChanceSetState>{

  state: AddLotteryChanceSetState = {
    shareCountStatus: 1,
    joinType: 1,
    ChannelType: 0,

  }

  joinChange = (val: number) => {
    this.setState({ joinType: val })
  }

  ShareGetTypeChange = (e: React.BaseSyntheticEvent) => {
    const shareCountStatus = e.target.value;
    this.setState({ shareCountStatus })
  }

  okHandle = () => {
    const { form, saveHandle, ActivityId } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // console.log(fieldsValue)
      const { Enabled, ...rest } = fieldsValue;
      const values = {
        ActivityId,
        ...rest,
        Enabled: Enabled ? 1 : 0
      }
      saveHandle(values);
      form.resetFields();
    });
  };

  handleChannelTypeChange = (val: number) => {
    this.setState({ChannelType: val})
  }


  render() {
    const { visible, form, modalEditHandle, CardTypes } = this.props;
    const { getFieldDecorator } = form;
    const { shareCountStatus, joinType, ChannelType } = this.state;
    return <Modal
      width={700}
      visible={visible}
      destroyOnClose
      title='新增抽奖机会'
      onCancel={modalEditHandle}
      className={styles.modal}
      footer={[
        <Button key="back" onClick={modalEditHandle}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={this.okHandle}>
          保存
        </Button>,
      ]}
    >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem label="抽奖机会名称">
              {getFieldDecorator('ChnanceName', {
                rules: [{ required: true, message: '请输入抽奖机会名称！'}],
              })(
                <Input placeholder='请输入抽奖机会名称' />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="获取途径">
              {getFieldDecorator('ChannelType', {
                rules: [{ required: true, message: '请选择获取途径！'}],
              })(
                <Select placeholder="请选择获取途径" onChange={this.handleChannelTypeChange} style={{width: '100%'}}>
                  <Select.Option value={1}>会员权益</Select.Option>
                  <Select.Option value={2}>积分兑换</Select.Option>
                  <Select.Option value={3}>分享赠送</Select.Option>
                  <Select.Option value={4}>推荐注册赠送</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="参与会员类型">
              {getFieldDecorator('CardTypeCategory', {
                rules: [{ required: true, message: '请选择参与会员类型！'}],
              })(
                <Select
                  placeholder="请选择参与会员类型"
                  style={{width: '100%'}}
                  onChange={this.joinChange}
                >
                  <Select.Option value={1}>全部会员</Select.Option>
                  <Select.Option value={2}>指定卡类型</Select.Option>
                  <Select.Option value={3}>非会员</Select.Option>
                  <Select.Option value={4}>全部人员</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          {
            joinType === 2 && (
              <Col span={24}>
                <FormItem label="指定卡类型">
                  {getFieldDecorator('CardTypeIds', {
                    rules: [{ required: true, message: '请选择指定卡类型！'}],
                  })(
                    <Select
                      mode='multiple'
                      placeholder="请选择指定卡类型"
                      style={{width: '100%'}}
                    >
                      {
                        CardTypes.map(_ => (
                          <Select.Option key={_.Id} value={_.Id}>{_.CardTypeName}</Select.Option>
                        ))
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
            )
          }
          <Col span={12}>
            <FormItem label="可获取总次数">
              {getFieldDecorator('TotalCount', {
                rules: [{ required: true, message: '请输入可获取总次数！'}],
              })(
                <InputNumber placeholder='请输入可获取总次数' min={1} style={{width: '100%'}}/>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="每天可获取次数">
              {getFieldDecorator('EverydayCount', {
                rules: [{ required: true, message: '请输入每天可获取次数！'}],
              })(
                <InputNumber placeholder='请输入每天可获取次数' min={1} style={{width: '100%'}}/>,
              )}
            </FormItem>
          </Col>
          {
            ChannelType === 3 && (
              <>
                <Col span={12}>
                  <FormItem label="分享获取统计方式">
                    {getFieldDecorator('SharegetType', {
                      rules: [{ required: false, message: '请输入获取机会所需积分！'}],
                      initialValue: 1
                    })(
                      <Radio.Group
                        onChange={this.ShareGetTypeChange}
                      >
                        <Radio value={1}>分享到朋友圈</Radio>
                        <Radio value={2}>分享被阅读</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Col>
                {
                  shareCountStatus === 2 ? <Col span={12}>
                    <FormItem label="分享被阅读次数">
                      {getFieldDecorator('ShareReadedCount', {
                        rules: [{ required: true, message: '请输入获取机会所需积分！'}],
                      })(
                        <InputNumber placeholder='请输入次数' min={1} style={{width: '100%'}}/>,
                      )}
                    </FormItem>
                  </Col> : null
                }
              </>
            )
          }
          {
            ChannelType === 2 && (
              <Col span={12}>
                <FormItem label="获取机会所需积分">
                  {getFieldDecorator('NeedScores', {
                    rules: [{ required: true, message: '请输入获取机会所需积分！'}],
                  })(
                    <InputNumber placeholder='请输入获取机会所需积分' min={1} style={{width: '100%'}}/>,
                  )}
                </FormItem>
              </Col>
            )
          }
          {
            ChannelType === 4 && (
              <Col span={12}>
                <FormItem label="获取机会所需注册人数">
                  {getFieldDecorator('NeesRegisteCount', {
                    rules: [{ required: true, message: '请输入获取机会所需注册人数！'}],
                  })(
                    <InputNumber placeholder='请输入获取机会所需注册人数' min={1} style={{width: '100%'}}/>,
                  )}
                </FormItem>
              </Col>
            )
          }
          <Col span={12}>
            <FormItem label="启用状态">
              {getFieldDecorator('Enabled', {
                rules: [{ required: true, message: '启用状态！'}],
                valuePropName: 'checked',
                initialValue: true
              })(
                <Switch checkedChildren="开" unCheckedChildren="关" />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>


    </Modal>
  }
}


export default Form.create<AddLotteryChanceSetProps>()(AddLotteryChanceSet);
