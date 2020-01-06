import React, { memo } from 'react'
import { Grid } from 'antd-mobile';

import { Prefix } from '@/utils/constant'
import styles from './index.less'

interface gridProps {
  BackgroundColor: any,
  Buttons: Array<any>,
  FontSize: any,
  StyleType: any,
  RowShowType: any,
  FontColor: any,
}

/**默认占位数据 不滚动*/
const defaultData = {
  5: Array.from(new Array(10)).map((_val, i) => ({
    ImageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    Name: `功能${i}`,
  })),
  4: Array.from(new Array(8)).map((_val, i) => ({
    ImageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    Name: `功能${i}`,
  })),
  3: Array.from(new Array(6)).map((_val, i) => ({
    ImageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    Name: `功能${i}`,
  })),
}
/**默认占位数据 滚动*/
const defaultRowData = {
  5: Array.from(new Array(20)).map((_val, i) => ({
    ImageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    Name: `功能${i}`,
  })),
  4: Array.from(new Array(16)).map((_val, i) => ({
    ImageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    Name: `功能${i}`,
  })),
  3: Array.from(new Array(12)).map((_val, i) => ({
    ImageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    Name: `功能${i}`,
  })),
}




export default memo((props: gridProps) => {

  const { BackgroundColor, Buttons, FontSize, StyleType, RowShowType, FontColor } = props
  const isCarousel = RowShowType !== 0;
  const holdDefaultData = RowShowType === 1 ? defaultRowData[StyleType] : defaultData[StyleType]
  const GridData = Buttons.length === 0 ? holdDefaultData : Buttons;

  return (
    <div
      className={styles.container}
      style={{ background: BackgroundColor }}
    >
      <Grid
        data={GridData}
        hasLine={false}
        columnNum={StyleType || 5}
        isCarousel={isCarousel}
        carouselMaxRow={2}
        swipeSpeed={20}
        square={false}
        dotStyle={{
          width: 15,
          height: 2,
          margin: 0,
          borderRadius: 0,
        }}
        dotActiveStyle={{
          width: 15,
          height: 2,
          margin: 0,
          borderRadius: 0,
        }}
        renderItem={(dataItem: any) => (
          <div style={{ padding: '0' }}>
            <img src={Buttons.length === 0 ? dataItem.ImageUrl : (Prefix + dataItem.ImageUrl)} style={{ width: '40px', height: '40px' }} alt="" />
            <div className={styles['grid-text-wrap']} style={{ color: FontColor || '#000000', fontSize: FontSize || 14,}}>
              <span className={styles['grid-text']} style={{WebkitBoxOrient: 'vertical'}}>{dataItem.Name}</span>
            </div>
          </div>
        )}
        itemStyle={{
          height: 73,
          background: BackgroundColor,
          color: "#fff"
        }}
      />
    </div>
  )
});
