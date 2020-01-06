import React, { memo } from 'react'

import style from './index.less';
import { Prefix } from '@/utils/constant'
import activityImg from '@/assets/mobile/swiper-banner.png'

interface ActivityProps {
  Image: any,
  Name: any
}

export default memo((props: ActivityProps) => {
  const { Image, Name } = props;
  return (
    <a className={style.url}>
      <div className={style['item-list-warp']}>
        <div className={style['item-img']}>
          <img src={Image ? Prefix + Image : activityImg} alt=""/>
        </div>
        <p className={style['item-label']}>
          <span className={style['item-label-text']}>{Name ? Name : '推荐活动描述'}</span>
        </p>
      </div>
    </a>
  )
})
