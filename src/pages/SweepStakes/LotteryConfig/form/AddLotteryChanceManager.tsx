import React, { PureComponent } from 'react';
import { Form, Modal, Row, Col, Input, InputNumber, Card, Descriptions, Button, Empty, Spin, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';


import styles from './index.less'
import { CustomerInfo } from '@/pages/SweepStakes/LotteryConfig/components/LotteryChanceManager';
const FormItem = Form.Item;
const { Search } = Input;
const { Meta } = Card;

interface AddLotteryChanceManagerProps extends FormComponentProps {
  visible: boolean;
  modalEditHandle: () => void;
  SearchUser: (userInfo: string, callback: (data: CustomerInfo | null) => void) => void;
  saveHandle: (fields: { openId: string, count: number }, callback: () => void) => void;
}

interface AddLotteryChanceManagerState {
  userInfo: CustomerInfo;
  infoStatus: boolean;
  searchLoading: boolean;
}

class AddLotteryChanceManager extends PureComponent<AddLotteryChanceManagerProps, AddLotteryChanceManagerState>{

  state: AddLotteryChanceManagerState = {
    userInfo: {
      PersonName: '',
      OpenId: '',
      PersonPhone: '',
      CustomerId: ''
    },
    infoStatus: false,
    searchLoading: false,
  }

  okHandle = () => {
    const { form, saveHandle, modalEditHandle } = this.props;
    const { userInfo } = this.state;
    const { OpenId } = userInfo;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { count } = fieldsValue;
      const values = { count, openId: OpenId };
      saveHandle(values, () => {
        modalEditHandle();
        form.resetFields();
      });
    });
  };

  onSearch = (val: string) => {
    const { SearchUser } = this.props;
    this.setState({searchLoading: true})
    if(SearchUser) {
      SearchUser(val, (data) => {
        if(data) {
          this.setState({
            infoStatus: true,
            userInfo: data,
            searchLoading: false
          })
          return
        }
        this.setState({ infoStatus: false, searchLoading: false });
      })
    }
  }

  render() {
    const { visible, form, modalEditHandle } = this.props;
    const { getFieldDecorator } = form;
    const { userInfo, infoStatus, searchLoading } = this.state;
    const { OpenId, CustomerId, PersonName, PersonPhone } = userInfo;
    return <Modal
      width={400}
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
      <Form>
        <Row gutter={16}>
          <Col span={24}>
            <FormItem>
              {getFieldDecorator('userInfo', {
                rules: [{ required: true, message: '请输入手机号、昵称、OPENID等查询用户！'}],
              })(
                <Search
                  placeholder="请输入手机号、昵称、OPENID"
                  onSearch={this.onSearch}
                />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <Card
              style={{ marginTop: 0, marginBottom: 20 }}
              loading={searchLoading}
              title={'用户信息'}
              type="inner"
              size='small'
            >
              {
                infoStatus ? <Descriptions bordered={false} size='small'>
                  <Descriptions.Item label="顾客名称" span={3}>{PersonName}</Descriptions.Item>
                  <Descriptions.Item label="手机号码" span={3}>{PersonPhone || '无'}</Descriptions.Item>
                  <Descriptions.Item label="OPENID" span={3}>{OpenId}</Descriptions.Item>
                  <Descriptions.Item label="会员ID" span={3} className={styles.userInfoItem}>{CustomerId || '无'}</Descriptions.Item>
                </Descriptions> : <Empty />
              }
            </Card>
          </Col>
          <Col span={24}>
            <FormItem label="赠送抽奖次数" labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {getFieldDecorator('count', {
                rules: [{ required: true, message: '请输入赠送抽奖次数！'}],
                initialValue: 1
              })(
                <InputNumber placeholder='请输入获赠送抽奖次数' min={1} style={{width: '100%'}}/>,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  }
}


export default Form.create<AddLotteryChanceManagerProps>()(AddLotteryChanceManager);
