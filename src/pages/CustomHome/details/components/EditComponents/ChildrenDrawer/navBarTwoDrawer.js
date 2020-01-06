import React, { Component, PureComponent } from "react";
import PropTypes from 'prop-types';
import styles from './navBarTwoDrawer.less';
import { pictureTypeaAndSize, checkImageWH } from '@/utils'
import { Prefix, uploadUrl, functionData } from '@/utils/config'
import {
  Drawer,
  Form,
  Select,
  InputNumber,
  Radio,
  Button,
  Upload,
  Icon,
  message,
  Input,
} from 'antd';
import shortid from 'shortid';
import _ from 'lodash'


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file, fileList) {
  console.log(file)
  const isJPG = file.type === 'image/jpeg';
  const isJPEG = file.type === 'image/jpeg';
  const isGIF = file.type === 'image/gif';
  const isPNG = file.type === 'image/png';
  const isSvg = file.type === 'image/svg+xml';
  if (!(isJPG || isJPEG || isGIF || isPNG )) {
    message.error('只能上传JPG 、JPEG 、GIF、 PNG格式的图片!');
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 1;
  if (!isLt2M) {
    message.error('图片大小必须小于1MB!');
    return false
  }
  return (isJPG || isJPEG || isGIF || isPNG) && isLt2M &&  checkImageWH(file, 48, 48);
}


@Form.create({ name: 'validate_add_swiper' })
class SwiperTwoDrawer extends Component {

  state = {
    loading: false,
    selectLoading: false,
    imageUrl: '',
    urlKey: 1,

  };

  handleSubmit = e => {
    e.preventDefault();
    const { menuId, addImagesHandle, handleType, editId, onClose, dispatch, editInfo, nomalIcon, selectIcon } = this.props;
    const { Images } = editInfo;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.warn("显示的信息是values", values)
        const { OrderNo, btnName, ImageUrl, SelectImageUrl, LinkType, LinkUrl, FunctionName } = values;
        const ImageUrl1 = nomalIcon ? nomalIcon : ImageUrl[0].response.HttpPath;
        const ImageUrl2 = selectIcon ? selectIcon : SelectImageUrl[0].response.HttpPath;

        console.warn("未选中图标", ImageUrl1)
        console.warn("选中图标", ImageUrl2)
        if(handleType === 1){
          const showName = functionData.filter(_ => _.value === FunctionName)
          const ShowFunctionName = showName && showName.length !== 0 && showName[0].name;
          dispatch({
            type: 'pagesinfo/updateDrawerNavbar',
            payload: {
              ...editInfo,
              Images: [
                ...Images,
                {
                  Id: Math.random(),
                  menuId,
                  OrderNo,
                  btnName,
                  ImageUrl: ImageUrl1,
                  SelectImageUrl: ImageUrl2,
                  LinkType: LinkType || 0,
                  FunctionType: 1,
                  LinkUrl: LinkUrl || '',
                  FunctionName: FunctionName || '',
                  ShowFunctionName
                }
              ]
            }
          });
          onClose()
        }else {
          // console.log("Images", Images)
          const other = Images.filter(_ => _.Id !== editId);
          const showName = functionData.filter(_ => _.value === FunctionName)
          const ShowFunctionName = showName && showName.length !== 0 && showName[0].name;
          const newImages = [
            ...other,
            {
              Id: shortid.generate(),
              menuId,
              OrderNo,
              btnName,
              ImageUrl: ImageUrl1,
              SelectImageUrl: ImageUrl2,
              LinkType: LinkType || 0,
              FunctionType: 1,
              LinkUrl: LinkUrl || '',
              FunctionName: FunctionName || '',
              ShowFunctionName
            }
          ]
          const newData =  _.orderBy(newImages, ['OrderNo'], ['asc']);
          dispatch({
            type: 'pagesinfo/updateDrawerNavbar',
            payload: {
              ...editInfo,
              Images: newData
            }
          });
          onClose()
        }
      }
    });
  };

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && pictureTypeaAndSize(e.file) ? e.fileList : [];
  };

  noSelectIconChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.props._noSelectedIconHnadle(info.file.response.HttpPath)
      this.setState({ loading: false });
    }
  };

  noSelectIconRemove = () => {
    this.props._noSelectedIconHnadle(null)
  }


  selectIconChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ selectLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.props._SelectedIconHnadle(info.file.response.HttpPath)
      this.setState({ selectLoading: false });
    }
  };

  selectIconRemove = () => {
    this.props._SelectedIconHnadle(null)
  }

  render() {
    const { OrderNo, btnName, nomalIcon, selectIcon, LinkType, LinkUrl, FunctionName, url, visible, onClose, width, title, closable, _addressChangeHandle, _urlChangeHandle, editInfo } = this.props;
    const { Images, FontSize, BaseColor, FontColor } = editInfo;
    const { loading, selectLoading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const uploadButton = (status, name) => (
      <div>
        <Icon type={status ? 'loading' : 'plus'} style={{fontSize: 20, color: '#999'}}/>
        <div className="ant-upload-text">{name}</div>
      </div>
    );
    const orderNum = OrderNo ? OrderNo : Images.length + 1;
    const urlType = Images.length === 0 ? 1 : Images;
    // const nomalIcon = Images.length === 0 ? null : Images;
    // const selectIcon = Images.length === 0 ? null : Images;

    return (
      <Drawer
        title={title}
        width={width}
        placement="right"
        maskClosable={true}
        destroyOnClose={true}
        closable={closable}
        onClose={onClose}
        visible={visible}
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="排序编号">
            {getFieldDecorator('OrderNo', {
              rules: [{ required: true, message: 'Please select your country!' }],
              initialValue: orderNum })(<InputNumber disabled={true} min={1} max={10} />)}
          </Form.Item>
          <Form.Item label="按钮名称" hasFeedback>
            {getFieldDecorator('btnName', {
              rules: [{ required: true, message: '请输入按钮名称' }],
              initialValue: btnName
            })(
              <Input placeholder="请输入按钮名称" maxLength={4} />,
            )}
          </Form.Item>
          <Form.Item label="未选中图标" extra="请上传48PX * 48PX，且大小在1M以内的图片支持jpg、jpeg、png、gif格式">
            {getFieldDecorator('ImageUrl', {
              rules: [{ required: true, message: '请上传未选中图标!', }],
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
              initialValue: nomalIcon ? [{
                uid: '-1',
                name: 'xxx.png',
                status: 'done',
                url: `${Prefix + nomalIcon}`,
              }] : [],
            })(
              <Upload
                name="base64str"
                listType="picture-card"
                className={styles['img-uploader']}
                showUploadList={{
                  showPreviewIcon: false,
                  showRemoveIcon: true
                }}
                action={uploadUrl}
                beforeUpload={beforeUpload}
                onChange={this.noSelectIconChange}
                onRemove={this.noSelectIconRemove}
              >
                { nomalIcon ? null : uploadButton(loading, '上传未选中图标') }
              </Upload>
            )}
          </Form.Item>
          <Form.Item label="选中图标" extra="请上传48PX * 48PX，且大小在1M以内的图片支持jpg、jpeg、png、gif格式">
            {getFieldDecorator('SelectImageUrl', {
              rules: [{ required: true, message: '请上传选中图标!', }],
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
              initialValue: selectIcon ? [{
                uid: '-1',
                name: 'xxx.png',
                status: 'done',
                url: `${Prefix + selectIcon}`,
              }] : [],
            })(
              <Upload
                name="base64str"
                listType="picture-card"
                className={styles['img-uploader']}
                showUploadList={{
                  showPreviewIcon: false,
                  showRemoveIcon: true
                }}
                action={uploadUrl}
                beforeUpload={beforeUpload}
                onChange={this.selectIconChange}
                onRemove={this.selectIconRemove}
              >
                { selectIcon ? null : uploadButton(selectLoading, '上传选中图标') }
              </Upload>
            )}
          </Form.Item>
          <Form.Item label="链接地址">
            {getFieldDecorator('LinkType', {
              rules: [{ required: true, message: '请选择链接地址'}],
              initialValue: LinkType
            })(
              <Radio.Group onChange={_urlChangeHandle} >
                <Radio.Button value={0}>无</Radio.Button>
                <Radio.Button value={1}>系统功能</Radio.Button>
                <Radio.Button value={2}>自定义链接</Radio.Button>
              </Radio.Group>,
            )}
          </Form.Item>
          {
            LinkType === 1 ? <Form.Item label="系统功能">
              {getFieldDecorator('FunctionName', {
                rules: [{ required: true, message: '请选择系统功能' }],
                initialValue: FunctionName || undefined })(
                <Select placeholder="请选择系统功能" >
                  {
                    functionData.map(_ => (
                      <Select.Option key={_.value} value={_.value}>{_.name}</Select.Option>
                    ))
                  }
                </Select>,
              )}
            </Form.Item> : null
          }
          {
            LinkType === 2 ? <Form.Item label="自定义连接">
              {getFieldDecorator('LinkUrl', {
                rules: [{ required: true, message: '请输入自定义链接地址' }],
                initialValue: LinkUrl })(
                <Input style={{width: 338}} />,
              )}
            </Form.Item> : null
          }
          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button type="primary" htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </Drawer>
    );
  }
}
//index, system, titleText, url, visible, onClose, width, title, closable
SwiperTwoDrawer.propTypes = {
  system: PropTypes.number,
  titleText: PropTypes.string,
  url: PropTypes.string,
  visible: PropTypes.bool,
  closable: PropTypes.bool,
  onClose: PropTypes.func,
  width: PropTypes.number,
  title: PropTypes.string,
}

export default SwiperTwoDrawer;
