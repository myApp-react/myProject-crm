import { message } from 'antd'
export const dva = {
  config: {
    onError(err: ErrorEvent) {
      // err.preventDefault();
      console.log(err)
      message.error(err.message);
    },
  },
};
