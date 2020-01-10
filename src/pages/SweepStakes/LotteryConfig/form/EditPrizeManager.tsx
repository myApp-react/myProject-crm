import React, { PureComponent } from 'react';
import { Form, Modal, Row, Col, Input, InputNumber, Tooltip, Button, Select, Upload, Icon, message, Divider  } from 'antd';
import { FormComponentProps } from 'antd/es/form';


import styles from './index.less'
import { checkImageWH, getBase64, pictureTypeaAndSize } from '@/utils';
import { CouponItem, LuckydrawItem, SaveLuckydrawItem } from '@/pages/SweepStakes/LotteryConfig/data';
const FormItem = Form.Item;

const beforeUpload = (file: any, fileList: any) => {
  const isJPG = file.type === 'image/jpeg';
  const isJPEG = file.type === 'image/jpeg';
  const isGIF = file.type === 'image/gif';
  const isPNG = file.type === 'image/png';
  if (!(isJPG || isJPEG || isGIF || isPNG)) {
    message.error('只能上传JPG 、JPEG 、GIF、 PNG格式的图片!');
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 1;
  if (!isLt2M) {
    message.error('图片大小必须小于1MB!');
    return false
  }//
  return (isJPG || isJPEG || isGIF || isPNG) && isLt2M && checkImageWH(file, 750);
}

interface EditPrizeManagerProps extends FormComponentProps {
  visible: boolean;
  AcitivityId: string;
  uploadLoading: boolean;
  values: LuckydrawItem;
  modalEditHandle: (flag?: boolean, record?: LuckydrawItem) => void;
  savePrizeAllHandle: (fields: SaveLuckydrawItem, callback: () => void ) => void;
  CouponItem: CouponItem[];
  uploadImagesHandle: (dataStr: string, callback: (data: string) => void) => void;

}

interface EditPrizeManagerState {
  ImageUrl: string;
  prizeType: number;
  DrawimgurlSeed: string;
}

class EditPrizeManager extends PureComponent<EditPrizeManagerProps, EditPrizeManagerState>{

  state: EditPrizeManagerState = {
    ImageUrl: '',
    prizeType: 1,
    DrawimgurlSeed: ''
  }

  static getDerivedStateFromProps(nextProps: EditPrizeManagerProps, prevState: EditPrizeManagerState) {
    if(nextProps.values.DrawType !== prevState.prizeType || nextProps.values.DrawImageUrl !== prevState.ImageUrl){
      return {
        prizeType: nextProps.values.DrawType,
        ImageUrl: nextProps.values.DrawImageUrl,
      }
    }
    return null
  }

  okHandle = () => {
    const { form, savePrizeAllHandle, AcitivityId, values, modalEditHandle } = this.props;
    const { DrawimgurlSeed } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { CouponNo, prizeImage, ...rest } = fieldsValue
      const { LuckyDrawId, DrawCategoryType } = values;
      const currValues = {
        Id: LuckyDrawId,
        AcitivityId,
        ...rest,
        DrawimgurlSeed,
        DrawCategoryType
      }
      // console.log('编辑普通奖品信息', currValues);
      savePrizeAllHandle(currValues, () => {
        message.success('编辑成功！');
        form.resetFields();
        modalEditHandle(false, values)
      })
    });
  };

  normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e && pictureTypeaAndSize(e.file) ? e.fileList : [];
  };

  prizeUploadImgChange = (info: any) => {
    const _self = this;
    const { uploadImagesHandle, modalEditHandle, values } = this.props;
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
      const currVal = {
        ...values,
        DrawImageUrl: imageUrl
      }
      if(uploadImagesHandle){
        uploadImagesHandle(imageUrl, (data) => {
          modalEditHandle(true, currVal);
          _self.setState({
            // ImageUrl: imageUrl,
            DrawimgurlSeed: data
          })
        })
      }
    });
  };

  //设置编码
  handleSelectCoupon = (val: string, e: any) => {
    const { form } = this.props;
    form.setFieldsValue({ CouponNo: e.props['data-id'] })
  }

  prizeChange = (e: number) => {
    this.setState({ prizeType: e })
  }


  render() {
    const { visible, form, modalEditHandle, CouponItem, uploadLoading, values } = this.props;
    const { getFieldDecorator } = form;
    const { ImageUrl, prizeType } = this.state;
    const { DrawCategoryType } = values;
    // console.log('values', values)
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
      title='编辑奖品'
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
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem label="奖品类型">
              {getFieldDecorator('DrawType', {
                rules: [{ required: true, message: '请选择奖品类型！'}],
                initialValue: values.DrawType
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
                initialValue: values.DrawName
              })(
                <Input placeholder='请输入奖品名称'/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="代金券">
              {getFieldDecorator('CouponId', {
                rules: [{ required: true, message: '请选择代金券！'}],
                initialValue: values.CouponId
              })(
                <Select
                  placeholder="请选择代金券"
                  style={{width: '100%'}}
                  onChange={this.handleSelectCoupon}
                >
                  {
                    CouponItem.map(_ => (
                      <Select.Option key={_.CouponId} data-id={_.CouponCode} value={_.CouponId}>{_.CouponName}</Select.Option>
                    ))
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="代金券编码">
              {getFieldDecorator('CouponNo', {
                initialValue: values.CouponCode
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
                    initialValue: values.SendCouponCount
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
                    initialValue: values.Scores
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
                initialValue: values.Drawlevel
              })(
                <Input placeholder='请输入奖品等级' style={{width: '100%'}}/>,
              )}
            </FormItem>
          </Col>
          {
            DrawCategoryType === 2 ? (
              <Col span={12}>
                <FormItem label="奖品总数">
                  {getFieldDecorator('DrawNum', {
                    rules: [{ required: true, message: '请输入奖品总数！'}],
                    initialValue: values.DrawNum
                  })(
                    <InputNumber placeholder='请输入奖品总数' min={1} style={{width: '100%'}}/>,
                  )}
                </FormItem>
              </Col>
            ) : (
              <Col span={12}>
                <FormItem label="奖品总数">
                  <InputNumber placeholder='请输入奖品总数' disabled value={values.DrawNum} min={1} style={{width: '100%'}}/>
                </FormItem>
              </Col>
            )
          }


          <Col span={12}>
            <FormItem label="排序编号">
              {getFieldDecorator('Orderno', {
                rules: [{ required: true, message: '请输入排序编号！'}],
                initialValue: values.OrderNo
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
                  initialValue: values.TotalLimitCount
                })(
                  <InputNumber placeholder='请输入数量' min={1} style={{width: '100%'}}/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="每人每天最多获得" extra='输入0表示不限制'>
                {getFieldDecorator('EverydayLimitNum', {
                  rules: [{ required: true, message: '请输入数量！'}],
                  initialValue: values.EveryDayLimitCount
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
                initialValue: values.LuckyRate
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


export default Form.create<EditPrizeManagerProps>()(EditPrizeManager);
