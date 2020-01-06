import { IConfig } from 'umi-types'; // ref: https://umijs.org/config/

const config: IConfig = {
  publicPath: '/project_crm/',
  outputPath: './project_crm',
  targets: {
    android: 5,
    chrome: 58,
    edge: 13,
    firefox: 45,
    ie: 9,
    ios: 7,
    safari: 10,
  },
  history: 'hash',
  hash: true,
  ignoreMomentLocale: true,
  treeShaking: true,
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        {
          name: '积分补录',
          path: '/integral',
          component: './Integral',
        },
        {
          name: '自定义首页',
          path: '/customhome',
          component: './CustomHome',
        },
        {
          name: '详情页',
          path: '/customhome/details/:id',
          component: './CustomHome/details',
        },
        {
          name: '抽奖活动',
          path: '/sweepstakes',
          component: './SweepStakes/_layout',
          routes: [
            {
              path: '/sweepstakes',
              component: './SweepStakes/index',
            },
            {
              name: '抽奖活动详细信息',
              path: '/sweepstakes/details/:id',
              component: './SweepStakes/Details',
            },
            {
              name: '抽奖活动配置',
              path: '/sweepstakes/lotteryconfig/:id',
              component: './SweepStakes/LotteryConfig',
            },
          ],
        },
        {
          name: '查询表格',
          path: '/cashcoupons',
          component: './CashCoupons',
        },
        {
          path: '/',
          component: '../pages/index',
        },
        {
          path: '/404',
          component: '../pages/404',
        },
      ],
    },
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
          immer: true,
        },
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
          webpackChunkName: true,
          level: 3,
        },
        title: 'myapp-crm',
        dll: true,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /data.d\.(t|j)sx?$/,
            /_mock\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
  disableRedirectHoist: true,
  theme: {
    '@modal-mask-bg': 'rgba(0,0,0,.2)',
    '@border-radius-base': '2px',
    '@modal-header-bg': '#F8F8F8',
    '@modal-header-border-color-split': '#F8F8F8',
  },
  define: {
    'process.env.Prefix': '/ydh',
  },
  proxy: {
    '/ydh': {
      target: 'http://120.26.211.143:5001',
      changeOrigin: true,
      pathRewrite: {
        '^/ydh': '/',
      },
    },
    '/wx': {
      target: 'http://ydhtest.fetower.com',
      changeOrigin: true,
      pathRewrite: {
        '^/wx': '/',
      },
    },
  },
};
export default config;

