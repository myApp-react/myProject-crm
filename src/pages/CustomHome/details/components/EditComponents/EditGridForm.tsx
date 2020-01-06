import {
  Form,
  Select,
  Drawer,
  Radio,
  Button,
  Avatar,
  Divider,
  Table,
  Popconfirm,
  Icon,
  Tooltip,
  message,
} from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { CompactPicker } from 'react-color';
import { orderBy } from 'lodash';

import { Prefix, bgPicker, colorPicker } from '@/utils/constant'
import styles from './index.less'
import { CarouselType, GridType } from '@/pages/CustomHome/data';
import { Action, Dispatch } from 'redux';
import { ButtonsType, GridDetailsType, ImagesType } from '@/pages/CustomHome/details/data';
import Grid from '@/pages/CustomHome/details/components/Grid';
import AddGridDrawer from './ChildrenDrawer/AddGridDrawer';
import EditGridDrawer from './ChildrenDrawer/EditGridDrawer';
import { handleRefresh } from '@/utils';

const FormItem = Form.Item;

interface EditGridProps extends FormComponentProps {
  // initData: Array<any>;
  // handleAdd: (fieldsValue: { ConfigName: string }) => void;
  // handleSelectRollingTimes: (Id: string, e: boolean) => void;
  dispatch: Dispatch<
    Action<
      | 'customHomeDetails/updateGrid'
      | 'customHomeDetails/saveGridConfig'
      >
    >;
  location: any;
  handleEditGrid: (flag?: boolean, formVals?: CarouselType) => void;
  values: Partial<GridType>;
  gridDetails: GridDetailsType;
  GridModalVisible: boolean;
}

interface EditGridState {
  AddGridModalVisible: boolean;
  EditGridModalVisible: boolean;
  EditGridChildFormValues: Partial<ButtonsType>;
}

interface BodyRowProps {
  isOver: boolean;
  connectDragSource: any;
  connectDropTarget: any;
  moveRow: any;
  restProps: any;
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

class EditGridForm extends Component<EditGridProps, EditGridState> {
  state: EditGridState = {
    AddGridModalVisible: false,
    EditGridModalVisible: false,
    EditGridChildFormValues: {},
  };

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
      dataIndex: 'Name',
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
            <a
              onClick={e => this.handleEditGridModalVisible(true, record)}
            >编辑</a>
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

  componentDidMount() {
    const { dispatch, values } = this.props
    dispatch({
      type: 'customHomeDetails/updateGrid',
      payload: values
    })
  }

  /**排序*/
  moveRow = (dragIndex: any, hoverIndex: any) => {
    const { gridDetails, dispatch } = this.props;
    const { Buttons } = gridDetails;
    const dragRow = Buttons[dragIndex];
    const targetRow = Buttons[hoverIndex];

    const newEdit = update(gridDetails, {
      Buttons: {
        $splice: [
          [dragIndex, 1, {...targetRow, OrderNo: dragIndex + 1}],
          [hoverIndex, 1, {...dragRow, OrderNo: hoverIndex + 1}]
        ],
      },
    })
    if(newEdit){
      dispatch({ type: 'customHomeDetails/updateGrid', payload: newEdit })
    }
  };

  /**提交表单*/
  okHandle = () => {
    const { form, dispatch, gridDetails, handleEditGrid, location } = this.props
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const modelJson = JSON.stringify(gridDetails)
      dispatch({
        type: 'customHomeDetails/saveGridConfig',
        payload: {
          modelJson
        },
        callback: () => {
          message.success('功能模块设置成功')
          handleEditGrid(false, gridDetails)
          handleRefresh({}, location)
        }
      })
    });
  };

  /**删除轮播图内部方法*/
  handleRemoveChildrenDrawe = (record: ImagesType) => {
    const { dispatch, gridDetails } = this.props;
    const { Buttons } = gridDetails;
    const currImagesArr = [];
    const currImages = Buttons.filter((e: any) => e.Id !== record.Id);

    for(let i = 0, len = currImages.length; i < len; ++i){
      const arr = {
        ...currImages[i],
        OrderNo: (i + 1)
      }
      currImagesArr.push(arr)
    }
    dispatch({
      type: 'customHomeDetails/updateGrid',
      payload: { ...gridDetails, Buttons: currImagesArr }
    })
  }

  /**样式选择切换*/
  handleSwitchStyle = (e: any) => {
    const { gridDetails, dispatch } = this.props;
    const StyleType = e.target.value;
    const payload = {
      ...gridDetails,
      StyleType
    };
    dispatch({
      type: 'customHomeDetails/updateGrid',
      payload
    })
  }

  /**超出显示模式*/
  handleRowShowType = (e: any) => {
    const { gridDetails, dispatch } = this.props;
    const RowShowType = e.target.value;
    const payload = {
      ...gridDetails,
      RowShowType
    };
    dispatch({
      type: 'customHomeDetails/updateGrid',
      payload
    })
  }

  /**底色设置*/
  handleBgColorChangeComplete = (color: {hex: string}) => {
    const BackgroundColor = color.hex;
    const { dispatch, gridDetails } = this.props;
    const payload = {
      ...gridDetails,
      BackgroundColor
    };
    dispatch({
      type: 'customHomeDetails/updateGrid',
      payload
    })
  };

  /**字体大小设置*/
  handleFontSizeChange = (value: number) => {
    const { dispatch, gridDetails } = this.props;
    const FontSize = value;
    const payload = {
      ...gridDetails,
      FontSize
    };
    dispatch({
      type: 'customHomeDetails/updateGrid',
      payload
    })
  }

  /**字体颜色设置*/
  handleFontColorChangeComplete = (color: {hex: string}) => {
    const FontColor = color.hex;
    const { dispatch, gridDetails } = this.props;
    const payload = {
      ...gridDetails,
      FontColor
    };
    dispatch({
      type: 'customHomeDetails/updateGrid',
      payload
    })
  }

  /**新增显隐控制*/
  handleAddGridModalVisible = (flag?: boolean) => {
    this.setState({
      AddGridModalVisible: !!flag
    })
  }

  /**新增功能模块*/
  handleAddButtons = (fieldsValue: ButtonsType) => {
    const { dispatch, gridDetails } = this.props;
    const { Id, Buttons, ...rest } = gridDetails;
    const newImages = { ...fieldsValue, ModelId: Id }
    const payload = {
      ...rest,
      Id,
      Buttons: [
        ...Buttons,
        newImages
      ]
    }
    dispatch({
      type: 'customHomeDetails/updateGrid',
      payload
    })
    this.handleAddGridModalVisible();
  }

  /**编辑功能模块*/
  handleEditButtons = (fieldsValue: ButtonsType) => {
    const { dispatch, gridDetails } = this.props;
    const { Buttons, ...rest } = gridDetails;
    const ButtonsRest = Buttons.filter((e) => e.Id !== fieldsValue.Id)
    const newButtons = [
      ...ButtonsRest,
      fieldsValue
    ]

    const currButtons = orderBy(newButtons, ['OrderNo'], ['asc']);
    const payload = {
      ...rest,
      Buttons: currButtons,
    }
    dispatch({
      type: 'customHomeDetails/updateGrid',
      payload
    })

  }

  /**编辑功能模块*/
  handleEditGridModalVisible = (flag?: boolean, record?: ButtonsType) => {
    this.setState({
      EditGridModalVisible: !!flag,
      EditGridChildFormValues: record || {},
    });
  }

  render() {
    const { form, GridModalVisible, handleEditGrid, gridDetails } = this.props;
    const { StyleType, RowShowType, BackgroundColor, FontSize, FontColor, Buttons } = gridDetails;
    const { AddGridModalVisible, EditGridChildFormValues, EditGridModalVisible } = this.state;

    const GridProps = {
      BackgroundColor,
      Buttons,
      FontSize,
      StyleType,
      RowShowType,
      FontColor
    }

    return (
      <>
        <Drawer
          title="功能模块设置"
          width={720}
          onClose={() => handleEditGrid(false, gridDetails)}
          afterVisibleChange={(visible) => !visible && handleEditGrid()}
          className={styles['drawer-warp']}
          visible={GridModalVisible}
          bodyStyle={{ paddingBottom: 80, position: 'relative' }}
        >
          <div className={styles['demo-drawer']}>
            <Grid {...GridProps} />
          </div>
          <div className={styles['divider-horizontal']} />
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label='样式选择（每行）'>
            {form.getFieldDecorator('StyleType', {
              rules: [{ required: true, message: 'Please enter user name' }],
              initialValue: StyleType
            })(
              <Radio.Group buttonStyle="solid" onChange={this.handleSwitchStyle}>
                <Radio.Button value={5}>5个图标</Radio.Button>
                <Radio.Button value={4}>4个图标</Radio.Button>
                <Radio.Button value={3}>3个图标</Radio.Button>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label='超出显示模式'>
            {form.getFieldDecorator('RowShowType', {
              rules: [{ required: true, message: 'Please enter user name' }],
              initialValue: RowShowType
            })(
              <Radio.Group buttonStyle="solid" onChange={this.handleRowShowType}>
                <Radio.Button value={0}>分行显示</Radio.Button>
                <Radio.Button value={1}>滚动显示</Radio.Button>
              </Radio.Group>
            )}
          </FormItem>
          <div className={styles['divider-horizontal']} />
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label='底色设置'>
            {form.getFieldDecorator('BackgroundColor', {
              initialValue: BackgroundColor
            })(
              <CompactPicker
                color={BackgroundColor}
                colors={bgPicker}
                className={styles['color-picker']}
                onChange={this.handleBgColorChangeComplete}
              />
            )}
          </FormItem>
          <div className={styles['divider-horizontal']} />
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label='字体大小设置'>
            {form.getFieldDecorator('FontSize', {
              initialValue: FontSize
            })(
              <Select placeholder="请选择字体大小" onChange={this.handleFontSizeChange} style={{width: 200}}>
                <Select.Option value={12}>12px</Select.Option>
                <Select.Option value={13}>13px</Select.Option>
                <Select.Option value={14}>14px</Select.Option>
                <Select.Option value={15}>15px</Select.Option>
                <Select.Option value={16}>16px</Select.Option>
                <Select.Option value={18}>18px</Select.Option>
              </Select>
            )}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label='字体颜色设置'>
            {form.getFieldDecorator('FontColor', {
              initialValue: FontColor || "#000"
            })(
              <CompactPicker
                color={FontColor || "#000"}
                colors={colorPicker}
                className={styles['color-picker']}
                onChange={this.handleFontColorChangeComplete}
              />
            )}
          </FormItem>
          <div className={styles['divider-horizontal']} />
          <FormItem
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
          >
            <div className={styles['handle-warp']}>
              <Button type="primary" icon='plus' style={{marginRight: 12}} onClick={() => this.handleAddGridModalVisible(true)}>新增</Button>
              <Tooltip title="移动行可调整显示顺序" placement='right'>
                <Icon type="question-circle-o" />
              </Tooltip>
            </div>
          </FormItem>
          <FormItem
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
          >
            <DndProvider backend={HTML5Backend}>
              <Table
                columns={this.columns}
                dataSource={Buttons}
                components={this.components}
                rowClassName="drag-table"
                className={styles['drag-table']}
                pagination={false}
                rowKey={(record: any) => record.Id}
                onRow={(record: any, index: any) => ({
                  index,
                  moveRow: this.moveRow,
                })}
              />
            </DndProvider>
          </FormItem>
          <div className={styles['submit-warp']}>
            <Button style={{marginRight: 12}} icon='close-circle' onClick={() => handleEditGrid(false, gridDetails)}>
              取消
            </Button>
            <Button type="primary" icon='check-circle' onClick={this.okHandle}>提交</Button>
          </div>
          <AddGridDrawer
            Buttons={Buttons}
            AddGridModalVisible={AddGridModalVisible}
            handleAddGridModalVisible={this.handleAddGridModalVisible}
            handleAddButtons={this.handleAddButtons}
          />
          {
            EditGridChildFormValues && Object.keys(EditGridChildFormValues).length ?
              <EditGridDrawer
                EditGridChildFormValues={EditGridChildFormValues}
                EditGridModalVisible={EditGridModalVisible}
                handleEditGridModalVisible={this.handleEditGridModalVisible}
                handleEditButtons={this.handleEditButtons}
              /> : null
          }
        </Drawer>
      </>
    );
  }
}

export default Form.create<EditGridProps>()(EditGridForm);


