import {
  Form,
  Select,
  Drawer,
  Button,
  Spin,
  message
} from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import { Action, Dispatch } from 'redux';

import styles from './index.less'
import { ActivityType } from '@/pages/CustomHome/details/data';
import Activity from '@/pages/CustomHome/details/components/Activity';

import { handleRefresh } from '@/utils';

const FormItem = Form.Item;

interface EditActivityProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'customHomeDetails/updateActivity'
      | 'customHomeDetails/getActivityList'
      | 'customHomeDetails/saveActivityConfig'
      >
    >;
  location: any;
  ActivityList: Array<any>;
  ActivityModalVisible: boolean;
  loading: boolean;
  values: Partial<ActivityType>;
  activityDetails: ActivityType | undefined;
  handleEditActivity: (flag?: boolean, record?: ActivityType) => void
}

interface EditActivityState {
  ActivityList: Array<any>;
}


class EditActivityForm extends Component<EditActivityProps, EditActivityState> {

  state: EditActivityState = {
    ActivityList: [],
  };

  componentDidMount() {
    const { dispatch, values } = this.props;
    dispatch({ type: 'customHomeDetails/updateActivity', payload: values });
    dispatch({ type: 'customHomeDetails/getActivityList' })
  }

  /**提交表单*/
  okHandle = () => {
    const { form, dispatch, activityDetails, handleEditActivity, location } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const configJson = JSON.stringify(activityDetails);
      dispatch({
        type: 'customHomeDetails/saveActivityConfig',
        payload: {
          configJson
        },
        callback: () => {
          message.success('推荐活动设置成功');
          handleEditActivity(false, activityDetails);
          handleRefresh({}, location);
        }
      })
    });
  };

  handleChange = (value: string) => {
    const { dispatch, activityDetails, ActivityList } = this.props;
    const currActivity = ActivityList.filter(_ => _.Id === value)
    if(currActivity && currActivity.length !== 0) {
      dispatch({
        type: 'customHomeDetails/updateActivity',
        payload: {
          ...activityDetails,
          Image: currActivity[0].Image,
          Name: currActivity[0].Name,
          activityId: currActivity[0].Id
        }
      })
    }

  };

  render() {
    const { form, handleEditActivity, ActivityModalVisible, activityDetails, ActivityList, loading } = this.props;

    const { activityId, Image, Name } = activityDetails;
    return (
      <>
        <Drawer
          title="推荐活动设置"
          width={720}
          onClose={() => handleEditActivity(false, activityDetails)}
          afterVisibleChange={(visible) => !visible && handleEditActivity()}
          className={styles['drawer-warp']}
          visible={ActivityModalVisible}
          bodyStyle={{ paddingBottom: 80, position: 'relative' }}
        >
          <div className={styles['demo-drawer']}>
            <Activity Image={Image} Name={Name}/>
          </div>
          <div className={styles['divider-horizontal']} />
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label='选择活动'>
            {form.getFieldDecorator('StyleType', {
              rules: [{ required: true, message: 'Please enter user name' }],
              initialValue: activityId || undefined
            })(
              <Select
                style={{ width: '100%' }}
                onChange={this.handleChange}
                notFoundContent={loading ?
                  <Spin size="small" />
                  : '暂无活动'}
                placeholder="选择推荐活动"
              >
                {
                  ActivityList.map(_ => (
                    <Select.Option key={_.Id} value={_.Id}>{_.Name}</Select.Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <div className={styles['submit-warp']}>
            <Button style={{marginRight: 12}} icon='close-circle' onClick={() => handleEditActivity(false, activityDetails)}>
              取消
            </Button>
            <Button type="primary" icon='check-circle' onClick={this.okHandle}>提交</Button>
          </div>
        </Drawer>
      </>
    );
  }
}

export default Form.create<EditActivityProps>()(EditActivityForm);


