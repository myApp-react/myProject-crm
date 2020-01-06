import React, { PureComponent } from 'react';
import { Form, Modal, Row, Col, Input, InputNumber, Button, Select, Upload, Icon, message, Divider  } from 'antd';
import { FormComponentProps } from 'antd/es/form';


import styles from './index.less'
import { getBase64, pictureTypeaAndSize } from '@/utils';
import { CouponItem, SaveLuckydrawItem } from '@/pages/SweepStakes/LotteryConfig/data';
const FormItem = Form.Item;


interface AddPrizeManagerProps extends FormComponentProps {
  visible: boolean;
  AcitivityId: string;
  uploadLoading: boolean;
  modalEditHandle: () => void;
  savePrizeAllHandle: (fields: SaveLuckydrawItem) => void;
  CouponItem: CouponItem[];
  uploadImagesHandle: (dataStr: string, callback: (data: string) => void) => void;
}

interface AddPrizeManagerState {
  ImageUrl: string;
  prizeType: number;
  DrawimgurlSeed: string;
}

class AddPrizeManager extends PureComponent<AddPrizeManagerProps, AddPrizeManagerState>{

  state: AddPrizeManagerState = {
    ImageUrl: '',
    prizeType: 1,
    DrawimgurlSeed: ''
  }

  okHandle = () => {
    const { form, savePrizeAllHandle, AcitivityId } = this.props;
    const { DrawimgurlSeed } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      console.log(fieldsValue)
      const { CouponNo, prizeImage, ...rest } = fieldsValue
      const values = {
        AcitivityId,
        ...rest,
        DrawimgurlSeed,
        DrawCategoryType: 2
      }
      console.log('values', values)
      savePrizeAllHandle(values)
    });
  };

  normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e && pictureTypeaAndSize(e.file) ? e.fileList : [];
  };

  prizeUploadImgChange = (info: any) => {
    const _self = this;
    const { uploadImagesHandle } = this.props;
    const isJpgOrPng = info.file.type === 'image/jpeg' || info.file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片!');
      return
    }
    const isLt2M = info.file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error('请选择小于1M的图片');
      return
    }
    getBase64(info.file, (imageUrl: any) => {
      if(uploadImagesHandle){
        uploadImagesHandle(imageUrl, (data) => {
          _self.setState({
            ImageUrl: imageUrl,
            DrawimgurlSeed: data
          })
        })
      }
    });
  };

  //设置编码
  handleSelectCoupon = (val: string) => {
    const { form } = this.props;
    form.setFieldsValue({ CouponNo: val })
  }

  prizeChange = (e: number) => {
    this.setState({ prizeType: e })
  }


  render() {
    const { visible, form, modalEditHandle, CouponItem, uploadLoading } = this.props;
    const { getFieldDecorator } = form;
    const { ImageUrl, prizeType } = this.state;
    const uploadButton = (
      <div>
        <Icon type={uploadLoading ? 'loading' : 'plus'} style={{fontSize: 20, color: '#999'}}/>
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    return <Modal
      width={700}
      visible={visible}
      destroyOnClose
      title='新增奖品'
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
            <FormItem label="奖品类型">
              {getFieldDecorator('DrawType', {
                rules: [{ required: true, message: '请选择奖品类型！'}],
                initialValue: prizeType
              })(
                <Select
                  placeholder="请选择奖品类型"
                  style={{width: '100%'}}
                  onChange={this.prizeChange}
                >
                  <Select.Option value={1}>代金券</Select.Option>
                  <Select.Option value={2}>积分</Select.Option>
                  <Select.Option value={3}>再试一次</Select.Option>
                  <Select.Option value={4}>定额红包</Select.Option>
                  <Select.Option value={5}>随机红包</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="奖品名称">
              {getFieldDecorator('DrawName', {
                rules: [{ required: true, message: '请输入20个字符以内的奖品名称！', max: 20}],
              })(
                <Input placeholder='请输入奖品名称'/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="代金券">
              {getFieldDecorator('CouponId', {
                rules: [{ required: true, message: '请选择代金券！'}],
              })(
                <Select
                  placeholder="请选择代金券"
                  style={{width: '100%'}}
                  onChange={this.handleSelectCoupon}
                >
                  {
                    CouponItem.map(_ => (
                      <Select.Option key={_.CouponId} value={_.CouponId}>{_.CouponName}</Select.Option>
                    ))
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="代金券编码">
              {getFieldDecorator('CouponNo', {
                initialValue: ''
              })(
                <Input style={{width: '100%', color: '#333'}} disabled/>,
              )}
            </FormItem>
          </Col>
          {
            prizeType === 1 && (
              <Col span={12}>
                <FormItem label="代金券赠送数量">
                  {getFieldDecorator('CouponSendNum', {
                    rules: [{ required: true, message: '请输入代金券赠送数量！'}],
                  })(
                    <InputNumber placeholder='请输入代金券赠送数量' min={1} style={{width: '100%'}}/>,
                  )}
                </FormItem>
              </Col>
            )
          }
          {
            prizeType === 2 && (
              <Col span={12}>
                <FormItem label="积分赠送数量">
                  {getFieldDecorator('PointSendvalue', {
                    rules: [{ required: true, message: '请输入积分赠送数量！'}],
                  })(
                    <InputNumber placeholder='请输入积分赠送数量' min={1} style={{width: '100%'}}/>,
                  )}
                </FormItem>
              </Col>
            )
          }
          <Col span={12}>
            <FormItem label="奖品等级">
              {getFieldDecorator('DrawLevel', {
                rules: [{ required: true, message: '请输入10个字符以内的奖品等级！', max: 10}],
              })(
                <Input placeholder='请输入奖品等级' style={{width: '100%'}}/>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="奖品总数">
              {getFieldDecorator('DrawNum', {
                rules: [{ required: true, message: '请输入奖品总数！'}],
              })(
                <InputNumber placeholder='请输入奖品总数' min={1} style={{width: '100%'}}/>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="排序编号">
              {getFieldDecorator('Orderno', {
                rules: [{ required: true, message: '请输入排序编号！'}],
              })(
                <InputNumber placeholder='请输入排序编号' min={1} style={{width: '100%'}}/>,
              )}
            </FormItem>
          </Col>
          <Divider orientation="left">中奖限制</Divider>
          <Col span={24}>
            <Col span={12}>
              <FormItem label="每人整个活动期间最多获得" extra='输入0表示不限制'>
                {getFieldDecorator('EveryActivityLimitNum', {
                  rules: [{ required: true, message: '请输入数量！'}],
                })(
                  <InputNumber placeholder='请输入数量' min={1} style={{width: '100%'}}/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="每人每天最多获得" extra='输入0表示不限制'>
                {getFieldDecorator('EverydayLimitNum', {
                  rules: [{ required: true, message: '请输入数量！'}],
                })(
                  <InputNumber placeholder='请输入数量' min={1} style={{width: '100%'}}/>
                )}
              </FormItem>
            </Col>
          </Col>
          <Col span={12}>
            <FormItem label="设置中奖概率" extra='请输入0-10000的值'>
              {getFieldDecorator('LuckyRate', {
                rules: [{ required: true, message: '请输入中奖概率！'}],
              })(
                <InputNumber
                  placeholder='请输入中奖概率'
                  min={0}
                  max={10000}
                  style={{width: 160}}
                />
              )}
              <span className="ant-form-text">/10000</span>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="奖品图片" extra='照片文件要求是jpg、jpeg、png格式，尺寸500*280像素，或相近等比例照片'>
              {getFieldDecorator('prizeImage', {
                rules: [{ required: true, message: '请上传奖品图片！'}],
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
                initialValue: ImageUrl ? [{
                  uid: '-1',
                  name: '奖品图片.png',
                  status: 'done',
                  url: `${ImageUrl}`,
                }] : [],
              })(
                <Upload
                  accept="image/gif,image/jpeg,image/jpg,image/png"
                  listType="picture-card"
                  showUploadList={false}
                  className={styles['img-uploader']}
                  customRequest={this.prizeUploadImgChange}
                >
                  { ImageUrl ? <img src={ImageUrl} alt="轮播图" style={{ width: '100%' }} /> : uploadButton }
                </Upload>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  }
}


export default Form.create<AddPrizeManagerProps>()(AddPrizeManager);
