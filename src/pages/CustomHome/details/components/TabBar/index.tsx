import React, { PureComponent } from "react";
import { TabBar } from 'antd-mobile';

import { Prefix } from '@/utils/constant'
import style from './index.less';

const defaultTab = [
  {
    title: '标题',
    key: 1,
    icon: "https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg",
    selectIcon: "https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg"
  },
  {
    title: '标题2',
    key: 2,
    icon: "https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg",
    selectIcon: "https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg"
  },
  {
    title: '标题3',
    key: 3,
    icon: "https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg",
    selectIcon: "https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg"
  },
];

interface BottomTabsProps {
  BaseColor: any
  FontSize: any
  FontColor: any
  SelectColor: any
  Images: any
}

export default class TitleDrawer extends PureComponent<BottomTabsProps, {}> {

  render() {
    const { BaseColor, SelectColor, FontSize, FontColor, Images  } = this.props;

    return (
      <TabBar
        className={style.tabbar}
        unselectedTintColor={FontColor}
        tintColor={SelectColor ? SelectColor : "#33A3F4"}
        barTintColor={BaseColor}
      >
        {
          Images.length !== 0 ?
            Images.map((_: any, i: number) => (
              <TabBar.Item
                title={_.btnName}
                key={_.Id}
                icon={<div style={{
                  width: '24px',
                  height: '24px',
                  background: `url("${(Prefix + _.ImageUrl)}") center center /  21px 21px no-repeat` }}
                />
                }
                selectedIcon={
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: `url("${(Prefix + _.SelectImageUrl)}") center center /  21px 21px no-repeat` }}
                  >
                  </div>
                }
                selected={i === 0}
                data-seed={_.Id}
              />
            ))
            : defaultTab.map(_ => (
              <TabBar.Item
                title={_.title}
                key={_.key}
                icon={<div style={{
                  width: '24px',
                  height: '24px',
                  background: 'url('+ _.icon + ') center center /  21px 21px no-repeat' }}
                />}
                selectedIcon={
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: 'url('+ _.selectIcon + ') center center /  21px 21px no-repeat' }}
                  />
                }
                selected={_.title === "标题"}
                data-seed={_.key}
              />
            ))
        }
      </TabBar>
    )
  }
};
