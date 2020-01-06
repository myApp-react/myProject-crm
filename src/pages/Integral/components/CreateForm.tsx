import {
  Form,
  Input,
  Modal,
  Row,
  Col,
  Upload,
  Icon,
  message,
  Radio,
  DatePicker,
  Result,
  Select,
  InputNumber,
  Button,
  Empty,
  Spin,
  Tag,
  Typography,
} from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { PureComponent } from 'react';

import moment from 'moment';
import { debounce } from 'lodash'

import styles from './CreateForm.less'
import { pictureTypeaAndSize } from '@/utils';
import { integralParams, ProjectParams } from '@/pages/Integral/data';
import { integralType } from '@/pages/Integral/model';
import { connect } from 'dva';
import { Action, Dispatch } from 'redux';
import { appType } from '@/models/app';

const FormItem = Form.Item;
const { Option } = Select;
const { Text } = Typography;
const DateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

function getBase64(img: any, callback: any) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

interface CreateFormProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'integralList/GetServicePoint'
      | 'integralList/queryCustomerInfo'
      | 'integralList/getScoresSupplementContext'
      | 'integralList/uploadTiketImage'
      >
    >;
  modalVisible: boolean;
  handleAdd: (fields: {
    ProjectId: string,
    ServicePointId: string,
    CustomerId: string,
    StoreId: string,
    SaleTime: string,
    ReciptCode: string,
    ProductCount: number,
    ReciptAmt: any,
    ImageGuid: string,
  }, callback: () => void) => void;
  handleModalVisible: (flag?: boolean) => void;
  projectData: ProjectParams[];
  integralList: integralType;
  app: appType;
  loading: any;
}

interface CreateFormState {
  uploadType: number;
  takePhotoStatus: boolean;
  vipList: Array<any>;
  vipVal: any;
  ImageGuid: string;
  imageUrl: string;
  dealDate: any;
  cameraStatus: boolean;
  PlanNames: Array<string>;

}

@connect(
  ({
     integralList,
     app,
     loading,
   }: {
    integralList: integralType;
    app: appType;
    loading: {
      models: {
        [key: string]: boolean;
      };
      effects: {
        [key: string]: boolean;
      }
    };
  }) => ({
    integralList,
    app,
    loading: loading,
  }),
)
class CreateForm extends PureComponent<CreateFormProps, CreateFormState>{

  canvasRef: React.RefObject<any> = React.createRef();
  videoRef: React.RefObject<any> = React.createRef();
  streaming: boolean = false;
  private Timer: any = null;
  private lastFetchId: number = 0;
  context = null;
  video = null;
  constructor(props: CreateFormState) {
    super(props);
    this.fetchUser = debounce(this.fetchUser, 800);
    this.state = {
      uploadType: 1,
      takePhotoStatus: false,
      vipList: [],
      vipVal: undefined,
      ImageGuid: '',
      imageUrl: '',
      dealDate: moment(),
      cameraStatus: false,
      PlanNames: [],
    }
  }

  normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e && pictureTypeaAndSize(e.file) ? e.fileList : [];
  };

  /**拍照上传*/
  handleUploadPhoto = () => {

  }

  handleChange = (info: any) => {
    const _self = this;
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

    const { dispatch } = this.props;
    getBase64(info.file, (imageUrl: any) => {
      dispatch({
        type: 'integralList/uploadTiketImage',
        payload: {
          dataStr: imageUrl
        },
        callback: (data: string) => {
          _self.setState({
            ImageGuid: data,
            imageUrl
          })
        }
      })
    });
  };

  /**上传图片方式切换*/
  handleUploadTypeChange = (e: any) => {
    const uploadType = e.target.value;
    this.setState({
      uploadType,
      takePhotoStatus: false,
    })
    if(uploadType === 1) {
      this.Timer = setTimeout(() => {
        this.handleGetUserMedia();
      }, 0)
    }
  }

  componentDidUpdate(props: CreateFormProps, state: CreateFormState) {
    if(props.modalVisible !== this.props.modalVisible && this.props.modalVisible){
      this.setState({
        dealDate: moment(),
        imageUrl: '',
        PlanNames: []
      })
       if(this.Timer) {
         clearTimeout(this.Timer);
       }
       this.Timer = setTimeout(() => {
         this.handleGetUserMedia();
       }, 0)
    }
  }

  handleGetUserMedia = () => {
    const video = this.videoRef.current;
    const canvas = this.canvasRef.current;
    const _self = this;
    if (!video || !canvas.getContext) return;

    this.video = video;
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: true})
        .then(stream => {
          video.srcObject = stream; // 将捕获的视频流传递给video  放弃window.URL.createObjectURL(stream)的使用
          video.play(); //  播放视频
        }).catch(function(err) {});

      video.addEventListener('canplay', function(ev: any){
        if (!_self.streaming) {
          _self.streaming = true;
        }
      }, false);
    }
  }

  /**截取照片*/
  handleInterceptImage = () => {
    const canvas = this.canvasRef.current;
    if (!canvas.getContext) return;
    const context = canvas.getContext('2d');

    if(this.streaming && this.context){
      this.setState((pre) => ({
        takePhotoStatus: !pre.takePhotoStatus
      }), () => {
        if(this.state.takePhotoStatus) {
          const images =  new Image();

          images.setAttribute('crossOrigin', 'anonymous');
          images.onload = () => {
            //画图
            context.drawImage(this.video, 0, 0, 360, 260);
            var data = canvas.toDataURL('image/jpeg');
            images.src = data;
          }
          // context.drawImage(this.video, 0, 0, 360, 260);
          // console.log(canvas.toDataURL('image/png'))

        }
      })
    }
  }

  /**重拍*/
  handleCancelImage = () => {
    const canvas = this.canvasRef.current;
    if (!canvas.getContext) return;
    const context = canvas.getContext('2d');

    if(this.streaming && this.context){
      this.setState((pre) => ({
        takePhotoStatus: !pre.takePhotoStatus
      }), () => {
        if(!this.state.takePhotoStatus) {
          context.clearRect(0, 0, 360, 260);
        }
      })
    }
  }

  componentWillUnmount() {
    this.Timer && clearTimeout(this.Timer);
  }

  fetchUser = (value: string) => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ vipList: [] });
    this.props.dispatch({
      type: 'integralList/queryCustomerInfo',
      payload: { userInfo: value },
      callback: (data: any) => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return;
        }
        if(!data){
          this.setState({ vipList: [] })
          return;
        }
        this.setState({
          vipList: [data]
        })
      }
    })
  }


  /**会员切换操作*/
  handleVipChange = (vipVal: string) => {
    const { form } = this.props;
    this.setState({ vipVal }, () => {
      const vipName = this.state.vipList[0].CustomerName;
      const Scores = this.state.vipList[0].Scores;
      form.setFieldsValue({
        vipName,
        Scores: `${Scores}积分`
      })
      const FieldsVal = form.getFieldsValue(['StoreId', 'SaleTime', 'ReciptAmt']);
      const { ReciptAmt, StoreId, SaleTime } = FieldsVal;
      if(ReciptAmt && StoreId && SaleTime) {
        this.handleFetchRes(vipVal, StoreId, moment(SaleTime).format(DateTimeFormat), ReciptAmt)
      }
    });
  };

  /**ajax*/
  handleFetchRes = (CustomerId: string, StoreId: string, SaleTime: string, Amt: number | string) => {
    const { form, dispatch } = this.props;
    dispatch({
      type: 'integralList/getScoresSupplementContext',
      payload: {
        CustomerId,
        StoreId,
        SaleTime,
        Amt
      },
      callback: (res:integralParams) => {
        if(res){
          const { Rate, PlanNames, Scores } = res;
          form.setFieldsValue({
            ShopPointsRate: `${Rate.Scores} / ${Rate.Money}`,
            currPoint: `${Scores}分`,
          })
          this.setState({ PlanNames })
        }else {
          form.setFieldsValue({
            ShopPointsRate: ``,
            currPoint: `0分`,
          })
          this.setState({ PlanNames: [] })
        }
      }
    })
  }

  getfinallyRes = debounce((value: number | string) => {
    const { form } = this.props;
    const FieldsVal = form.getFieldsValue(['CustomerId', 'StoreId', 'SaleTime']);
    const { CustomerId, StoreId, SaleTime } = FieldsVal;
    if(CustomerId && StoreId && SaleTime){
      this.handleFetchRes(CustomerId, StoreId, moment(SaleTime).format(DateTimeFormat), value)
    }
  }, 1000);

  /**小票金额切换*/
  handleReciptAmtChange = (value: number | string) => {
    if(value){
      this.getfinallyRes(value);
    }
  }

  /**交易时间切换*/

  handleChangeDate = (date: moment, dateString: string) => {
    if(dateString){
      const { form } = this.props;
      const FieldsVal = form.getFieldsValue(['CustomerId', 'StoreId', 'ReciptAmt']);
      const { CustomerId, StoreId, ReciptAmt } = FieldsVal;
      if(CustomerId && StoreId && ReciptAmt){
        this.handleFetchRes(CustomerId, StoreId, dateString, ReciptAmt)
      }
    }
  }

  /**店铺切换*/
  handleChangeStore = (value: string) => {
    console.log(value)
    if(value){
      const { form } = this.props;
      const FieldsVal = form.getFieldsValue(['CustomerId', 'SaleTime', 'ReciptAmt']);
      const { CustomerId, SaleTime, ReciptAmt } = FieldsVal;
      if(CustomerId && SaleTime && ReciptAmt){
        this.handleFetchRes(CustomerId, value, moment(SaleTime).format(DateTimeFormat), ReciptAmt)
      }
    }
  }

  onDropdownVisibleChange = (open: boolean) => {
    if(!open){
      // console.log(open)
    }
  }

  /**提交*/
  okHandle = () => {
    const { form, handleAdd } = this.props;
    const { ImageGuid } = this.state;
    form.validateFields((err, fields) => {
      if (err) return;
      console.log("fieldsValue", fields)
      const { ProjectId, ServicePointId, CustomerId, StoreId, SaleTime, ReciptCode, ProductCount, ReciptAmt } = fields;
      // form.resetFields();
      handleAdd({
        ProjectId,
        ServicePointId,
        CustomerId,
        StoreId,
        SaleTime: moment(SaleTime).format(DateTimeFormat),
        ReciptCode,
        ProductCount,
        ReciptAmt,
        ImageGuid
      }, () => {
        this.setState({
          imageUrl: '',
        })
      });
    });
  };


  render() {
    const { modalVisible, form, handleModalVisible, loading, app } = this.props;
    const { storeData, projectData, servicePointData } = app;
    const { uploadType, takePhotoStatus, vipList, imageUrl, dealDate, cameraStatus, PlanNames } = this.state;

    const uploadButton = (
      <div>
        <Icon type={loading.effects['integralList/uploadTiketImage'] ? 'loading' : 'cloud-upload'} style={{fontSize: 36}}/>
        <div style={{
          fontSize: 20,
          marginTop: 12,
          color: 'rgba(0,0,0,0.45)'
        }}>请选择小票图片</div>
      </div>
    );

    return (
      <Modal
        destroyOnClose
        title="积分补录"
        visible={modalVisible}
        onOk={this.okHandle}
        width={970}
        style={{ top: 40 }}
        onCancel={() => handleModalVisible()}
        bodyStyle={{
          padding: '22px 40px 2px'
        }}
        footer={
          [
            <Button
              key="back"
              onClick={() => handleModalVisible()}
            >
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.okHandle}
              loading={loading.effects['integralList/add']}
            >
              {
                loading.effects['integralList/add'] ? '保存中' : '保存'
              }
            </Button>,
          ]
        }
      >
        <Form>
          <Row gutter={[16, 8]}>
            <Col span={10} >
              <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} className={styles['radio-check']}>
                <Radio.Group
                  buttonStyle="solid"
                  onChange={this.handleUploadTypeChange}
                  value={uploadType}
                >
                  <Radio.Button value={1}>拍照上传</Radio.Button>
                  <Radio.Button value={2}>本地上传</Radio.Button>
                </Radio.Group>
              </FormItem>
              {
                uploadType === 1 ? <div className={styles.photo}>
                    {
                      cameraStatus && <>
                        <video ref={this.videoRef} className={styles.video}  width={360} height={260}>Sorry,Explorer not support.</video>
                        <canvas ref={this.canvasRef} className={styles.canvas} width={360} height={260} >Sorry,Explorer not support.</canvas>
                        {
                          takePhotoStatus ? <Button
                            type="danger"
                            className={styles['take-photo']}
                            shape="round"
                            icon="reload"
                            onClick={this.handleCancelImage}
                          >
                            重拍
                          </Button> : <Button
                            type="primary"
                            className={styles['take-photo']}
                            shape="round"
                            icon="camera"
                            onClick={this.handleInterceptImage}
                          >
                            拍照
                          </Button>
                        }
                      </>
                    }
                    {
                      !cameraStatus && (
                        <Result
                          status="warning"
                          title="摄像头不可用"
                        />
                      )
                    }
                </div> : <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                  {
                    form.getFieldDecorator('uploadImg', {
                      rules: [{ required: true, message: '请上传本地图片！',}],
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                      initialValue: imageUrl ? [{
                        uid: '-1',
                        name: '上传图片.png',
                        status: 'done',
                        url: imageUrl,
                      }] : null,
                    })(
                      <Upload
                        accept='image/jpeg,image/png'
                        listType="picture-card"
                        className={styles.uploader}
                        showUploadList={false}
                        customRequest={this.handleChange}
                      >
                        { imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton }
                      </Upload>
                    )
                  }
                </FormItem>
              }
            </Col>
            <Col span={14} style={{paddingLeft: 60}}>
              <FormItem label='项目名称' labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                {
                  form.getFieldDecorator('ProjectId', {
                    rules: [{ required: true, message: '请选择项目名称！'}],
                    initialValue: projectData.length !== 0 && projectData[0].Id || undefined
                  })(
                    <Select style={{ width: '100%' }} placeholder='请选择项目名称'>
                      {
                        projectData.map(_ => (
                          <Option key={_.Id} value={_.Id}>{_.ProjectName}</Option>
                        ))
                      }
                    </Select>
                  )
                }
              </FormItem>
              <FormItem label='服务点位' labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                {
                  form.getFieldDecorator('ServicePointId', {
                    rules: [{ required: true, message: '请选择服务点位！',}],
                    initialValue: servicePointData.length !== 0 && servicePointData[0].Id || undefined
                  })(
                    <Select style={{ width: '100%' }} placeholder='请选择服务点位' loading={loading.effects['integralList/GetServicePoint']}>
                      {
                        servicePointData.map(_ => (
                          <Option key={_.Id} value={_.Id}>{_.ServicePointName}</Option>
                        ))
                      }
                    </Select>
                  )
                }
              </FormItem>
              <FormItem label='交易时间' labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                {
                  form.getFieldDecorator('SaleTime', {
                    rules: [{ required: true, message: '请选择交易时间！',}],
                    initialValue: dealDate
                  })(
                    <DatePicker style={{ width: '100%' }} onChange={this.handleChangeDate} format={DateTimeFormat} />
                  )
                }
              </FormItem>
              <FormItem label='小票编号' labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                {
                  form.getFieldDecorator('ReciptCode', {
                    rules: [{ required: true, message: '请输入小票编号！',}],
                  })(
                    <Input
                      placeholder="请输入小票编号"
                    />
                  )
                }
              </FormItem>
              <FormItem label='小票金额'  labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                {
                  form.getFieldDecorator('ReciptAmt', {
                    rules: [{ required: true, message: '请输入小票金额！',}],
                  })(
                    <InputNumber
                      style={{ width: '90%' }}
                      min={0}
                      placeholder="请输入小票金额"
                      precision={2}
                      onChange={this.handleReciptAmtChange}
                    />
                  )
                }
                <span className='ant-form-text'>元</span>
              </FormItem>
              <FormItem label='商品数量' labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                {
                  form.getFieldDecorator('ProductCount', {
                    rules: [{ required: true, message: '请输入商品数量！',}],
                  })(
                    <InputNumber
                      style={{ width: 136 }}
                      min={1}
                      placeholder="商品数量"
                    />
                  )
                }
              </FormItem>
              <FormItem label='会员查询' labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                {
                  form.getFieldDecorator('CustomerId', {
                    rules: [{ required: true, message: '请输入手机号/卡号！',}],
                    // initialValue: vipVal || undefined
                  })(
                    <Select
                      showSearch
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      placeholder='请输入会员信息'
                      filterOption={false}
                      onSearch={this.fetchUser}
                      onChange={this.handleVipChange}
                      notFoundContent={
                        loading.effects['integralList/queryCustomerInfo'] ? <Spin size='small'/> :
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      }
                    >
                      {
                        vipList.map(_ => (
                          <Option key={_.CustomerId} value={_.CustomerId} data-num={_.Scores}>{_.CustomerName}</Option>
                        ))
                      }
                    </Select>
                  )
                }
              </FormItem>
              <FormItem style={{ marginBottom: 0 }}>
                <FormItem
                  label='会员名称'
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  style={{ display: 'inline-block', width: 'calc(60% - 12px)' }}
                >
                  {
                    form.getFieldDecorator('vipName')(
                      <Input
                        disabled
                        style={{ width: 130, color: '#333' }}
                      />
                    )
                  }
                </FormItem>
                <FormItem
                  label='可用积分'
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  style={{ display: 'inline-block', width: 'calc(40% - 12px)' }}
                >
                  {
                    form.getFieldDecorator('Scores',)(
                      <Input
                        disabled
                        style={{ width: 130, color: '#333' }}
                      />
                    )
                  }
                </FormItem>
              </FormItem>
              <FormItem label='商铺名称' labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                {
                  form.getFieldDecorator('StoreId', {
                    rules: [{ required: true, message: '请选择商铺！',}],
                  })(
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder='请选择商铺'
                      onChange={this.handleChangeStore}
                      onDropdownVisibleChange={this.onDropdownVisibleChange}
                      optionLabelProp="label"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {
                        storeData.map(_ => (
                          <Option
                            key={_.Id}
                            value={_.Id}
                            label={_.Name}
                          >{_.Name}</Option>
                        ))
                      }
                    </Select>
                  )
                }
              </FormItem>
              <FormItem className={styles['extra-item']}>
                <FormItem
                  label='商铺积分率'
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  style={{ display: 'inline-block', width: 'calc(60% - 12px)' }}
                >
                  {
                    form.getFieldDecorator('ShopPointsRate')(
                      <Input
                        disabled
                        style={{ width: 130, color: '#333' }}
                      />
                    )
                  }
                </FormItem>
                <FormItem
                  label='本次积分'
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  style={{ display: 'inline-block', width: 'calc(40% - 12px)' }}
                >
                  {
                    form.getFieldDecorator('currPoint')(
                      <Input
                        disabled
                        style={{ width: 130, color: '#333' }}
                      />
                    )
                  }
                </FormItem>
              </FormItem>
              <FormItem
                label='积分促销规则'
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 19 }}
              >
                {
                  PlanNames.map(_ => (
                    <Tag color="volcano" key={_}>{_}</Tag>
                  ))
                }
                {
                  PlanNames.length === 0 && '无'
                }
              </FormItem>
            </Col>
          </Row>
        </Form>

      </Modal>
    )
  }
}



export default Form.create<CreateFormProps>()(CreateForm);
