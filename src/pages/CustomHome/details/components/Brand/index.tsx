import React, { PureComponent, Fragment } from "react";
import { Grid, Carousel } from 'antd-mobile';
import shortid from 'shortid';
import Swiper from 'react-id-swiper';

import { Prefix } from '@/utils/constant'
import style from './index.less'

const data = Array.from(new Array(8)).map((_val, i) => ({
  Id: shortid.generate(),
  icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
  text: `选项${i}`,
}));

interface BrandProps {
  IsIcon: number
  LogoColor: any
  BackColor: any
  ShopPro: any
  BranddetailUrl: any
}

class Brand extends PureComponent<BrandProps, {}> {

  renderByType = () => {
    const { LogoColor, BranddetailUrl, BackColor, ShopPro } = this.props;
    return {
      0: <Grid
        data={!ShopPro || ShopPro.length === 0 ? data : ShopPro}
        hasLine={false}
        className={style['brand-show-type-1']}
        activeStyle={false}
        square={false}
        style={{
          fontSize: 12,
          backgroundColor: BackColor || '#fff',
        }}
        renderItem={(dataItem: any) => (
          <div className={style.url}>
            <div className={style['brand-img-warp']}>
              <img src={ShopPro && ShopPro.length !== 0 ? Prefix + dataItem.LogoUrl : dataItem.icon}
                   className={style['brand-img']}
                   alt=""
              />
            </div>
          </div>
        )}
        itemStyle={{
          height: 78,
          background: BackColor || '#fff',
        }}
      />,
      1: <Carousel
        className={style['brand-show-type-2']}

        cellSpacing={0}
        slideWidth={.22}
        cellAlign={"left"}
        dots={false}
        style={{
          background: BackColor || '#fff'
        }}
      >
        { ShopPro && ShopPro.length !== 0 ?
          ShopPro.map((_: any, index: number) => (
            <a
              className={style['card-item-warp']}
              key={_.ShopPromotionId}
              style={{
                display: 'block',
                position: 'relative',
                paddingLeft: 10,
              }}
            >
              <div className={style['card-item']}>
                <div className={style['store-img']}><img src={Prefix + _.LogoUrl} alt=""/></div>
              </div>
            </a>
          )) : data.map((_, index) => (
            <div className="swiper-slide" key={_.Id}>
              <a
                className={style['card-item-warp']}
                style={{
                  display: 'block',
                  position: 'relative',
                  background: LogoColor || '#F0F2F5'
                }}
              >
                <div className={style['card-item']}>
                  <div className={style['store-img']}><img src={_.icon} alt=""/></div>
                </div>
              </a>
            </div>
          ))}
      </Carousel>,
      2: <Carousel
        className={style['brand-show-type-3']}
        cellSpacing={0}
        slideWidth={.4}
        cellAlign={"left"}
        dots={false}
        arrows={false}
        disableEdgeSwiping={true}
        prefixCls={"brand-show-2"}
        style={{
          background: BackColor || '#fff'
        }}
      >
        { ShopPro && ShopPro.length !== 0 ?
          ShopPro.map((_: any, index: number) => (
            <a
              key={_.Id}
              className={style['card-item-warp']}
              href={_.ShopPromotionId}
              style={{
                display: 'block',
                position: 'relative',
                paddingLeft: 10,
              }}
            >
              <div
                className={style['card-item']}
                style={{
                  background: LogoColor || '#F0F2F5'
                }}
              >
                <div className={style['store-img']}><img src={Prefix + _.LogoUrl} alt=""/></div>
                <div className={style['store-info']}>
                  <h3 className={style.title} style={{WebkitBoxOrient: 'vertical'}}>{_.StoreName}</h3>
                  <div className={style.describe} style={{WebkitBoxOrient: 'vertical'}}>{_.Describe}</div>
                </div>
              </div>
            </a>
          )) : data.map((_, index) => (
            <div className="swiper-slide" key={index}>
              <a
                className={style['card-item-warp']}
                style={{
                  display: 'block',
                  position: 'relative',
                  background: LogoColor || '#F0F2F5'
                }}
              >
                <div className={style['card-item']}>
                  <div className={style['store-img']}><img src={_.icon} alt=""/></div>
                  <div className={style['store-info']}>
                    <h3 className={style.title}>我是标题文字</h3>
                    <p className={style.describe}>这里放置的是一段描述性文字</p>
                  </div>
                </div>
              </a>
            </div>
          ))}
      </Carousel>,
      3: <Grid
        data={!ShopPro || ShopPro.length === 0 ? data : ShopPro}
        hasLine={false}
        className={style['brand-show-type-4']}
        columnNum={4}
        activeStyle={false}
        isCarousel={true}
        carouselMaxRow={ShopPro.length <= 4 ? 1 : 2}
        style={{
          background: BackColor || '#fff',
        }}
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
          <div className={style.url}>
            <div className={style['brand-img-warp']} style={{ background: LogoColor || '#F0F2F5'}}>
              <img src={ShopPro && ShopPro.length !== 0 ? Prefix + dataItem.LogoUrl : dataItem.icon} className={style['brand-img']} alt="" />
            </div>
            <div style={{ color: '#000000', fontSize: '12px', marginTop: 6 }}>
              <span className={style['item-text']} style={{WebkitBoxOrient: 'vertical'}}>{ShopPro && ShopPro.length !== 0 ? dataItem.StoreName : dataItem.text}</span>
            </div>
          </div>
        )}
        itemStyle={{
          height: 95,
          background: BackColor || '#fff',
        }}
      />
    }
  }

  render() {
    const { IsIcon } = this.props;
    return (
      <>
        { this.renderByType()[IsIcon]}
      </>
    )
  }
}

export default Brand;
