import { Form, Select, Switch, Drawer, Button, Avatar, Divider, Table, Popconfirm, Icon, Tooltip, Row, Col, message } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { orderBy } from 'lodash'

import { Prefix } from '@/utils/constant'
import styles from './index.less'
import { CarouselType } from '@/pages/CustomHome/data';
import { Action, Dispatch } from 'redux';
import { handleRefresh } from '@/utils';
import EditCarouselDrawer from './ChildrenDrawer/EditCarouselDrawer'
import AddCarouselDrawer from './ChildrenDrawer/AddCarouselDrawer'
import Carousel from '../Carousel'
import { CarouselDetailsType, ImagesType } from '@/pages/CustomHome/details/data';

const FormItem = Form.Item;

interface EditCarouselProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'customHomeDetails/add'
      | 'customHomeDetails/fetch'
      | 'customHomeDetails/remove'
      | 'customHomeDetails/edit'
      | 'customHomeDetails/saveConfig'
      | 'customHomeDetails/updateCarousel'
      >
    >;
  CarouseModalVisible: boolean;
  location: any;
  handleEditCarousel: (flag?: boolean, formVals?: CarouselType) => void;
  values: Partial<CarouselType>;
  carouselDetails: Partial<CarouselDetailsType>;
}

interface BodyRowProps {
  isOver: boolean
  connectDragSource: any
  connectDropTarget: any
  moveRow: any
  restProps: any
}

let dragingIndex = -1;


class BodyRow extends Component<BodyRowProps, {}> {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(<tr {...restProps} className={className} style={style} />),
    );
  }
}

const rowSource = {
  beginDrag(props: any) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props: any, monitor: any) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
);

interface CarouselChildState {
  EditCarouselModalVisible: boolean;
  AddCarouselModalVisible: boolean;
  CarouselChildFormValues: any;
}

class EditCarouselForm extends Component<EditCarouselProps, CarouselChildState> {

  state: CarouselChildState = {
    EditCarouselModalVisible: false,
    AddCarouselModalVisible: false,
    CarouselChildFormValues: {}
  }

  componentDidMount() {
    const { dispatch, values } = this.props
    dispatch({
      type: 'customHomeDetails/updateCarousel',
      payload: values
    })
  }

  components = {
    body: { row: DragableBodyRow }
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'OrderNo',
      width: 60,
    },
    {
      title: '缩略图',
      dataIndex: 'ImageUrl',
      width: 80,
      render: (e: string) => <Avatar src={`${Prefix + e}`}/>
    },
    {
      title: '滚动标题',
      dataIndex: 'Title',
    },
    {
      title: '打开链接',
      key: 'LinkType',
      dataIndex: 'LinkType',
      ellipsis: true,
      render: (text: number, record: any) => {
        if (text === 1) {
          return "无"
        } else if (text === 2) {
          return record.ShowFunctionName
        } else {
          return record.LinkUrl
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (text: any, record: any) => {
        return (
          <span>
            <a onClick={() => this.handleEditChildrenDrawe(true, record)}>编辑</a>
            <Divider type="vertical"/>
            <Popconfirm
              placement="topRight"
              title="确认删除该条数据?"
              onConfirm={() => this.handleRemoveChildrenDrawe(record)}
              okText="确定"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      },
    },
  ];

  handleEditChildrenDrawe = (flag?: boolean, record?: ImagesType) => {
    this.setState({
      EditCarouselModalVisible: !!flag,
      CarouselChildFormValues: record || {}
    })
  }

  /**删除轮播图内部方法*/
  handleRemoveChildrenDrawe = (record: ImagesType) => {
      const { dispatch, carouselDetails } = this.props;
      const { Images } = carouselDetails;
      const currImagesArr = [];
      const currImages = Images.filter((e) => e.Id !== record.Id);

      for(let i = 0, len = currImages.length; i < len; ++i){
        const arr = {
          ...currImages[i],
          OrderNo: (i + 1)
        }
        currImagesArr.push(arr)
      }
      dispatch({
        type: 'customHomeDetails/updateCarousel',
        payload: { ...carouselDetails, Images: currImagesArr }
      })
  }

  /**新增显隐控制*/
  handleAddCarouselModalVisible = (flag?: boolean) => {
    this.setState({
      AddCarouselModalVisible: !!flag
    })
  }

  /**新增轮播图方法*/
  handleAddImages = (fieldsValue: {
    Id: string,
    OrderNo: number,
    Title: string,
    ImageUrl: string,
    LinkType: number,
    FunctionType: number,
    LinkUrl: string,
    FunctionName: string,
    ShowFunctionName: string
  }) => {
    const { dispatch, carouselDetails } = this.props;
    const { Id, Images, ...rest } = carouselDetails;
    const newImages = { ...fieldsValue, RollingScreenConfigId: Id }
    const payload = {
      ...rest,
      Id,
      Images: [
        ...Images,
        newImages
      ]
    }
    dispatch({
      type: 'customHomeDetails/updateCarousel',
      payload
    })
    this.handleAddCarouselModalVisible()
  }

  /**编辑滚屏广告*/
  handleEditImages = (fieldsValue: ImagesType) => {
    const { dispatch, carouselDetails } = this.props;
    const { Images, ...rest } = carouselDetails;

    const ImageRest = Images.filter((e) => e.Id !== fieldsValue.Id)
    const newImages = [
      ...ImageRest,
      fieldsValue
    ]

    const currImages = orderBy(newImages, ['OrderNo'], ['asc']);
    const payload = {
      ...rest,
      Images: currImages
    }
    dispatch({
      type: 'customHomeDetails/updateCarousel',
      payload
    })
    // this.handleEditChildrenDrawe()
  }


  /**滚动屏 浮动切换*/
  handleGridswitch = (e: boolean) => {
    const { dispatch, carouselDetails } = this.props;
    const payload = {
      ...carouselDetails,
      IsFloat: e ? 1 : 0
    };
    dispatch({
      type: 'customHomeDetails/updateCarousel',
      payload
    })
  }

  /**滚动屏 滚动时间间隔*/
  handleSelectRollingTimes = (e: number) => {
    const { dispatch, carouselDetails } = this.props;
    const payload = {
      ...carouselDetails,
      RollingTime: e
    };
    dispatch({
      type: 'customHomeDetails/updateCarousel',
      payload
    })
  }

  /**移动行调整展示顺序*/
  moveRow = (dragIndex: any, hoverIndex: any) => {
    const { dispatch, carouselDetails } = this.props;
    const { Images } = carouselDetails;

    const dragRow = Images[dragIndex];
    const targetRow = Images[hoverIndex];

    const newEdit = update(carouselDetails, {
      Images: {
        $splice: [
          [dragIndex, 1, {...targetRow, OrderNo: dragIndex + 1}],
          [hoverIndex, 1, {...dragRow, OrderNo: hoverIndex + 1}]
        ],
      },
    })

    if(newEdit){
      dispatch({ type: 'customHomeDetails/updateCarousel', payload: newEdit })
    }
  };

  /**提交*/
  okHandle = () => {
    const { form, dispatch, handleEditCarousel, carouselDetails, location } = this.props
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields(); //重置表单
      const configJson = JSON.stringify(carouselDetails)
      dispatch({
        type: 'customHomeDetails/saveConfig',
        payload: {
          configJson
        },
        callback: () => {
          message.success('滚动屏设置成功')
          handleEditCarousel(false, carouselDetails);
          handleRefresh({}, location)
        }
      })
    });
  };

  render() {
    const { form, handleEditCarousel, CarouseModalVisible, carouselDetails } = this.props;
    const { IsFloat, RollingTime, Images } = carouselDetails ;
    const { CarouselChildFormValues, EditCarouselModalVisible, AddCarouselModalVisible} = this.state;

    return (
      <>
        <Drawer
          title="滚屏广告设置"
          width={720}
          onClose={() => handleEditCarousel(false, carouselDetails)}
          afterVisibleChange={(visible) => !visible && handleEditCarousel()}
          className={styles['drawer-warp']}
          visible={CarouseModalVisible}
          bodyStyle={{ paddingBottom: 80, position: 'relative' }}
        >
          <div className={styles['demo-drawer']}>
            <Carousel
              IsFloat={IsFloat}
              RollingTime={RollingTime}
              Images={Images}
            />
          </div>
          <div className={styles['divider-horizontal']} />
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label='开启浮动'>
                  {form.getFieldDecorator('IsFloat', {
                    valuePropName: 'checked',
                    initialValue: IsFloat !== 0
                  })(
                    <Switch checkedChildren="开" unCheckedChildren="关" onChange={this.handleGridswitch}/>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem  label='停留时长'>
                  {form.getFieldDecorator('RollingTime', {
                    initialValue: RollingTime || 1000
                  })(
                    <Select placeholder="请选择停留时长" style={{ width: 196 }} onChange={this.handleSelectRollingTimes}>
                      <Select.Option value={1000}>1000ms</Select.Option>
                      <Select.Option value={2000}>2000ms</Select.Option>
                      <Select.Option value={3000}>3000ms</Select.Option>
                      <Select.Option value={5000}>5000ms</Select.Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <div className={styles['divider-horizontal']} />
            <Row gutter={16}>
              <Col span={24}>
                <FormItem>
                  <Button
                    type="primary"
                    icon='plus-circle'
                    onClick={() => this.handleAddCarouselModalVisible(true)}
                    style={{marginRight: 12}}
                  >新增</Button>
                  <Tooltip title="移动行可调整显示顺序" placement='right'>
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem
                  labelCol={{ span: 0 }}
                  wrapperCol={{ span: 24 }}
                >
                  <DndProvider backend={HTML5Backend}>
                    <Table
                      columns={this.columns}
                      dataSource={Images}
                      components={this.components}
                      rowClassName="drag-table"
                      className={styles['drag-table']}
                      pagination={false}
                      rowKey={record => record.Id}
                      onRow={(record, index) => ({
                        index,
                        moveRow: this.moveRow,
                      })}
                    />
                  </DndProvider>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className={styles['submit-warp']}>
            <Button
              icon='close-circle'
              style={{marginRight: 12}}
              onClick={() => handleEditCarousel(false, carouselDetails)}
            >
              取消
            </Button>
            <Button icon='check-circle' type="primary" onClick={this.okHandle}>
              提交
            </Button>
          </div>
          <AddCarouselDrawer
            Images={Images}
            AddCarouselModalVisible={AddCarouselModalVisible}
            handleAddImages={this.handleAddImages}
            handleAddCarouselModalVisible={this.handleAddCarouselModalVisible}
          />
          {CarouselChildFormValues && Object.keys(CarouselChildFormValues).length ? (
            <EditCarouselDrawer
              EditCarouselModalVisible={EditCarouselModalVisible}
              CarouselChildFormValues={CarouselChildFormValues}
              handleEditImages={this.handleEditImages}
              handleEditChildrenDrawe={this.handleEditChildrenDrawe}
            />
          ) : null}

        </Drawer>
      </>
    );
  }
}

export default Form.create<EditCarouselProps>()(EditCarouselForm);


