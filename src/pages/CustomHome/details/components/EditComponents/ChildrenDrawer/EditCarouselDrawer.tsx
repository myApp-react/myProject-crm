import { Form, Select, Switch, Drawer, Button, Input, Radio, Upload, Popconfirm, Icon, Tooltip, Row, Col, message } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';

import styles from './EditCarouselDrawer.less'

import { checkImageWH, pictureTypeaAndSize } from '@/utils';
import { ImagesType } from '@/pages/CustomHome/details/data';
import { FunctionData, Prefix, uploadUrl } from '@/utils/constant';

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

interface CarouselChildProps extends FormComponentProps {
  EditCarouselModalVisible: boolean;
  CarouselChildFormValues: ImagesType;
  handleEditImages: (fieldsValue: {
    Id: any,
    RollingScreenConfigId: string,
    OrderNo: number,
    Title: string,
    ImageUrl: string,
    LinkType: number,
    FunctionType: number,
    LinkUrl: string,
    FunctionName: string,
    ShowFunctionName: string
  }) => void;
  handleEditChildrenDrawe: (flag?: boolean, record?: ImagesType) => void
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

  static getDerivedStateFromProps(nextProps: CarouselChildProps, prevState: CarouselChildState){
    if(nextProps.CarouselChildFormValues.ImageUrl !== prevState.ImageUrl || nextProps.CarouselChildFormValues.LinkType !== prevState.funType){
      return {
        ImageUrl: nextProps.CarouselChildFormValues.ImageUrl,
        funType: nextProps.CarouselChildFormValues.LinkType,
        ShowFunctionName: nextProps.CarouselChildFormValues.ShowFunctionName,
      }
    }
    return null
  }

  /**提交*/
  okHandle = () => {
    const { ImageUrl, ShowFunctionName } = this.state;
    const { form, handleEditImages, CarouselChildFormValues, handleEditChildrenDrawe } = this.props
    form.validateFields((err, fields) => {
      if (err) return;
      const { LinkType, Title, FunctionName, LinkUrl } = fields;
      // form.resetFields();
      const fieldsValue = {
        ...CarouselChildFormValues,
        Title,
        ImageUrl,
        LinkType,
        LinkUrl: LinkUrl || '',
        FunctionName: FunctionName || '',
        ShowFunctionName
      }
      handleEditImages(fieldsValue)
      handleEditChildrenDrawe(false, fieldsValue)
    });
  };

  //
  normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e && pictureTypeaAndSize(e.file) ? e.fileList : [];
  };

  /**链接地址切换*/
  handleLinkTypeOnChange = (e: any) => {
    const { handleEditChildrenDrawe, CarouselChildFormValues } = this.props
    const funType = Number(e.target.value);
    const currFormVal = {
      ...CarouselChildFormValues,
      LinkType: funType
    }
    handleEditChildrenDrawe(true, currFormVal)
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



  render() {
    const { form, CarouselChildFormValues, EditCarouselModalVisible, handleEditChildrenDrawe } = this.props;
    const { Title, ImageUrl, LinkType, FunctionName, LinkUrl } = CarouselChildFormValues
    const { funType, uploadLoading } = this.state;
    const uploadButton = (
      <div>
        <Icon type={uploadLoading ? 'loading' : 'plus'} style={{fontSize: 20, color: '#999'}}/>
        <div className="ant-upload-text">点击上传图片</div>
      </div>
    );

    return (
      <>
        <Drawer
          title='修改滚屏广告'
          width={500}
          onClose={() => handleEditChildrenDrawe(false, CarouselChildFormValues)}
          afterVisibleChange={(visible) => !visible && handleEditChildrenDrawe()}
          className={styles['drawer-warp']}
          visible={EditCarouselModalVisible}
          bodyStyle={{ paddingBottom: 80, position: 'relative' }}
        >
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 18 }}
            label="滚屏标题"
          >
            {form.getFieldDecorator('Title', {
              rules: [{ required: true, message: '请输入滚屏标题' }],
              initialValue: Title
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
              initialValue: LinkType
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
                initialValue: FunctionName || undefined })(
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
                initialValue: LinkUrl  })(
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
