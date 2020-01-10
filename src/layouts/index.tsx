import React from 'react';
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';

const BasicLayout: React.FC = props => {
  return (
    <ConfigProvider
      locale={zhCN}
      autoInsertSpaceInButton={false}
    >

      {props.children}
    </ConfigProvider>
  );
};

export default BasicLayout;
