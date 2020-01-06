import { Form, Select, Drawer, Button, Upload, Radio, Input, Icon, message } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';

import styles from './AddGridDrawer.less'

import { checkImageWH, pictureTypeaAndSize } from '@/utils';
import { uploadUrl, FunctionData, Prefix } from '@/utils/constant';
import { ButtonsType } from '@/pages/CustomHome/details/data';
import { TableListItem } from '@/pages/CustomHome/data';

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

const FormItem = Form.Item;
//RollingScreenConfigId: string,
interface GridChildProps extends FormComponentProps {
  EditGridModalVisible: boolean;
  handleEditGridModalVisible: (flag?: boolean, record?: ButtonsType) => void
  handleEditButtons: (fieldsValue: ButtonsType) => void;
  EditGridChildFormValues: Partial<ButtonsType>
}

interface GridChildState {
  funType: number;
  uploadLoading: boolean;
  ImageUrl: string;
  ShowFunctionName: string;
}


class CarouselChildForm extends Component<GridChildProps, GridChildState> {

  state: GridChildState = {
    funType: 1,
    ImageUrl: '',
    uploadLoading: false,
    ShowFunctionName: ''
  }

  static getDerivedStateFromProps(nextProps: GridChildProps, prevState: GridChildState){
    if(nextProps.EditGridChildFormValues.ImageUrl !== prevState.ImageUrl || nextProps.EditGridChildFormValues.LinkType !== prevState.funType){
      return {
        ImageUrl: nextProps.EditGridChildFormValues.ImageUrl,
        funType: nextProps.EditGridChildFormValues.LinkType,
        ShowFunctionName: nextProps.EditGridChildFormValues.ShowFunctionName,
      }
    }
    return null
  }

  /**提交*/
  okHandle = () => {
    const { form, handleEditButtons, EditGridChildFormValues, handleEditGridModalVisible } = this.props;
    const { ImageUrl, ShowFunctionName } = this.state;

    form.validateFields((err, fields) => {
      if (err) return;

      const { LinkType, Name, FunctionName, LinkUrl } = fields;
      const fieldsValue = {
        ...EditGridChildFormValues,
        Name,
        ImageUrl,
        LinkType,
        LinkUrl: LinkUrl || '',
        FunctionName: FunctionName || '',
        ShowFunctionName,
      }

      handleEditButtons(fieldsValue)
      handleEditGridModalVisible(false, fieldsValue)
    });
  };

  normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e && pictureTypeaAndSize(e.file) ? e.fileList : [];
  };

  handleLinkTypeOnChange = (e: any) => {
    // const funType = Number(e.target.value);
    // this.setState({ funType })

    const { handleEditGridModalVisible, EditGridChildFormValues } = this.props
    const funType = Number(e.target.value);
    const currFormVal = {
      ...EditGridChildFormValues,
      LinkType: funType
    }
    handleEditGridModalVisible(true, currFormVal)
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
     const { form, EditGridModalVisible, EditGridChildFormValues, handleEditGridModalVisible } = this.props;
     const { funType, ImageUrl, uploadLoading } = this.state;
     const { Name, LinkType, FunctionName, LinkUrl,  } = EditGridChildFormValues

     const uploadButton = (
        <div>
          <Icon type={uploadLoading ? 'loading' : 'plus'} style={{fontSize: 20, color: '#999'}}/>
          <div className="ant-upload-text">点击上传图片</div>
        </div>
     );

     return (
        <>
          <Drawer
            title='新增功能菜单'
            width={500}
            destroyOnClose={true}
            onClose={() => handleEditGridModalVisible(false, EditGridChildFormValues)}
            className={styles['drawer-warp']}
            afterVisibleChange={(visible) => !visible && handleEditGridModalVisible()}
            visible={EditGridModalVisible}
            bodyStyle={{ paddingBottom: 80, position: 'relative' }}
          >
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 18 }}
              label="按钮名称"
            >
              {form.getFieldDecorator('Name', {
                rules: [{ required: true, message: '请输入按钮名称' }],
                initialValue: Name
              })(
                <Input placeholder="请输入按钮名称" allowClear />,
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
                  initialValue: LinkUrl })(
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
                  accept="image/gif,image/jpeg,image/jpg,image/png"
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
