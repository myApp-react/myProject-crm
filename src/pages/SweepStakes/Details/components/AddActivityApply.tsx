import React, { PureComponent } from 'react';
import { Form, Modal, Row, Col, Input, InputNumber, Card, Descriptions, Button, Empty, Spin, Alert } from 'antd';
import { FormComponentProps } from 'antd/es/form';


import styles from '../style.less'
import { CustomerInfo } from '@/pages/SweepStakes/LotteryConfig/components/LotteryChanceManager';
const FormItem = Form.Item;
const { Search, TextArea } = Input;

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 4,
    },
  },
};

interface AddLotteryChanceManagerProps extends FormComponentProps {
  ActivityId: string;
  visible: boolean;
  modalEditHandle: (flag?: boolean, record?: { [key: string] : boolean }) => void;
  SearchUser: (userInfo: string, callback: (data: CustomerInfo | null) => void) => void;
  saveHandle: (fields: { id?: string, ActivityId: string, CustomerId: string, Note: string }, callback: () => void) => void;
}

interface AddLotteryChanceManagerState {
  userInfo: CustomerInfo;
  infoStatus: boolean;
  searchLoading: boolean;
  IsEffective: number;
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
    IsEffective: 0,

  }

  okHandle = () => {
    const { form, saveHandle, ActivityId, modalEditHandle } = this.props;
    const { userInfo } = this.state;
    const { OpenId, CustomerId } = userInfo;
    if(!OpenId) {
      this.setState({ IsEffective: 2 });
      return
    }
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { Note } = fieldsValue;
      const values = { ActivityId, CustomerId, Note }
      saveHandle(values, () => {
        form.resetFields()
        modalEditHandle(false, { flag: true });
      })
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
            searchLoading: false,
            IsEffective: 1,
          })
          return
        }
        this.setState({
          infoStatus: false,
          searchLoading: false,
          IsEffective: 2
        });
      })
    }
  }

  render() {
    const { visible, form, modalEditHandle } = this.props;
    const { getFieldDecorator } = form;
    const { userInfo, infoStatus, searchLoading, IsEffective } = this.state;
    const { OpenId, CustomerId, PersonName, PersonPhone } = userInfo;
    return <Modal
      width={600}
      visible={visible}
      destroyOnClose
      title='新增报名'
      onCancel={() => modalEditHandle(false, { flag: true })}
      afterClose={() => modalEditHandle()}
      footer={[
        <Button key="back" onClick={() => modalEditHandle(false, { flag: true })}>
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
            <FormItem label="搜索会员信息"  labelCol={{span: 5}} wrapperCol={{span: 16}}>
              {getFieldDecorator('userInfo', {
                rules: [{ required: true, message: '请输入手机号、昵称、OPENID等查询用户！'}],
              })(
                <Search
                  placeholder="请输入手机号、昵称、OPENID"
                  onSearch={this.onSearch}
                  autoComplete='off'
                />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="用户信息"  labelCol={{span: 5}} wrapperCol={{span: 16}}>
              <Card
                style={{ marginTop: 0, marginBottom: 20 }}
                loading={searchLoading}
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
              {
                infoStatus && !CustomerId && <Alert message="提示：该会员ID不存在，请更换新的会员" type="warning" showIcon />
              }
              {
                infoStatus && CustomerId && <Alert message="该会员状态正常" type="success" showIcon />
              }
              {
                IsEffective === 2 && <Alert message="请查询有效状态的会员信息" type="error" showIcon />
              }

            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="备注" labelCol={{span: 5}} wrapperCol={{span: 16}}>
              {getFieldDecorator('Note', {
                rules: [{ required: false, message: '请输入备注！'}],
              })(
                <TextArea rows={4} placeholder='请输入备注'/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  }
}


export default Form.create<AddLotteryChanceManagerProps>()(AddLotteryChanceManager);

