import {
  Form,
  Select,
  Drawer,
  Button,
  Radio,
  Upload,
  message,
  Icon,
  Input,
} from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import { Action, Dispatch } from 'redux';
import { CompactPicker } from 'react-color'

import styles from './index.less'
import { ActivityType, TitleType } from '@/pages/CustomHome/details/data';

import { TitleBar } from '@/pages/CustomHome/details/components'
import { checkImageWH, handleRefresh, pictureTypeaAndSize } from '@/utils';
import { uploadUrl, colorPicker, FunctionData } from '@/utils/constant';

const FormItem = Form.Item;
const prefix = process.env.Prefix;

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


interface EditTitleProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'customHomeDetails/updateTitle'
      | 'customHomeDetails/saveTitleBarConfig'
      >
    >;
  location: any;
  TitleModalVisible: boolean;
  values: Partial<TitleType>;
  titleDetails: TitleType | undefined;
  handleEditTitle: (flag?: boolean, record?: TitleType) => void
}

interface EditTitleState {
  templateImageUrl: string;
  templateLoading: boolean;
  LeftImageUrl: string;
  LeftLoading: boolean;
  RightImageUrl: string;
  RightLoading: boolean;
}

class EditTitleForm extends Component<EditTitleProps, EditTitleState> {
  state: EditTitleState = {
    templateImageUrl: '',
    templateLoading: false,
    LeftImageUrl: '',
    LeftLoading: false,
    RightImageUrl: '',
    RightLoading: false,
  }

  componentDidMount() {
    const { dispatch, values } = this.props;
    dispatch({ type: 'customHomeDetails/updateTitle', payload: values });
  }

  normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && pictureTypeaAndSize(e.file) ? e.fileList : [];
  };

  /**提交表单*/
  okHandle = () => {
    const { form, dispatch, titleDetails, handleEditTitle, location } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      const configJson = JSON.stringify(titleDetails);
      dispatch({
        type: 'customHomeDetails/saveTitleBarConfig',
        payload: {
          configJson
        },
        callback: () => {
          message.success('标题栏设置成功');
          handleEditTitle(false, titleDetails);
          handleRefresh({}, location);
        }
      })
    });
  };

  /**模板背景图片*/
  handleUploadTemplateChange = (info: any) => {
    if (info.file.status === 'uploading') {
      this.setState({ templateLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      const templateImageUrl = info.file.response.HttpPath
      this.setState({
        templateImageUrl,
        templateLoading: false,
      })
    }
  };


  /**左侧图片上传*/
  handleleftImageChange = (info: any) => {
    if (info.file.status === 'uploading') {
      this.setState({ LeftLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      const LeftImageUrl = info.file.response.HttpPath
      this.setState({
        LeftImageUrl,
        LeftLoading: false,
      })
    }
  };

  /**右侧图片上传*/
  handleRightImageChange = (info: any) => {
    if (info.file.status === 'uploading') {
      this.setState({ RightLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      const RightImageUrl = info.file.response.HttpPath
      this.setState({
        RightImageUrl,
        RightLoading: false,
      })
    }
  };

  /**上边距操作*/
  handleMarginTopChange = (value: number) => {
    const { dispatch, titleDetails } = this.props;
    dispatch({
      type: 'customHomeDetails/updateTitle',
      payload: { ...titleDetails, Fromabove: value }
    })
  }

  /**背景颜色选择*/
  handleColorChange = (e: { hex: string }) => {
    const BackColor = e.hex;
    const { dispatch, titleDetails } = this.props;
    dispatch({
      type: 'customHomeDetails/updateTitle',
      payload: { ...titleDetails, BackColor }
    })
  }

  /**渲染上传按钮*/
  uploadButton = (loading: boolean, name: string) => {
    return (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} style={{fontSize: 20, color: '#999'}}/>
        <div className="ant-upload-text">{name}</div>
      </div>
    )
  };

  /**模板背景类型切换*/
  HandleBgChange = (e: any) => {
    const Istemplate = e.target.value;
    const { dispatch, titleDetails } = this.props;
    dispatch({
      type: 'customHomeDetails/updateTitle',
      payload: { ...titleDetails, Istemplate }
    })
  }

  /**标题文字*/
  handleTitleChange = (e: any) => {
    const HeadLine = e.target.value;
    const { dispatch, titleDetails } = this.props;
    dispatch({
      type: 'customHomeDetails/updateTitle',
      payload: { ...titleDetails, HeadLine }
    })
  }

  /**标题文字大小*/
  handleTitleFontsizeChange = (value: number) => {
    const { dispatch, titleDetails } = this.props;
    dispatch({
      type: 'customHomeDetails/updateTitle',
      payload: { ...titleDetails, HeadLineSize: value }
    })
  }

  /**标题文字颜色选择*/
  handleTitleColorChange = (e: { hex: string }) => {
    const HeadLineColor = e.hex;
    const { dispatch, titleDetails } = this.props;
    dispatch({
      type: 'customHomeDetails/updateTitle',
      payload: { ...titleDetails, HeadLineColor }
    })
  }

  /**右侧文字*/
  handleRightWordChange = (e: any) => {
    const RightWord = e.target.value;
    const { dispatch, titleDetails } = this.props;
    dispatch({
      type: 'customHomeDetails/updateTitle',
      payload: { ...titleDetails, RightWord }
    })
  }


  /**右侧文字大小*/
  handleRightWordFontsizeChange = (value: number) => {
    const { dispatch, titleDetails } = this.props;
    dispatch({
      type: 'customHomeDetails/updateTitle',
      payload: { ...titleDetails, RightWordSize: value }
    })
  }

  /**右侧文字颜色选择*/
  handleRightWordColorChange = (e: { hex: string }) => {
    const RightWordColor = e.hex;
    const { dispatch, titleDetails } = this.props;
    dispatch({
      type: 'customHomeDetails/updateTitle',
      payload: { ...titleDetails, RightWordColor }
    })
  }

  /**打开链接切换*/
  HandleOpenTypeChange = (e: any) => {
    const OpenUrl = e.target.value;
    const { dispatch, titleDetails } = this.props;
    dispatch({
      type: 'customHomeDetails/updateTitle',
      payload: { ...titleDetails, OpenUrl }
    })
  }


  render() {
    const { form, handleEditTitle, TitleModalVisible, titleDetails } = this.props;
    const  {
      Fromabove,
      Istemplate,
      BackColor,
      BackImage,
      HeadLine,
      HeadLineColor,
      HeadLineSize,
      RightImage,
      RightWordSize,
      LeftImage,
      RightWord,
      RightWordColor,
      FuncLink,
      OpenUrl,
      FuncName,
      CustomLink,
    } = titleDetails;
    const { templateImageUrl, templateLoading, LeftLoading, RightLoading } = this.state;
    const TitleBarProps = {
      Fromabove,
      Istemplate,
      BackColor,
      BackImage,
      LeftImage,
      HeadLine,
      HeadLineSize,
      HeadLineColor,
      RightWord,
      RightWordSize,
      RightWordColor,
      RightImage,
      FuncLink
    }

    return (
      <>
        <Drawer
          title="标题栏设置"
          width={620}
          onClose={() => handleEditTitle(false, titleDetails)}
          afterVisibleChange={(visible) => !visible && handleEditTitle()}
          className={styles['drawer-warp']}
          visible={TitleModalVisible}
          bodyStyle={{ paddingBottom: 80, position: 'relative' }}
        >
          <div className={styles['demo-drawer']}>
            <TitleBar {...TitleBarProps}/>
          </div>
          <div className={styles['divider-horizontal']} />
          <Form layout='vertical'>
            <FormItem label='上边距'>
              {form.getFieldDecorator('Fromabove', {
                rules: [{ required: true, message: '请选择上边距' }],
                initialValue: Fromabove
              })(
                <Select placeholder="请选择上边距" style={{width: '100%'}}  onChange={this.handleMarginTopChange}>
                  <Select.Option value={0}>0px</Select.Option>
                  <Select.Option value={6}>6px</Select.Option>
                  <Select.Option value={12}>12px</Select.Option>
                  <Select.Option value={15}>15px</Select.Option>
                  <Select.Option value={20}>20px</Select.Option>
                </Select>
              )}
            </FormItem>
            <div className={styles['divider-horizontal']} />
            <FormItem label='模板背景类型'>
              {form.getFieldDecorator('Istemplate', {
                rules: [{ required: true, message: '请选择模板背景类型' }],
                initialValue: Istemplate
              })(
                <Radio.Group buttonStyle="solid" onChange={this.HandleBgChange}>
                  <Radio.Button value={1}>颜色</Radio.Button>
                  <Radio.Button value={2}>图片</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            {
              Istemplate === 2 ? <FormItem
                label='模板背景图片'
                extra="请上传750PX * 30PX，且大小在1M以内的图片支持jpg、jpeg、png、gif格式，建议使用可拉伸底图"
              >
                {form.getFieldDecorator('BackImage', {
                  rules: [{ required: true, message: '请选择模板背景类型' }],
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                  initialValue: templateImageUrl ? [{
                    uid: '-1',
                    name: 'xxx.png',
                    status: 'done',
                    url: `${prefix + templateImageUrl}`,
                  }] : []
                })(
                  <Upload
                    accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                    name="base64str"
                    listType="picture-card"
                    showUploadList={false}
                    className={styles['img-uploader']}
                    action={uploadUrl}
                    beforeUpload={beforeUpload}
                    onChange={this.handleUploadTemplateChange}
                  >
                    { templateImageUrl ?
                      <img src={prefix + templateImageUrl} alt="模板背景" style={{ width: '100%' }} /> :
                      this.uploadButton(templateLoading, '模板背景图片') }
                  </Upload>
                )}
              </FormItem> : <FormItem label='背景颜色'>
                {form.getFieldDecorator('BackColor', {
                  rules: [{ required: true, message: '请选择模板背景颜色' }],
                  initialValue: BackColor
                })(
                  <CompactPicker
                    color={BackColor}
                    colors={colorPicker}
                    className={styles['color-picker']}
                    onChange={this.handleColorChange}
                  />
                )}
              </FormItem>
            }
            <div className={styles['divider-horizontal']} />
            <FormItem label='左侧图标' extra='请上传48PX * 48PX，且大小在1M以内的图片支持jpg、jpeg、png、gif格式，建议使用可拉伸底图'>
              {form.getFieldDecorator('LeftImage', {
                rules: [{ required: false, message: '左侧图标' }],
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
                initialValue: LeftImage ? [{
                  uid: '-1',
                  name: 'xxx.png',
                  status: 'done',
                  url: `${prefix + LeftImage}`,
                }] : []
              })(
                <Upload
                  accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                  name="base64str"
                  listType="picture-card"
                  showUploadList={false}
                  action={uploadUrl}
                  beforeUpload={beforeUpload}
                  onChange={this.handleleftImageChange}
                >
                  { LeftImage ?
                    <img src={prefix + LeftImage} alt="左侧图标" style={{ width: '100%' }} /> :
                    this.uploadButton(LeftLoading, '左侧图标') }
                </Upload>
              )}
            </FormItem>
            <div className={styles['divider-horizontal']} />
            <FormItem label='标题文字' extra='请上传48PX * 48PX，且大小在1M以内的图片支持jpg、jpeg、png、gif格式，建议使用可拉伸底图'>
              {form.getFieldDecorator('HeadLine', {
                rules: [{ required: true, message: '请输入标题' }],
                initialValue: HeadLine
              })(
                <Input placeholder="标题" maxLength={6} onChange={this.handleTitleChange}/>
              )}
            </FormItem>
            <FormItem label="标题文字大小">
              {form.getFieldDecorator('HeadLineSize', {
                rules: [{ required: true, message: '请选择标题文字大小' }],
                initialValue: HeadLineSize
              })(
                <Select placeholder="请选择标题文字大小" onChange={this.handleTitleFontsizeChange}>
                  <Select.Option value={12}>12px</Select.Option>
                  <Select.Option value={14}>14px</Select.Option>
                  <Select.Option value={16}>16px</Select.Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="标题文字颜色">
              {form.getFieldDecorator('HeadLineColor', {
                rules: [{ required: true, message: '请选择标题文字颜色' }],
                initialValue: HeadLineColor
              })(
                <CompactPicker
                  color={HeadLineColor}
                  colors={colorPicker}
                  className={styles['color-picker']}
                  onChange={this.handleTitleColorChange}
                />
              )}
            </FormItem>
            <div className={styles['divider-horizontal']} />
            <FormItem label="右侧文字">
              {form.getFieldDecorator('RightWord', {
                rules: [{ required: true, message: '请输入右侧文字' }],
                initialValue: RightWord
              })(
                <Input placeholder="右侧文字" onChange={this.handleRightWordChange}/>
              )}
            </FormItem>
            <FormItem label="右侧文字大小">
              {form.getFieldDecorator('RightWordSize', {
                rules: [{ required: true, message: '请选择右侧文字大小' }],
                initialValue: RightWordSize
              })(
                <Select placeholder="请选择右侧文字大小" onChange={this.handleRightWordFontsizeChange}>
                  <Select.Option value={12}>12px</Select.Option>
                  <Select.Option value={14}>14px</Select.Option>
                  <Select.Option value={16}>16px</Select.Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="右侧文字颜色">
              {form.getFieldDecorator('RightWordColor', {
                rules: [{ required: true, message: '右侧文字颜色' }],
                initialValue: RightWordColor
              })(
                <CompactPicker
                  color={RightWordColor}
                  colors={colorPicker}
                  className={styles['color-picker']}
                  onChange={this.handleRightWordColorChange}
                />
              )}
            </FormItem>
            <FormItem label='右侧图标' extra='请上传48PX * 48PX，且大小在1M以内的图片支持jpg、jpeg、png、gif格式，建议使用可拉伸底图'>
              {form.getFieldDecorator('RightImage', {
                rules: [{ required: false, message: '右侧图标' }],
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
                initialValue: RightImage ? [{
                  uid: '-1',
                  name: 'xxx.png',
                  status: 'done',
                  url: `${prefix + RightImage}`,
                }] : []
              })(
                <Upload
                  accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                  name="base64str"
                  listType="picture-card"
                  showUploadList={false}
                  action={uploadUrl}
                  beforeUpload={beforeUpload}
                  onChange={this.handleRightImageChange}
                >
                  { RightImage ?
                    <img src={prefix + RightImage} alt="模板背景" style={{ width: '100%' }} /> :
                    this.uploadButton(RightLoading, '右侧图标') }
                </Upload>
              )}
            </FormItem>
            <div className={styles['divider-horizontal']} />
            <FormItem label="打开链接">
              {form.getFieldDecorator('OpenUrl', {
                rules: [{ required: false }],
                initialValue: OpenUrl
              })(
                <Radio.Group buttonStyle="solid" onChange={this.HandleOpenTypeChange}>
                  <Radio.Button value={0}>无</Radio.Button>
                  <Radio.Button value={1}>系统功能</Radio.Button>
                  <Radio.Button value={2}>自定义链接</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            {
              OpenUrl === 1 ? <FormItem label="系统功能">
                {form.getFieldDecorator('FuncName', {
                  rules: [{ required: true, message: '请选择系统功能' }],
                  initialValue: FuncName || undefined })(
                  <Select placeholder="请选择系统功能" >
                    {
                      FunctionData.map(_ => (
                        <Select.Option key={_.value} value={_.value}>{_.name}</Select.Option>
                      ))
                    }
                  </Select>,
                )}
              </FormItem> : null
            }
            {
              OpenUrl === 2 ? <FormItem label="自定义连接">
                {form.getFieldDecorator('CustomLink', {
                  rules: [{ required: true, message: '请输入自定义链接地址' }],
                  initialValue: CustomLink })(
                  <Input placeholder='请输入自定义链接地址'/>,
                )}
              </FormItem> : null
            }
          </Form>
          <div className={styles['submit-warp']}>
            <Button style={{marginRight: 12}} icon='close-circle' onClick={() => handleEditTitle(false, titleDetails)}>
              取消
            </Button>
            <Button type="primary" icon='check-circle' onClick={this.okHandle}>提交</Button>
          </div>
        </Drawer>
      </>
    );
  }
}

export default Form.create<EditTitleProps>()(EditTitleForm);


