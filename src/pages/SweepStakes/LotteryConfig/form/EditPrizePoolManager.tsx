import React, { PureComponent } from 'react';
import { Form, Modal, Row, Col, Button, DatePicker, Divider, Tag } from 'antd';
import { FormComponentProps } from 'antd/es/form';

import styles from './index.less'
import { PrizePoolColumns } from '@/pages/SweepStakes/LotteryConfig/components/PrizePool';
const FormItem = Form.Item;
const DateFormat = 'YYYY-MM-DD HH:mm:ss';

interface EditPrizePoolManagerProps extends FormComponentProps {
  visible: boolean;
  values: PrizePoolColumns[];
  modalEditHandle: (flag?: boolean, record?: PrizePoolColumns[]) => void;
  saveHandle: (fields: { ReleaseTime: string }, callback: () => void) => void;
}

interface EditPrizePoolManagerState {
  ImageUrl: string;
  prizeType: number;
  DrawimgurlSeed: string;
}

class EditPrizePoolManager extends PureComponent<EditPrizePoolManagerProps, EditPrizePoolManagerState>{

  state: EditPrizePoolManagerState = {
    ImageUrl: '',
    prizeType: 1,
    DrawimgurlSeed: ''
  }

  okHandle = () => {
    const { form, saveHandle, modalEditHandle, values } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      saveHandle(fieldsValue, () => {
        form.resetFields();
        modalEditHandle(false, values)
      })
    });
  };

  render() {
    const { visible, form, modalEditHandle, values } = this.props;
    const { getFieldDecorator } = form;
    const selectLen = values.length;
    return <Modal
      width={700}
      visible={visible}
      destroyOnClose
      title='编辑奖池施放时间'
      onCancel={() => modalEditHandle(false, values)}
      className={styles.modal}
      afterClose={() => modalEditHandle()}
      footer={[
        <Button key="back" onClick={() => modalEditHandle(false, values)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={this.okHandle}>
          保存
        </Button>,
      ]}
    >
      <Form>
        <Row gutter={16}>
          <Col span={24}>
            <FormItem
              label="选中奖品"
              labelCol={{ span: 6 }}
              wrapperCol={{span: 18}}
              extra={<span>共选择 <b style={{color: '#f50'}}>{selectLen}</b> 项</span>}
            >
              <span className="ant-form-text">
                {
                  values.map(_ => (
                    <Tag color="#2db7f5" key={_.Id}>{_.DrawName}</Tag>
                  ))
                }
              </span>
            </FormItem>
          </Col>
          <Divider dashed />
          <Col span={24}>
            <FormItem label="释放时间" labelCol={{ span: 6 }}  wrapperCol={{span: 18,}}>
              {getFieldDecorator('ReleaseTime', {
                rules: [{ required: true, message: '请选择释放时间！'}],
              })(
                <DatePicker
                  format={DateFormat}
                  style={{width: '80%'}}
                  placeholder='请选择释放时间'
                />,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  }
}


export default Form.create<EditPrizePoolManagerProps>()(EditPrizePoolManager);
