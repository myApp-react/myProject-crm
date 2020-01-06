import React, { PureComponent } from 'react';
import { Card, Affix } from 'antd';
import { connect } from 'dva';
import { Action, Dispatch } from 'redux';

import MenuList from './components/MenuList'
import Drag from './components/Drag'
import { StateType } from '@/pages/CustomHome/details/model';
import { EditCarouselForm, EditGridForm, EditActivityForm, EditTitleForm } from './components/EditComponents'

import styles from './index.less';
import { CarouselType, GridType } from '@/pages/CustomHome/data';
import { ActivityType, TitleType } from '@/pages/CustomHome/details/data';


interface DetailsProps {
  dispatch: Dispatch<
    Action<
      | 'customHomeDetails/add'
      | 'customHomeDetails/fetch'
      | 'customHomeDetails/remove'
      | 'customHomeDetails/edit'
      | 'customHomeDetails/saveConfig'
      | 'customHomeDetails/updateCarousel'
      | 'customHomeDetails/updateGrid'
      | 'customHomeDetails/saveGridConfig'
      | 'customHomeDetails/getActivityList'
      >
    >;
  loading: boolean;
  location: any;
  customHomeDetails: StateType;
}

interface DetailsState {
  CarouseFormValues: Partial<CarouselType>;
  GridFormValues: Partial<GridType>;
  CarouseModalVisible: boolean;
  GridModalVisible: boolean;
  ActivityModalVisible: boolean;
  ActivityFormValues: Partial<ActivityType>;
  TitleModalVisible: boolean;
  TitleFormValues: Partial<TitleType>;
}

@connect(
  ({
     customHomeDetails,
     loading,
   }: {
    customHomeDetails: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
      effects: { [key: string]: boolean | undefined };
    };
  }) => ({
    customHomeDetails,
    loading,
  }),
)
class Details extends PureComponent<DetailsProps, DetailsState>{

  state: DetailsState = {
    CarouseModalVisible: false,
    CarouseFormValues: {},
    GridModalVisible: false,
    GridFormValues: {},
    ActivityModalVisible: false,
    ActivityFormValues: {},
    TitleModalVisible: false,
    TitleFormValues: {},
  }

  handleEditCarousel = (flag?: boolean, record?: CarouselType) => {
    this.setState({
      CarouseModalVisible: !!flag,
      CarouseFormValues: record || {}
    })
  }

  handleEditGrid = (flag?: boolean, record?: GridType) => {
    this.setState({
      GridModalVisible: !!flag,
      GridFormValues: record || {}
    })
  }

  /**编辑活动*/
  handleEditActivity = (flag?: boolean, record?: ActivityType) => {
    this.setState({
      ActivityModalVisible: !!flag,
      ActivityFormValues: record || {}
    })
  }

  /**编辑标题栏*/
  handleEditTitle = (flag?: boolean, record?: ActivityType) => {
    this.setState({
      TitleModalVisible: !!flag,
      TitleFormValues: record || {}
    })
  }


  render() {
    const {
      CarouseFormValues,
      GridFormValues,
      CarouseModalVisible,
      GridModalVisible,
      ActivityFormValues,
      ActivityModalVisible,
      TitleFormValues,
      TitleModalVisible
    } = this.state;
    const { customHomeDetails, dispatch, loading, location } = this.props;
    const { initData, ActivityList, carouselDetails, gridDetails, activityDetails, titleDetails } = customHomeDetails;

    const DragProps = {
      initData,
      loading: loading.effects['customHomeDetails/fetch'],
      handleEditCarousel: this.handleEditCarousel,
      handleEditGrid: this.handleEditGrid,
      handleEditActivity: this.handleEditActivity,
      handleEditTitle: this.handleEditTitle,
    }

    const editCarouselMethods = {
      dispatch,
      handleEditCarousel: this.handleEditCarousel,
    }

    const editGridMethods = {
      dispatch,
      handleEditGrid: this.handleEditGrid
    }

    const editActivityMethods = {
      dispatch,
      loading: loading.effects['customHomeDetails/getActivityList'],
      ActivityList,
      handleEditActivity: this.handleEditActivity
    }

    const editTitleMethods = {
      dispatch,
      handleEditTitle: this.handleEditTitle,
    }

    return (
      <Card bordered={false}>
        <div className={styles['main-flex-warp']}>
          <div className={styles['flex-menu']}>
            <Affix offsetTop={30}>
              <MenuList />
            </Affix>
          </div>
          <div className={styles['flex-cont']}><Drag {...DragProps}/></div>
          <div className={styles['flex-auto']}>
            {CarouseFormValues && Object.keys(CarouseFormValues).length ? (
              <EditCarouselForm
                {...editCarouselMethods}
                location={location}
                carouselDetails={carouselDetails}
                CarouseModalVisible={CarouseModalVisible}
                values={CarouseFormValues}
              />
            ) : null}
            {GridFormValues && Object.keys(GridFormValues).length ? (
              <EditGridForm
                {...editGridMethods}
                location={location}
                gridDetails={gridDetails}
                GridModalVisible={GridModalVisible}
                values={GridFormValues}
              />
            ) : null}
            {
              ActivityFormValues && Object.keys(ActivityFormValues).length ? (
                <EditActivityForm
                  {...editActivityMethods}
                  location={location}
                  activityDetails={activityDetails}
                  ActivityModalVisible={ActivityModalVisible}
                  values={ActivityFormValues}
                />
              ) : null
            }
            {
              TitleFormValues && Object.keys(TitleFormValues).length ? (
                <EditTitleForm
                  {...editTitleMethods}
                  location={location}
                  titleDetails={titleDetails}
                  values={TitleFormValues}
                  TitleModalVisible={TitleModalVisible}
                />
              ) : null
            }
          </div>
        </div>
      </Card>
    )
  }
}

export default Details
