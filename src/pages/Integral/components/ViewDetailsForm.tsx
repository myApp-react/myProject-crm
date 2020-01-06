import {
  Modal,
  Row,
  Col,
  Descriptions,
  Empty,
  Spin,
  Tag,
  Icon,
} from 'antd';
import React, { PureComponent } from 'react';

import moment from 'moment'
import { Action, Dispatch } from 'redux';
import { Prefix } from '@/utils/constant';
import { connect } from 'dva';

import styles from './UpdateForm.less'
import RcViewer from '@hanyk/rc-viewer'

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const SourceCont = ['', '微网站', '后台管理'];
const colorType = ['geekblue', 'green', 'red'];
const textType = ['未审批', '审批通过', '审批驳回'];
const iconType = ['clock-circle', 'check-circle', 'close-circle'];


const options = {
  inline: true,
  minWidth: 360,
  minHeight: 520,
  loop: false,
  slideOnTouch: false,
  button: true, //右上角全屏查看
  toolbar: {
    zoomIn: 3,
    zoomOut: 3,
    oneToOne: 0,
    reset: 0,
    prev: 0,
    play: {
      show: 0,
      size: 'large',
    },
    next: 0,
    rotateLeft: 3,
    rotateRight: 3,
    flipHorizontal: 0,
    flipVertical: 0,
  }
}

interface InfoType {
  Id: string
  ProjectName: string
  VipId: string
  VipName: string
  CardTypeName: string
  RepitImageUrl: string | null
  SourceType: number;
  StoreId: string | null,
  StoreName: string | null,
  StoreCode: string | null,
  SaleTime: string | null,
  SaleTimeSpan: string | null,
  ReciptCode: string | null,
  ProductCount: number | null,
  SaleAmt: number | null,
  ChangeScores: number
}

export interface UpdateFormProps {
  dispatch: Dispatch<
    Action<
      | 'integralList/getRepitExamineDto'
      >
    >;
  handleDetailsModalVisible: (flag?: boolean, itemId?: string) => void;
  detailsModalVisible: boolean;
  values: string;
  loading: boolean;
}

export interface UpdateFormState {
  currentInfo: InfoType;
}

@connect(
  ({
     loading,
   }: {
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    loading: loading.models.integralList
  }),
)
class DetailsForm extends PureComponent<UpdateFormProps, UpdateFormState> {

  static defaultProps = {
    handleDetailsModalVisible: () => {},
    values: '',
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  state: UpdateFormState = {
    currentInfo: {
      Id: '',
      ProjectName: '',
      VipId: '',
      VipName: '',
      CardTypeName: '',
      RepitImageUrl: null,
      SourceType: 0,
      StoreId: null,
      StoreName: null,
      StoreCode: null,
      SaleTime: null,
      SaleTimeSpan: null,
      ReciptCode: null,
      ProductCount: null,
      SaleAmt: null,
      ChangeScores: 0,
      ExamineStatus: 0
    }
  }

  componentDidMount() {
    const { values } = this.props
    this.getDetails(values);
  }

  //获取详情
  getDetails = (itemId: string) => {
    const { dispatch } = this.props
    dispatch({
      type: "integralList/getRepitExamineDto",
      payload: { itemId },
      callback: (currentInfo: InfoType) => {
        this.setState({
          currentInfo
        })
      }
    })
  }


  render() {
    const { values, detailsModalVisible, handleDetailsModalVisible, loading } = this.props;
    const { currentInfo } = this.state;
    const {
      RepitImageUrl,
      ProjectName,
      CardTypeName,
      VipName,
      SourceType,
      StoreName,
      SaleTimeSpan,
      ReciptCode,
      ProductCount,
      SaleAmt,
      ChangeScores,
      ExamineStatus,
    } = currentInfo;
    const imgSrc = RepitImageUrl ? `${Prefix + RepitImageUrl}` : "";
    return (
      <Modal
        width={970}
        destroyOnClose
        className={styles.review}
        title="详情"
        style={{ top: 40 }}
        visible={detailsModalVisible}
        onCancel={() => handleDetailsModalVisible(false, values)}
        afterClose={() => handleDetailsModalVisible()}
        bodyStyle={{
          padding: '22px 40px 2px'
        }}
        footer={null}
      >
        <Spin spinning={loading}>
          <Row gutter={[16, 8]}>
            <Col span={10} >
              <div className={styles.Viewer}>
                {
                  imgSrc ? <RcViewer options={options} >
                    <img src={imgSrc} alt="小票" style={{display: 'none'}}/>
                  </RcViewer> : <Empty description={"暂无图片"} />
                }
              </div>
            </Col>
            <Col span={14} style={{paddingLeft: 60}}>
              <Descriptions title={null} bordered column={2} >
                <Descriptions.Item label="审批状态" span={2} className={styles.des}>
                  <Tag
                    color={colorType[ExamineStatus]}
                    style={{fontSize: 14, lineHeight: 1.8}}
                  ><Icon type={iconType[ExamineStatus]} /> &nbsp;{textType[ExamineStatus]}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="项目名称" span={2}>{ProjectName}</Descriptions.Item>
                {/*<Descriptions.Item label="会员类型" span={2}>{CardTypeName}</Descriptions.Item>*/}
                <Descriptions.Item label="会员信息" span={2}>
                  {VipName}<Tag color="gold" style={{marginLeft: 10}}>{CardTypeName}</Tag>
                  </Descriptions.Item>

                <Descriptions.Item label="商铺名称" span={2}>{StoreName || '无'}</Descriptions.Item>
                <Descriptions.Item label="交易时间" span={2}>{SaleTimeSpan && moment(SaleTimeSpan).format(dateFormat)}</Descriptions.Item>
                <Descriptions.Item label="小票编码" span={2}>{ReciptCode}</Descriptions.Item>
                <Descriptions.Item label="积分来源" span={1}>{SourceCont[SourceType]}</Descriptions.Item>
                <Descriptions.Item label="商品数量" span={1}>{ProductCount}</Descriptions.Item>
                <Descriptions.Item label="销售金额" span={1}>{SaleAmt}</Descriptions.Item>
                <Descriptions.Item label="变动积分" span={1}>{ChangeScores}</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Spin>
      </Modal>
    );
  }
}

export default DetailsForm;
