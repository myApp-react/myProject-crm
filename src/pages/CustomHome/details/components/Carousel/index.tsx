import React, { memo } from 'react';
import { Carousel } from 'antd-mobile';

import { Prefix } from '@/utils/constant'
import arcImg from '@/assets/mobile/swiper-arc-img.png';
import styles from './index.less'

const defaultData: Array<string> = ['1', '2', '3']

interface CarouselProps {
  IsFloat: number
  RollingTime: any
  Images: Array<any>
}

export default (props: CarouselProps) => {

  const { IsFloat, RollingTime, Images } = props;
  return (
    <div className={styles.carousel}>
      <Carousel
        autoplay={true}
        infinite
        autoplayInterval={RollingTime || 3000}
        dotStyle={{
          width: 6,
          height: 6,
          background: 'rgba(255,255,255,.6)',
        }}
        dotActiveStyle={{
          width: 6,
          height: 6,
          background: 'rgba(255,255,255,1)',
        }}
      >
        {
          Images.length !== 0 ? Images.map(_ => (
            <div
              key={_}
              style={{ display: 'inline-block', width: '100%', height: 180, }}
            >
              <img
                src={`${Prefix + _.ImageUrl}`}
                alt=""
                style={{ width: '100%', height: 180, objectFit: 'cover',verticalAlign: 'top' }}
              />
            </div>
          )) : defaultData.map(_ => (
            <div
              key={_}
              style={{ display: 'inline-block', width: '100%', height: 180, }}
            >
              <img
                src={`https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png`}
                alt=""
                style={{ width: '100%', height: 180, objectFit: 'cover',verticalAlign: 'top' }}
              />
            </div>
          ))
        }
      </Carousel>
      {
        IsFloat === 1 ? <img src={arcImg} className={styles.arcimg} alt="圆弧图片"/> : null
      }
    </div>
  );
}
