import {
  Form,
  Input,
  Modal,
  Row,
  Col,
  Radio,
  Select,
  InputNumber,
  Tooltip,
  Icon,
  DatePicker,
  Upload,
  message,
  Button,
} from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { PureComponent } from 'react';
import moment from 'moment';
import DragM from "dragm";
import ReactUEditorComponent from 'react-ueditor-component';

import styles from './index.less'
import { pictureTypeaAndSize, getBase64 } from '@/utils';
import { ViewDrawer } from '@/components';

import { DraggableModal, DraggableModalProvider } from 'ant-design-draggable-modal'
import 'ant-design-draggable-modal/dist/index.css'
import { ProjectParams } from '@/models/data';
import { AddTableParams, TableListItem } from '@/pages/SweepStakes/data';

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const DateFormat = 'YYYY-MM-DD HH:mm:ss';

interface DragTitleProps {
  title: string,
}

interface DragTitleState {
  editorContent: string
}

class DragTitle extends PureComponent<DragTitleProps, DragTitleState>{
  private modalDom = null;

  state: DragTitleState = {
    editorContent: '',
  }

  componentDidMount() {
    this.modalDom = document.getElementsByClassName(
      "ant-modal-content" //modal的class是ant-modal-wrap
    )[0];
  }

  updateTransform = (transformStr: any) => {
    this.modalDom.style.transform = transformStr;
  };

  render() {
    const { title } = this.props;
    return (
      <DragM updateTransform={this.updateTransform}>
        <div>{title}</div>
      </DragM>
    )
  }
}

interface EditFormProps extends FormComponentProps {
  updateModalVisible: boolean;
  handleUpdate: (fields: AddTableParams) => void;
  handleUpdateModalVisible: (flag?: boolean, record?: TableListItem) => void;
  handleUploadImages: (dataStr: string, callback: (data: any) => void) => void;
  projectData: ProjectParams[];
  values: TableListItem;
}

interface EditFormState {
  activityCoverImageGuid: string;
  activityCoverloading: boolean;
  activityCoverImageUrl: string;
  wechatShareImageGuid: string;
  wechatShareloading: boolean;
  wechatShareImageUrl: string;

  activityBgImageGuid: string;
  activityBgloading: boolean;
  activityBgImageUrl: string;
  turntableImageGuid: string;
  turntableImageloading: boolean;
  turntableImageUrl: string;

  ueditorContent: string;
  viewDrawerVisible: boolean;
  viewDrawerFormVal: any;
  activityType: number;
  IsApply: boolean;
  gameType: number;
}

class EditActivityForm extends PureComponent<EditFormProps, EditFormState>{
  // editorElemMenu: React.RefObject<any> = React.createRef();
  // editorElemBody: React.RefObject<any> = React.createRef();

  state: EditFormState = {
    activityCoverImageGuid: "",
    activityCoverloading: false,
    activityCoverImageUrl: '',
    wechatShareImageGuid: '',
    wechatShareloading: false,
    wechatShareImageUrl: '',
    activityBgImageGuid: '',
    activityBgloading: false,
    activityBgImageUrl: '',
    turntableImageGuid: '',
    turntableImageloading: false,
    turntableImageUrl: '',
    ueditorContent: '',
    viewDrawerVisible: true,
    viewDrawerFormVal: {},
    activityType: 1,
    IsApply: false,
    gameType: 1,
  };

  static getDerivedStateFromProps(nextProps: EditFormProps, preState: EditFormState) {
    if(nextProps.values.ActivityDetail !== preState.ueditorContent ||
      nextProps.values.ShareImageUrl !== preState.wechatShareImageUrl ||
      nextProps.values.ActivityImageUrl !== preState.activityCoverImageUrl ||
      nextProps.values.IsNeedApply === 1
    ){
      return {
        ueditorContent: decodeURI(nextProps.values.ActivityDetail),
        wechatShareImageUrl: nextProps.values.ShareImageUrl,
        activityCoverImageUrl: nextProps.values.ActivityImageUrl,
        IsApply: nextProps.values.IsNeedApply === 1,
        turntableImageUrl: nextProps.values.TurnTableImageUrl,
      }
    }
    return null
  }

  okHandle = () => {
    const { form, handleUpdate,  } = this.props;
    form.validateFields((err, fieldsValue) => {
      console.log('fieldsValue---------', fieldsValue)
      if (err) return;
      let ActivityStartTime = undefined,
        ActivityEndTime = undefined,
        LuckyStartTime = undefined,
        LuckyEndTime = undefined,
        ApplyStartTime = undefined,
        ApplyEndTime = undefined;

      const { activityCoverImageGuid, activityBgImageGuid, wechatShareImageGuid, ueditorContent, turntableImageGuid } = this.state;
      const {
        ActivityType,
        ProjectId,
        ActivityName,
        OrderNo,
        ActivityImageSeed,
        ShareImageSeed,
        ShareDiscrip,
        IsRecommand,
        IsNeedApply,
        IsNeedSignIn,
        ApplyPlaceHolder,
        ActivityRangeDate,
        LuckyRangeDate,
        LuckyType,
        ApplyMaxCount,
        ApplyScores,
        ApplyRangeDate
      } = fieldsValue;

      if(ActivityRangeDate && ActivityRangeDate.length !== 0) {
        ActivityStartTime = moment(ActivityRangeDate[0]).format(DateFormat);
        ActivityEndTime = moment(ActivityRangeDate[1]).format(DateFormat);
      }else {
        ActivityStartTime = undefined;
        ActivityEndTime = undefined;
      }

      if(LuckyRangeDate && LuckyRangeDate.length !== 0) {
        LuckyStartTime = moment(LuckyRangeDate[0]).format(DateFormat);
        LuckyEndTime = moment(LuckyRangeDate[1]).format(DateFormat);
      }else {
        LuckyStartTime = undefined;
        LuckyEndTime = undefined;
      }

      if(ApplyRangeDate && ApplyRangeDate.length !== 0) {
        ApplyStartTime = moment(ApplyRangeDate[0]).format(DateFormat);
        ApplyEndTime = moment(ApplyRangeDate[1]).format(DateFormat);
      }else {
        ApplyStartTime = undefined;
        ApplyEndTime = undefined;
      }

      const values = {
        ActivityType,
        ProjectId,
        ActivityName,
        ActivityDetail: encodeURI(ueditorContent),
        OrderNo,
        ActivityStartTime,
        ActivityEndTime,
        LuckyStartTime,
        LuckyEndTime,
        LuckyType,
        ActivityImageSeed: activityCoverImageGuid,
        ShareImageSeed: wechatShareImageGuid,
        IsRecommand,
        ShareDiscrip,
        IsNeedApply,
        ApplyStartTime,
        ApplyEndTime,
        ApplyMaxCount,
        ApplyScores,
        IsNeedSignIn,
        Phone: undefined,
        RotaryluckyimgSeed: turntableImageGuid || undefined,
        ReproductionImageSeed: activityBgImageGuid || undefined,
        ApplyPlaceHolder
      }

      console.log('values--------', values)
      // form.resetFields();
      handleUpdate(values);
    });
  };

  normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e && pictureTypeaAndSize(e.file) ? e.fileList : [];
  };

  //上传活动封面
  handleActivityCoverChange = (info: any) => {

    const _self = this;
    const { handleUploadImages, values, handleUpdateModalVisible } = this.props;
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
    this.setState({ activityCoverloading: true });
    getBase64(info.file, (imageUrl: any) => {
      if(handleUploadImages){
        handleUploadImages(imageUrl, (data) => {
          const currValues = {...values, ActivityImageUrl: imageUrl };
          handleUpdateModalVisible(true, currValues)
          _self.setState({
            activityCoverImageGuid: data,
            activityCoverloading: false,
          })

        })
      }
    });
  };

  //微信分享图片
  handleWechatShareChange = (info: any) => {
    const _self = this;
    const { handleUploadImages, handleUpdateModalVisible, values } = this.props;
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
    this.setState({ wechatShareloading: true });
    getBase64(info.file, (imageUrl: any) => {
      if(handleUploadImages){
        handleUploadImages(imageUrl, (data) => {
          const currValues = {...values, ShareImageUrl: imageUrl };
          handleUpdateModalVisible(true, currValues)
          _self.setState({
            wechatShareImageGuid: data,
            wechatShareloading: false
          })
        })
      }
    });
  }

  //活动底图上传
  handleActivityBgChange = (info: any) => {
    const _self = this;
    const { handleUploadImages, values, handleUpdateModalVisible } = this.props;
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
    this.setState({ activityBgloading: true });
    getBase64(info.file, (imageUrl: any) => {
      if(handleUploadImages){
        handleUploadImages(imageUrl, (data) => {
          const currValues = {...values, ReproductionUrl: imageUrl };
          handleUpdateModalVisible(true, currValues)
          _self.setState({
            activityBgImageGuid: data,
            // activityBgImageUrl: imageUrl,
            activityBgloading: false
          })
        })
      }
    });
  }

  //转盘图上传
  turntableUploadImgChange = (info: any) => {
    const _self = this;
    const { handleUploadImages, values, handleUpdateModalVisible } = this.props;
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
    this.setState({ turntableImageloading: true });
    getBase64(info.file, (imageUrl: any) => {
      if(handleUploadImages){
        handleUploadImages(imageUrl, (data) => {
          const currValues = {...values, TurnTableImageUrl: imageUrl };
          handleUpdateModalVisible(true, currValues);
          _self.setState({
            turntableImageGuid: data,
            turntableImageloading: false
          })
        })
      }
    });
  };

  /**渲染上传按钮*/
  uploadButton = (loading: boolean, name: string) => {
    return (
      <div>
        <Icon type={loading ? 'loading' : 'cloud-upload'} style={{fontSize: 20, color: '#999'}}/>
        <div style={{color: 'rgba(0, 0, 0, 0.45)'}}>{loading ? '上传图片中...' : name}</div>
      </div>
    )
  };



  onChangeUeditorContent = (ueditorContent: any) => {
    this.setState({
      ueditorContent
    })
  }


  handleEditViewDrawer = (flag?: boolean, record?: any) => {
    this.setState({
      viewDrawerVisible: !!flag,
      viewDrawerFormVal: record || {},
    })
  }


  endDateHandleValidator = (rule: any, val: Array<moment>, callback: any) => {
    if (!val) {
      callback();
    }
    if(val.length === 0){
      callback();
      return;
    }
    const { form } = this.props;
    const activityData = form.getFieldsValue()['ActivityRangeDate'];

    if(val[0].valueOf() >= activityData[0].valueOf() && val[1].valueOf() <= activityData[1].valueOf()){
      callback();
    }else {
      callback('抽奖时间必须在活动时间内！');
    }
  }

  activityChangeHandle = (val: number) => {
    this.setState({
      activityType: val
    })
  }

  activityGameChange = (val: number) => {
    this.setState({
      gameType: val
    })
  }

  applyChange = (e: React.BaseSyntheticEvent) => {
    const IsApply = e.target.value === 1;
    this.setState({ IsApply })
  }

  render() {
    const { updateModalVisible, form, handleUpdateModalVisible, projectData, values } = this.props;
    const { ueditorContent, activityType, IsApply, gameType } = this.state;
    const {
      activityBgImageUrl,
      activityBgloading,
      activityCoverImageUrl,
      activityCoverloading,
      wechatShareImageUrl,
      wechatShareloading,
      viewDrawerFormVal,
      viewDrawerVisible,
      turntableImageloading,
      turntableImageUrl,
    } = this.state;
    const {
      ActivityType,
      ActivityName,
      ProjectId,
      OrderNo,
      ActivityStartTimeSpan,
      ActivityEndTimeSpan,
      ShareDesc,
      IsNeedApply,
      IsSingin,
      IsRecommand, TurnTableImageUrl, ReproductionUrl
    } = values;
    const title = <DragTitle title="新建活动" />;

    return (
      <Modal
        destroyOnClose={true}
        title={title}
        width={800}
        style={{ top: 40 }}
        visible={updateModalVisible}
        className={styles.addwarp}
        maskClosable={false}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
        bodyStyle={{
          padding: '24px 24px 10px'
        }}
        footer={[
          <Button key="back"  onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>,
          <Button key="submit" type="primary" loading={false} onClick={this.okHandle}>保存</Button>,
        ]}
      >
        <Form layout='vertical'>
          <Row gutter={32}>
            <Col span={12}>
              <FormItem label="活动类型">
                {form.getFieldDecorator('ActivityType', {
                  rules: [{ required: true, message: '请选择活动类型！'}],
                  initialValue: ActivityType
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder='请选择活动类型'
                    onChange={this.activityChangeHandle}
                  >
                    <Select.Option value={1}>普通活动</Select.Option>
                    <Select.Option value={4}>抽奖活动</Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="项目名称">
                {form.getFieldDecorator('ProjectId', {
                  rules: [{ required: true, message: '请选择项目名称！' }],
                  initialValue: ProjectId
                })(
                  <Select style={{ width: '100%' }} placeholder='请选择项目名称'>
                    {
                      projectData.map(_ => (
                        <Select.Option
                          key={_.Id}
                          value={_.Id}
                        >{_.ProjectName}</Select.Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="活动名称">
                {form.getFieldDecorator('ActivityName', {
                  rules: [{ required: true, message: '请输入至少五个字符的活动名称！', min: 5 }],
                  initialValue: ActivityName
                })(<Input placeholder="请输入活动名称" autoComplete='off'/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label={
                  <span>
                排序值&nbsp;
                    <Tooltip title="列表记录按照排序值从大到小排列" >
                      <Icon type="question-circle-o" style={{ color: 'rgba(0,0,0,.45)'}}/>
                </Tooltip>
              </span>
                }
              >
                {form.getFieldDecorator('OrderNo', {
                  rules: [{ required: true, message: '请输入排序值！' }],
                  initialValue: OrderNo
                })(
                  <InputNumber min={1} style={{width: '100%'}} placeholder='请输入排序值'/>
                )}
              </FormItem>
            </Col>

            {
              activityType === 1 && (
                <>
                  <Col span={24}>
                    <FormItem  label="活动时间">
                      {form.getFieldDecorator('ActivityRangeDate', {
                        rules: [{ required: true, message: '请选择活动时间范围！' }],
                        initialValue: [moment(ActivityStartTimeSpan), moment(ActivityEndTimeSpan)]
                      })(
                        <RangePicker
                          showTime={true}
                          ranges={{
                            '今日': [moment().startOf('days'), moment().endOf('days')],
                            '本月': [moment().startOf('month'), moment().endOf('month')],
                          }}
                          format={DateFormat}
                          style={{width: '100%'}}
                        />
                      )}
                    </FormItem>
                  </Col>
                </>
              )
            }
            {
              activityType === 4 && (
                <>
                  <Col span={12}>
                    <FormItem  label="活动时间">
                      {form.getFieldDecorator('ActivityRangeDate', {
                        rules: [{ required: true, message: '请选择活动时间范围！' }],
                        initialValue: [moment(ActivityStartTimeSpan), moment(ActivityEndTimeSpan)]
                      })(
                        <RangePicker
                          showTime={true}
                          ranges={{
                            '今日': [moment().startOf('days'), moment().endOf('days')],
                            '本月': [moment().startOf('month'), moment().endOf('month')],
                          }}
                          format={DateFormat}
                          style={{width: '100%'}}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="抽奖时间">
                      {form.getFieldDecorator('LuckyRangeDate', {
                        rules: [
                          { required: true, message: '请选择抽奖时间！' },
                          {
                            validator: this.endDateHandleValidator
                          }
                        ],
                      })(
                        <RangePicker
                          showTime={true}
                          ranges={{
                            '今日': [moment().startOf('days'), moment().endOf('days')],
                            '本月': [moment().startOf('month'), moment().endOf('month')],
                          }}
                          format={DateFormat}
                          style={{width: '100%'}}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem  label="抽奖活动类型">
                      {form.getFieldDecorator('LuckyType', {
                        rules: [{ required: true, message: '请选择活动模板！' }],
                        initialValue: gameType
                      })(
                        <Select
                          style={{ width: '50%' }}
                          placeholder='请选择活动模板'
                          onChange={this.activityGameChange}
                        >
                          <Select.Option value={1}>转盘抽奖活动</Select.Option>
                          <Select.Option value={2}>开宝箱活动</Select.Option>
                          <Select.Option value={3}>刮刮乐活动</Select.Option>
                          <Select.Option value={4}>砸金蛋活动</Select.Option>
                        </Select>
                      )}
                      <Button
                        type="primary"
                        style={{marginLeft: 12}}
                        onClick={() => this.handleEditViewDrawer(true, { flag: this.editorResult })}
                      >预览模板</Button>
                    </FormItem>
                  </Col>
                  {/*<Col span={24}>*/}
                  {/*<FormItem  label="活动模板">*/}
                  {/*{form.getFieldDecorator('LuckyType', {*/}
                  {/*rules: [{ required: true, message: '请选择活动模板！' }],*/}
                  {/*})(*/}
                  {/*<Select style={{ width: '50%' }} placeholder='请选择活动模板'>*/}
                  {/*<Select.Option value="1">砸金蛋活动</Select.Option>*/}
                  {/*<Select.Option value="2">转盘抽奖活动</Select.Option>*/}
                  {/*<Select.Option value="3">普通活动</Select.Option>*/}
                  {/*<Select.Option value="4">报名活动</Select.Option>*/}
                  {/*<Select.Option value="5">刮刮乐活动</Select.Option>*/}
                  {/*<Select.Option value="6">开宝箱活动</Select.Option>*/}
                  {/*</Select>*/}
                  {/*)}*/}
                  {/*<Button*/}
                  {/*type="primary"*/}
                  {/*style={{marginLeft: 12}}*/}
                  {/*onClick={() => this.handleEditViewDrawer(true, { flag: this.editorResult })}*/}
                  {/*>预览模板</Button>*/}
                  {/*</FormItem>*/}
                  {/*</Col>*/}
                </>
              )
            }
            <Col span={12}>
              <FormItem
                label="活动封面图片"
                extra='照片文件要求是jpg、jpeg、png格式，尺寸建议750*400像素，或相近等比例照片'
              >
                {form.getFieldDecorator('ActivityImageSeed', {
                  rules: [{ required: true, message: '请上传活动封面图片！' }],
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                  initialValue: activityCoverImageUrl ? [{
                    uid: '-1',
                    name: '活动封面图片.png',
                    status: 'done',
                    url: activityCoverImageUrl,
                    thumbUrl: activityCoverImageUrl,
                  }] : undefined,
                })(
                  <Upload
                    accept="image/gif,image/jpeg,image/jpg,image/png"
                    listType="picture-card"
                    showUploadList={false}
                    className={styles['img-uploader']}
                    customRequest={this.handleActivityCoverChange}
                  >
                    {
                      activityCoverImageUrl ?
                      <img
                        src={activityCoverImageUrl}
                        alt="活动封面图片"
                        className={styles.img_show_warp}
                      /> :
                      this.uploadButton(activityCoverloading, '上传图片')
                    }
                  </Upload>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="微信分享图片"
                extra='照片文件要求是jpg、jpeg、png格式，尺寸建议300*300像素，或相近等比例照片'
              >
                {form.getFieldDecorator('ShareImageSeed', {
                  rules: [{ required: true, message: '请上传微信分享图片！' }],
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                  initialValue: wechatShareImageUrl ? [{
                    uid: '-1',
                    name: '微信分享图片.png',
                    status: 'done',
                    url: wechatShareImageUrl,
                    thumbUrl: wechatShareImageUrl,
                  }] : undefined,
                })(
                  <Upload
                    accept="image/gif,image/jpeg,image/jpg,image/png"
                    listType="picture-card"
                    showUploadList={false}
                    className={styles['img-share-uploader']}
                    customRequest={this.handleWechatShareChange}
                  >
                    { wechatShareImageUrl ?
                      <img
                        src={wechatShareImageUrl}
                        alt="微信分享图片"
                        className={styles.img_show_warp}
                      /> :
                      this.uploadButton(wechatShareloading, '上传图片') }
                  </Upload>
                )}
              </FormItem>
            </Col>
            {
              activityType === 4 && (
                <Col span={24}>
                  <FormItem
                    label="活动底图图片"
                    extra='照片文件要求是jpg、jpeg、png格式，尺寸建议750*1400像素，或相近等比例图片。图片底部50像素建议为纯色，便于延伸'
                  >
                    {form.getFieldDecorator('ReproductionImageSeed', {
                      rules: [{ required: true, message: '请上传活动底图图片！' }],
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                      initialValue: activityBgImageUrl ? [{
                        uid: '-1',
                        name: '活动底图图片.png',
                        status: 'done',
                        url: activityBgImageUrl,
                        thumbUrl: activityBgImageUrl,
                      }] : undefined,
                    })(
                      <Upload
                        accept="image/gif,image/jpeg,image/jpg,image/png"
                        listType="picture-card"
                        showUploadList={false}
                        className={styles['img-uploader']}
                        customRequest={this.handleActivityBgChange}
                      >
                        { activityBgImageUrl ?
                          <img
                            src={activityBgImageUrl}
                            alt="活动底图图片"
                            className={styles.img_show_warp}
                            style={{ width: '100%', height: 300 }}
                          /> : this.uploadButton(activityBgloading, '上传图片') }
                      </Upload>
                    )}
                  </FormItem>
                </Col>
              )
            }
            {
              activityType === 4 && gameType === 1 && (
                <Col span={24}>
                  <FormItem
                    label="转盘图片"
                    extra='照片文件要求是jpg、jpeg、png格式，尺寸建议750*1400像素，或相近等比例图片。图片底部50像素建议为纯色，便于延伸'
                  >
                    {form.getFieldDecorator('RotaryluckyimgSeed', {
                      rules: [{ required: true, message: '请上传活动底图图片！' }],
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                      initialValue: turntableImageUrl ? [{
                        uid: '-1',
                        name: '转盘图片.png',
                        status: 'done',
                        url: turntableImageUrl,
                        thumbUrl: turntableImageUrl,
                      }] : undefined,
                    })(
                      <Upload
                        accept="image/gif,image/jpeg,image/jpg,image/png"
                        listType="picture-card"
                        showUploadList={false}
                        className={styles['img-uploader']}
                        customRequest={this.turntableUploadImgChange}
                      >
                        { turntableImageUrl ?
                          <img
                            src={turntableImageUrl}
                            alt="转盘图片"
                            className={styles.img_show_warp}
                            style={{ width: '100%', height: 300 }}
                          /> : this.uploadButton(turntableImageloading, '上传图片') }
                      </Upload>
                    )}
                  </FormItem>
                </Col>
              )
            }
            <Col span={24}>
              <FormItem  label="微信分享描述">
                {form.getFieldDecorator('ShareDiscrip', {
                  rules: [{ required: false, message: '请输入至少五个字符的规则描述！', min: 5 }],
                  initialValue: ShareDesc
                })(
                  <TextArea rows={3} placeholder='请输入微信分享描述' />
                )}
              </FormItem>
            </Col>
            {
              activityType === 1 && (
                <Col span={24}>
                  <FormItem  label="是否需要报名">
                    {form.getFieldDecorator('IsNeedApply', {
                      initialValue: IsNeedApply
                    })(
                      <Radio.Group onChange={this.applyChange}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Col>
              )
            }
            {
              IsApply && (
                <>
                  <Col span={12}>
                    <FormItem  label="报名时间">
                      {form.getFieldDecorator('ApplyRangeDate', {
                        rules: [{ required: true, message: '请选择报名时间范围！' }],

                      })(
                        <RangePicker
                          showTime={true}
                          ranges={{
                            '今日': [moment().startOf('days'), moment().endOf('days')],
                            '本月': [moment().startOf('month'), moment().endOf('month')],
                          }}
                          format={DateFormat}
                          style={{width: '100%'}}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      label='报名所需积分'
                    >
                      {form.getFieldDecorator('ApplyScores', {
                        rules: [{ required: false, message: '请输入排序值！' }],

                      })(
                        <InputNumber min={1} style={{width: '100%'}} placeholder='请输入排序值'/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      label='最大报名人数'
                    >
                      {form.getFieldDecorator('ApplyMaxCount', {
                        rules: [{ required: true, message: '请输入最大报名人数！' }],
                      })(
                        <InputNumber min={1} style={{width: '100%'}} placeholder='请输入最大报名人数'/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      label='报名提示信息'
                    >
                      {form.getFieldDecorator('ApplyPlaceHolder', {
                        rules: [{ required: true, message: '请输入报名提示信息！' }],
                      })(
                        <Input style={{width: '100%'}} placeholder='请输入报名提示信息'/>
                      )}
                    </FormItem>
                  </Col>
                </>
              )
            }
            {
              activityType === 1 && (
                <Col span={24}>
                  <FormItem  label="是否需要签到">
                    {form.getFieldDecorator('IsNeedSignIn', {
                      initialValue: IsSingin
                    })(
                      <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Col>
              )
            }
            <Col span={24}>
              <FormItem  label="是否需要推荐">
                {form.getFieldDecorator('IsRecommand', {
                  initialValue: IsRecommand
                })(
                  <Radio.Group>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem className={styles['activity-form-item']} label="活动说明">
                <ReactUEditorComponent
                  value={ueditorContent}
                  onChange={this.onChangeUeditorContent}
                  ueditorOptions={{
                    toolbars: [
                      [
                        'fullscreen', /*  */ 'source', '|', 'undo', 'redo', '|', "fontsize", 'more', '|', 'blockquote', 'horizontal', '|',  'removeformat', '|', 'simpleupload', /*'insertvideo',*/
                      ],[
                        'bold', 'italic', 'underline', 'strikethrough', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist',
                        'justifyleft', 'justifycenter', 'justifyright', '|',
                        'link', 'unlink', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter',
                      ]],
                    theme:'wx',
                    // 初始化编辑器高度
                    initialFrameHeight: 260,
                    elementPathEnabled : false, //是否启用元素路径，默认是显示
                    wordCount: false, //字数统计
                    maximumWords: 20000, //允许的最大字符数
                    serverOptions: {
                      /* 上传图片配置项 */
                      // imageActionName: 'uploadimage', /* 执行上传图片的action名称 */
                      imageFieldName: 'dataStr', /* 提交的图片表单名称 */
                      imageMaxSize: 2048000, /* 上传大小限制，单位B */
                      imageAllowFiles: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'], /* 上传图片格式显示 */
                      imageCompressEnable: true, /* 是否压缩图片,默认是true */
                      imageCompressBorder: 1600, /* 图片压缩最长边限制 */
                      imageInsertAlign: 'none', /* 插入的图片浮动方式 */
                      imageUrlPrefix: '', /* 图片访问路径前缀 */
                      imageResponseKey: 'fileURL' //! 图片上传接口response中包含图片路径的键名
                    },
                    // 上传文件时的额外信息
                    serverExtra: {
                      // 上传文件额外请求头
                      headers: {
                        Auth: 'token'
                      },
                      // 上传文件额外的数据
                      extraData: {
                        desc: 'more data'
                      }
                    },
                    serverUrl: '/ydh/ActivityToUi/UploadActivityImage' // 上传文件的接口
                  }}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
        {
          viewDrawerFormVal && Object.keys(viewDrawerFormVal).length ? (
            <ViewDrawer
              handleEditViewDrawer={this.handleEditViewDrawer}
              viewDrawerFormVal={viewDrawerFormVal}
              viewDrawerVisible={viewDrawerVisible}
              ueditorContent={ueditorContent}
            />
          ) : null
        }

      </Modal>
    );

  }
}

export default Form.create<EditFormProps>()(EditActivityForm);
