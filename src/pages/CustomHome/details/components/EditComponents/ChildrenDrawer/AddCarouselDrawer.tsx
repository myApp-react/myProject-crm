import { Form, Select, Drawer, Button, Upload, Radio, Input, Icon, message } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';

import styles from './AddCarouselDrawer.less'

import { checkImageWH, pictureTypeaAndSize } from '@/utils';
import { uploadUrl, FunctionData, Prefix } from '@/utils/constant';

const beforeUpload = (file: any, fileList: any) => {
  console.log('我被出发了1')
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

const FormItem = Form.Item;
//RollingScreenConfigId: string,
interface CarouselChildProps extends FormComponentProps {
  AddCarouselModalVisible: boolean;
  handleAddCarouselModalVisible: (flag?: boolean) => void
  handleAddImages: (fieldsValue: {
    Id: any,
    OrderNo: number,
    Title: string,
    ImageUrl: string,
    LinkType: number,
    FunctionType: number,
    LinkUrl: string,
    FunctionName: string,
    ShowFunctionName: string
  }) => void;
  Images: Array<any>
}

interface CarouselChildState {
  funType: number;
  uploadLoading: boolean;
  ImageUrl: string;
  ShowFunctionName: string;
}


class CarouselChildForm extends Component<CarouselChildProps, CarouselChildState> {

  state: CarouselChildState = {
    funType: 1,
    ImageUrl: '',
    uploadLoading: false,
    ShowFunctionName: ''
  }

  okHandle = () => {
    const { form, Images, handleAddImages } = this.props;
    const { ImageUrl, ShowFunctionName } = this.state;

    form.validateFields((err, fields) => {
      if (err) return;

      let len = Images.length;
      const { LinkType, Title, FunctionName, LinkUrl } = fields;

      const OrderNo = ++len;
      const fieldsValue = {
        Id: Math.random(),
        OrderNo,
        Title,
        ImageUrl,
        LinkType,
        FunctionType: 1,
        LinkUrl: LinkUrl || '',
        FunctionName: FunctionName || '',
        ShowFunctionName
      }
      handleAddImages(fieldsValue)
    });
  };

  normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e && pictureTypeaAndSize(e.file) ? e.fileList : [];
  };

  handleLinkTypeOnChange = (e: any) => {
    const funType = Number(e.target.value);
    this.setState({ funType })
  }

  handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      this.setState({ uploadLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      const ImageUrl = info.file.response.HttpPath
      this.setState({
        ImageUrl,
        uploadLoading: false,
      })
    }
  };

  /**功能菜单切换*/
  handleChangeFunctionName = (e: any) => {
    const FunctionName = FunctionData.filter(_ => _.value === e)
    if(FunctionName && FunctionName.length !== 0){
      this.setState({
        ShowFunctionName: FunctionName[0].name
      })
    }
  }

  /**面板显隐回调*/
  handleAfter = (visible: boolean) => {
    if(!visible){
      this.setState({ ImageUrl: '' })
    }
  }

  render() {
     const { form, AddCarouselModalVisible, handleAddCarouselModalVisible } = this.props;
     const { funType, ImageUrl, uploadLoading } = this.state;

     const uploadButton = (
        <div>
          <Icon type={uploadLoading ? 'loading' : 'plus'} style={{fontSize: 20, color: '#999'}}/>
          <div className="ant-upload-text">点击上传图片</div>
        </div>
     );

     return (
        <>
          <Drawer
            title='新增滚屏广告'
            width={500}
            destroyOnClose={true}
            onClose={() => handleAddCarouselModalVisible(false)}
            className={styles['drawer-warp']}
            afterVisibleChange={this.handleAfter}
            visible={AddCarouselModalVisible}
            bodyStyle={{ paddingBottom: 80, position: 'relative' }}
          >
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 18 }}
              label="滚屏标题"
            >
              {form.getFieldDecorator('Title', {
                rules: [{ required: true, message: '请输入滚屏标题' }],
                initialValue: ''
              })(
                <Input placeholder="请输入滚屏标题" allowClear/>,
              )}
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 18 }}
              label="链接地址"
            >
              {form.getFieldDecorator('LinkType', {
                rules: [{ required: true, message: '请选择链接地址'}],
                initialValue: 1
              })(
                <Radio.Group buttonStyle="solid" onChange={this.handleLinkTypeOnChange}>
                  <Radio.Button value={1}>无</Radio.Button>
                  <Radio.Button value={2}>系统功能</Radio.Button>
                  <Radio.Button value={3}>自定义链接</Radio.Button>
                </Radio.Group>,
              )}
            </FormItem>
            {
              funType === 2 ? <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="系统功能">
                {form.getFieldDecorator('FunctionName', {
                  rules: [{ required: false, message: '请选择系统功能' }],
                  initialValue: undefined })(
                  <Select placeholder="请选择系统功能" style={{width: 300}} onChange={this.handleChangeFunctionName}>
                    {
                      FunctionData.map((_: any) => (
                        <Select.Option key={_.value} value={_.value}>{_.name}</Select.Option>
                      ))
                    }
                  </Select>,
                )}
              </FormItem> : null
            }
            {
              funType === 3 ? <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="自定义链接">
                {form.getFieldDecorator('LinkUrl', {
                  rules: [{ required: false, message: '请输入自定义链接地址' }],
                  initialValue: '' })(
                  <Input style={{width: 300}} />,
                )}
              </FormItem> : null
            }
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 18 }}
              label="轮播图片"
              extra="请上传750PX * 360PX，且大小在1M以内的图片支持jpg、jpeg、png、gif格式"
            >
              {form.getFieldDecorator('upload', {
                rules: [
                  { required: true, message: '请上传轮播图片!'},
                ],
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
                initialValue: ImageUrl ? [{
                  uid: '-1',
                  name: '上传图片.png',
                  status: 'done',
                  url: `${Prefix + ImageUrl}`,
                }] : [],
              })(
                //const isJPG = file.type === 'image/jpeg';
                //   const isJPEG = file.type === 'image/jpeg';
                //   const isGIF = file.type === 'image/gif';
                //   const isPNG = file.type === 'image/png';
                <Upload
                  accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                  name="base64str"
                  listType="picture-card"
                  showUploadList={false}
                  className={styles['img-uploader']}
                  action={uploadUrl}
                  beforeUpload={beforeUpload}
                  onChange={this.handleChange}
                >
                  { ImageUrl ? <img src={Prefix + ImageUrl} alt="轮播图" style={{ width: '100%' }} /> : uploadButton }
                </Upload>
              )}
            </FormItem>
            <FormItem wrapperCol={{ span: 13, offset: 5 }}>
              <Button type="primary" htmlType="submit" onClick={this.okHandle}>保存</Button>
            </FormItem>
          </Drawer>
        </>
      );
  }
}

export default Form.create<CarouselChildProps>()(CarouselChildForm);
