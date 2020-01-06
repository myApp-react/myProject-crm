import React, { PureComponent } from 'react';
import { Form, Modal, Row, Col, InputNumber, Switch, Button, Select, Radio } from 'antd';
import { FormComponentProps } from 'antd/es/form';

import { saveLuckyTableRadians, SimpleLuckyDraw } from '@/pages/SweepStakes/LotteryConfig/data';

import styles from './index.less'
const FormItem = Form.Item;


interface EditPrizeRangeManagerProps extends FormComponentProps {
  visible: boolean;
  modalEditHandle: () => void;
  prizeType: SimpleLuckyDraw[];
  values: saveLuckyTableRadians;
  saveHandle: (fields: {StartRadian: number, EndRadian: number, IsLuckyRadian: number, Enabled: number}) => void;
}

class EditPrizeRangeManager extends PureComponent<EditPrizeRangeManagerProps, {}>{

  okHandle = () => {
    const { form, saveHandle } = this.props;
    form.validateFields((err, fields) => {
      if (err) return;
      // form.resetFields();
      const { Enabled, ...rest } = fields;
      const newEnabled = Enabled ? 1 : 0
      // console.log({Enabled: newEnabled, ...rest})
      saveHandle({Enabled: newEnabled, ...rest})
    });
  };

  render() {
    const { visible, form, modalEditHandle, prizeType, values } = this.props;
    const { getFieldDecorator } = form;
    const { StartRadian, EndRadian, IsLuckyRadian, Enabled, DrawId } = values;
    return <Modal
      width={400}
      visible={visible}
      destroyOnClose
      title='编辑奖品弧度设置'
      onCancel={() => modalEditHandle(false, values)}
      afterClose={() => modalEditHandle()}
      className={styles.modal}
      bodyStyle={{
        paddingBottom: 0
      }}
      footer={[
        <Button key="back" onClick={() => modalEditHandle(false, values)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={this.okHandle}>
          保存
        </Button>,
      ]}
    >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <FormItem label="奖品种类">
              {getFieldDecorator('LuckyDrawId', {
                rules: [{ required: true, message: '请选择奖品种类！'}],
                initialValue: DrawId
              })(
                <Select placeholder="请选择奖品种类" style={{width: '100%'}}>
                  {
                    prizeType.map(_ => (
                      <Select.Option key={_.LuckyDrawId} value={_.LuckyDrawId}>{_.LuckyName}</Select.Option>
                    ))
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="开始弧度">
              {getFieldDecorator('StartRadian', {
                rules: [{ required: true, message: '请输入开始弧度！'}],
                initialValue: StartRadian
              })(
                <InputNumber placeholder='请输入开始弧度' min={1} style={{width: '100%'}}/>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="结束弧度">
              {getFieldDecorator('EndRadian', {
                rules: [{ required: true, message: '请输入结束弧度！'}],
                initialValue: EndRadian
              })(
                <InputNumber placeholder='请输入结束弧度' min={1} style={{width: '100%'}}/>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="是否奖品弧度">
              {getFieldDecorator('IsLuckyRadian', {
                rules: [{ required: true, message: '请输入结束弧度！'}],
                initialValue: IsLuckyRadian || 1
              })(
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="有效状态">
              {getFieldDecorator('Enabled', {
                rules: [{ required: false, message: '请输入获取机会所需注册人数！'}],
                valuePropName: 'checked',
                initialValue: Enabled === 1
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


export default Form.create<EditPrizeRangeManagerProps>()(EditPrizeRangeManager);
