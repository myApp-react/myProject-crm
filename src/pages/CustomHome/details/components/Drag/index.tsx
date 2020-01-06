import React, { PureComponent } from "react";
import { Button, Spin, Modal } from 'antd';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import styles from './index.less';
import { connect } from 'dva';
import { StateType } from '@/pages/CustomHome/details/model';
import { CarouselType, GridType } from '../../../data';
import { Action, Dispatch } from 'redux';

import Carousel from '../Carousel'
import Grid from '../Grid'
import Brand from '../Brand'
import TitleBar from '../TitleBar'
import Activity from '../Activity'
import TabBar from '../TabBar'
import MallList from '../MallList'
import { ActivityType, TitleType } from '@/pages/CustomHome/details/data';

const { confirm } = Modal;
const reorder = (list: any, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  // padding: grid,
  // margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "#fff",
  outline: isDragging ? "2px dashed #0E73FF" : "none",
  // boxShadow: isDragging ? "0 0 6px rgba(14, 115, 255, .6)" : "none",
  // outline: isDragging ? "2px dashed #0E73FF" : "2px dashed #fff",
  // outlineOffset: 0,

  // boxShadow: '0 0 6px rgba(63,70,82,.5)',
  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
  // marginBottom: '40px',
  padding: grid,
  width: '391px',
  minHeight: '500px',
  background: isDraggingOver ? "#F8D0D1" : "#F0F2F5",
  borderRadius: 8,
  boxShadow: 'inset 0 0 12px rgba(63,70,82,.5)',

});

interface DragState {
  initData: Array<any>
}

interface DragProps {
  // dispatch: Dispatch<
  //   Action<
  //     | 'customHomeDetails/add'
  //     | 'customHomeDetails/fetch'
  //     | 'customHomeDetails/remove'
  //     >
  //   >;
  initData: Array<any>;
  loading: boolean;
  handleEditCarousel: (e?: boolean, a?: CarouselType) => void;
  handleEditGrid: (e?: boolean, a?: GridType) => void;
  handleEditActivity: (e?: boolean, a?: ActivityType) => void;
  handleEditTitle: (e?: boolean, a?: TitleType) => void;
}

interface handleType {
  edit: () => void
  remove: () => void
  size?: string
}

const HandleMask = ({edit, remove, size}: handleType) => (
  <div className={styles.cover}>
    <div className={styles['cover-mask']} >
      <Button
        type="primary"
        shape="round"
        icon="form"
        size={size || 'default'}
        style={{marginRight: 12}}
        onClick={edit}
      >编辑</Button>
      <Button
        type="danger"
        shape="round"
        icon="delete"
        size={size || 'default'}
        onClick={remove}
      >删除</Button>
    </div>
  </div>
)


class DragComponent extends PureComponent<DragProps, DragState>{

  state: DragState = {
    initData: [],
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.initData !== prevState.initData){
      return {
        initData: nextProps.initData
      }
    }
    return null
  }

  onDragEnd = (result: any) => {
    const { handleRefresh, dispatch } = this.props;
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const initData = reorder(
      this.state.initData,
      result.source.index,
      result.destination.index
    );

    // dispatch({ type: 'pagesinfo/updateInit', payload: { initData }});
    // 同步后端 （后期优化点）
    // dispatch({ type: 'pagesinfo/sortByHandle', payload: { configJson: JSON.stringify(initData)}})
  }

  componentWillUnmount(){
    //销毁时清空
    // this.props.dispatch({ type: 'pagesinfo/updateInit', payload: { initData: []}})

  }

  HandleEditCarousel = () => {

  }

  HandleRemoveCarousel = () => {

  }


  renderComponent = (_: any) => {
    const { handleEditCarousel, handleEditGrid, handleEditActivity, handleEditTitle } = this.props
    return {
      1: <div className={styles.swiper} >
          <div className={styles['main-cover']}>
            <Carousel IsFloat={_.IsFloat} RollingTime={_.RollingTime} Images={_.Images} />
          </div>
          <HandleMask
            edit={() => handleEditCarousel(true, _)}
            remove={this.HandleRemoveCarousel}
          />
      </div>,
      2: <div className={styles.swiper}>
            <div className={styles['main-cover']}>
              <Grid
                BackgroundColor={_.BackgroundColor}
                StyleType={_.StyleType}
                RowShowType={_.RowShowType}
                FontSize={_.FontSize}
                Buttons={_.Buttons}
                FontColor={_.FontColor}
              />
            </div>
            <HandleMask edit={() => handleEditGrid(true, _)} remove={this.HandleRemoveCarousel}/>
          </div>,
      3: <div className={styles.swiper}>
          <div className={styles['main-cover']}>
            <Brand
              IsIcon={_.IsIcon}
              LogoColor={_.LogoColor}
              BackColor={_.BackColor}
              ShopPro={_.ShopPro}
              BranddetailUrl={_.BranddetailUrl}
            />
          </div>
        <HandleMask edit={this.HandleEditCarousel} remove={this.HandleRemoveCarousel}/>
      </div>,
      4: <div className={styles.swiper}>
        <div className={styles['main-cover']}>
          <TitleBar
            Fromabove={_.Fromabove}
            Istemplate={_.Istemplate}
            BackColor={_.BackColor}
            BackImage={_.BackImage}
            LeftImage={_.LeftImage}
            HeadLine={_.HeadLine}
            HeadLineSize={_.HeadLineSize}
            HeadLineColor={_.HeadLineColor}
            RightWord={_.RightWord}
            RightWordSize={_.RightWordSize}
            RightWordColor={_.RightWordColor}
            RightImage={_.RightImage}
            FuncLink={_.FuncLink}
          />
        </div>
        <HandleMask edit={() => handleEditTitle(true, _)} size={'small'} remove={this.HandleRemoveCarousel}/>
      </div>,
      5: <div className={styles.swiper}>
        <div className={styles['main-cover']}>
          <Activity Image={_.Image} Name={_.Name} />
        </div>
        <HandleMask edit={() => handleEditActivity(true, _)} remove={this.HandleRemoveCarousel}/>
      </div>,
      6: <div className={styles.swiper}>
          <div className={styles['main-cover']}>
            <MallList
              AccordingNum={_.AccordingNum}
              NameSize={_.NameSize}
              NameColor={_.NameColor}
              BtnNameSize={_.BtnNameSize}
              BtnNameColor={_.BtnNameColor}
              BtnBackColor={_.BtnBackColor}
              PointsSize={_.PointsSize}
              PointsColor={_.PointsColor}
              Style={_.Style}
            />
          </div>
          <HandleMask edit={this.HandleEditCarousel} remove={this.HandleRemoveCarousel}/>
      </div>,
      7: <div className={styles.swiper}>
          <div className={styles['main-cover']}>
            <TabBar
              BaseColor={_.BaseColor}
              FontSize={_.FontSize}
              FontColor={_.FontColor}
              SelectColor={_.SelectColor}
              Images={_.Images}
            />
          </div>
          <HandleMask edit={this.HandleEditCarousel} remove={this.HandleRemoveCarousel}/>
      </div>,
    }
  }

  render() {
    const { loading } = this.props
    const { initData } = this.state

    return (
      <Spin tip="Loading..." spinning={loading}>
        <div className={styles['drag-warp']}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided: any, snapshot: any) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {
                    initData.map((_, index) => (
                      <Draggable key={_.Id} draggableId={_.Id} index={index}>
                        {
                          (provided: any, snapshot: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              {this.renderComponent(_)[_.type]}
                            </div>
                          )
                        }
                      </Draggable>
                    ))
                  }
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </Spin>
    )
  }
}

export default DragComponent;
