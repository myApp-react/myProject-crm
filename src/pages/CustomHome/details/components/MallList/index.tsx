/**
 * 模板列表
 * */
import React, { memo } from 'react';
import { Button } from 'antd-mobile';
import { Icon } from 'antd';

import { Prefix } from '@/utils/constant'
import style from './index.less';

const renderHtml = (type, num, NameSize, NameColor, BtnNameSize, BtnNameColor, BtnBackColor, PointsSize, PointsColor) => {
    let htmlData = [];
    for(let i = 0; i < num; ++i){
      if(type === 2){
        htmlData.push(
          <div key={i} className={style['maillist-two']}>
            <div className={style['mall-list']}>
              <div className={style['mall-list-img']}>
                <Icon type="picture" style={{fontSize: 46}}/>
              </div>
              <div className={style['mall-list-main']}>
                <h3 className={style['mall-list-title']} style={{WebkitBoxOrient: 'vertical', color: NameColor, fontSize: NameSize}}>我是标题</h3>
                <p className={style['mall-list-integral']} style={{fontSize: PointsSize, color: PointsColor}}>5000积分</p>
                <div className={style['mall-list-btn']}>
                  <Button
                    type="primary"
                    size="small"
                    inline
                    style={{
                      fontSize: BtnNameSize,
                      color: BtnNameColor,
                      background: BtnBackColor,
                      border: 'none',
                      borderRadius: 2,
                      padding: '0 10px'
                    }}>立即兑换</Button>
                </div>
              </div>
            </div>
          </div>
        )
      }else {
        htmlData.push(
          <div key={i} className={style['maillist-one']}>
            <div className={style['mall-list-col']}>
              <div className={style['mall-list-img']}>
                <div className={style['list-img']}>
                  <Icon type="picture" style={{fontSize: 60}}/>
                </div>
              </div>
              <div className={style['list-main']}>
                <h3 className={style.title} style={{WebkitBoxOrient: 'vertical', fontSize: NameSize, color: NameColor}}>我是标题</h3>
                <p className={style.integral} style={{fontSize: PointsSize, color: PointsColor}}>5000积分</p>
                <div className={style['mall-list-btn']}>
                  <Button
                    type="primary"
                    size="small"
                    inline
                    style={{
                      fontSize: BtnNameSize,
                      color: BtnNameColor,
                      background: BtnBackColor,
                      border: 'none',
                      borderRadius: 2,
                      padding: '0 10px'
                    }}>立即兑换</Button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }
    return htmlData
};
// AccordingNum={_.AccordingNum}
// NameSize={_.NameSize}
// NameColor={_.NameColor}
// BtnNameSize={_.BtnNameSize}
// BtnNameColor={_.BtnNameColor}
// BtnBackColor={_.BtnBackColor}
// PointsSize={_.PointsSize}
// PointsColor={_.PointsColor}
// Style={_.Style}

interface MallListProps {
  AccordingNum: any
  NameSize: any
  NameColor: any
  BtnNameSize: any
  BtnNameColor: any
  BtnBackColor: any
  PointsSize: any
  PointsColor: any
  Style: any
}


export default memo((props: MallListProps) => {
  const { AccordingNum, NameSize, NameColor, BtnNameSize, BtnNameColor, BtnBackColor, PointsSize, PointsColor, Style, GiftDetialUrl, Gifts, commonUrl } = props;

  const renderUrl = (Id) => {
    return commonUrl && GiftDetialUrl ? `${GiftDetialUrl}?giftId=${Id}` : "javascript:void(0)"
  }

  return (
    <div className={style['mall-warp']}>
      {
        Style === 1 ? Gifts && Gifts.map((_: any) => (
          <a href={'javascript:void(0)'} key={_.GiftId} className={style['maillist-one']}>
            <div className={style['mall-list-col']}>
              <div className={style['mall-list-img']}>
                <div className={style['list-img']}>
                  <img src={(Prefix + _.GiftImage)} alt=""/>
                </div>
              </div>
              <div className={style['list-main']}>
                <h3 className={style.title} style={{WebkitBoxOrient: 'vertical', fontSize: NameSize, color: NameColor}}>{_.GiftName}</h3>
                <p className={style.integral} style={{fontSize: PointsSize, color: PointsColor}}>{_.NeedSocres} 积分</p>
                <div className={style['mall-list-btn']}>
                  <Button
                    type="primary"
                    size="small"
                    inline
                    style={{
                      fontSize: BtnNameSize,
                      color: BtnNameColor,
                      background: BtnBackColor,
                      border: 'none',
                      borderRadius: 2,
                      padding: '0 10px'
                    }}>立即兑换</Button>
                </div>
              </div>
            </div>
          </a>
        )) : null
      }
      {
        Style === 2 ? Gifts && Gifts.map(_ => (
          <a href={renderUrl(_.GiftId)} key={_.GiftId} className={style['maillist-two']}>
            <div className={style['mall-list'] + ' ' + style['mall-list-border']}>
              <div className={style['mall-list-img']}>
                <img src={(Prefix + _.GiftImage)} alt=""/>
              </div>
              <div className={style['mall-list-main']}>
                <h3 className={style['mall-list-title']} style={{WebkitBoxOrient: 'vertical', color: NameColor, fontSize: NameSize}}>{_.GiftName}</h3>
                <p className={style['mall-list-integral']} style={{fontSize: PointsSize, color: PointsColor}}>{_.NeedSocres} 积分</p>
                <div className={style['mall-list-btn']}>
                  <Button
                    type="primary"
                    size="small"
                    inline
                    style={{
                      fontSize: BtnNameSize,
                      color: BtnNameColor,
                      background: BtnBackColor,
                      border: 'none'
                    }}>立即兑换</Button>
                </div>
              </div>
            </div>
          </a>
        )) : null
      }
      {
        !Gifts ? renderHtml(Style, AccordingNum, NameSize, NameColor, BtnNameSize, BtnNameColor, BtnBackColor, PointsSize, PointsColor) : null
      }
      {/*{ renderHtml(Style, AccordingNum, NameSize, NameColor, BtnNameSize, BtnNameColor, BtnBackColor, PointsSize, PointsColor) }*/}
    </div>
  )
});
