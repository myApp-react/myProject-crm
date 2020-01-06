import React, { PureComponent } from 'react';
import { Form, Modal, Row, Col, Input, InputNumber, Checkbox, Descriptions, Button, Select, Divider, Tag, Radio, DatePicker, Tooltip, Icon, TimePicker } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import moment from 'moment';

import styles from './index.less'
import { CreatePrizePoolItem } from '@/pages/SweepStakes/LotteryConfig/data';
const FormItem = Form.Item;
const { Search } = Input;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm';
const format = 'HH:mm';

interface CreatPrizePoolProps extends FormComponentProps {
  AcitivityId: string;
  visible: boolean;
  createPrizePoolForm: Array<any>;
  modalEditHandle: (flag?: boolean, selectedRow?: Array<any>) => void;
  saveHandle: (fields: CreatePrizePoolItem, callback: () => void) => void;
}

interface CreatPrizePoolState {
  shareCountStatus: boolean;
  tags: Array<any>;
  DateVisible: boolean;
  DateValue: string;
  createRuleType: number;
  initDate: any;
}

class CreatPrizePool extends PureComponent<CreatPrizePoolProps, CreatPrizePoolState>{

  state: CreatPrizePoolState = {
    shareCountStatus: false,
    tags: [],
    DateVisible: false,
    DateValue: '',
    createRuleType: 1,
    initDate: [moment().startOf('days'), moment().endOf('days')]
  }

  handleClose = (removedTag: string) => {
    const { form } = this.props;
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags }, () => {
      if(tags.length === 0){
        form.setFieldsValue({
          "TimePoints": undefined
        })
      }
    });


  };

  showInput = () => {
    this.setState((pre) => ({
      DateVisible: true
    }));
  };

  handleInputChange = (time: any, timeString: string) => {
    console.log(timeString)
    this.setState({ DateValue: timeString });
  };

  handleInputConfirm = (open: boolean) => {

    // console.log('open', open)
    if(!open){
      const { DateValue } = this.state;
      const { form } = this.props;
      let { tags } = this.state;
      if (DateValue && tags.indexOf(DateValue) === -1) {
        tags = [...tags, DateValue];
      }
      // console.log(tags);
      form.setFieldsValue({
        "TimePoints": tags
      })
      this.setState({
        tags,
        DateVisible: false,
        DateValue: '',
      });
    }

  };

  handleOnChange = (e: any) => {
    const createRuleType = e.target.value;
    this.setState({
      createRuleType
    })
  }

  okHandle = () => {
    const { form, saveHandle, AcitivityId, createPrizePoolForm, modalEditHandle } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      console.log(fieldsValue)
      let CycleStartTime = undefined,
          CycleEndTime = undefined,
          DrawIds: string[] = [];

      createPrizePoolForm.map(_ => DrawIds.push(_.LuckyDrawId));

      const { CycleRangeDate, TimePoints, AppointTime, ...rest } = fieldsValue;

      if(CycleRangeDate && CycleRangeDate.length !== 0){
        CycleStartTime = moment(CycleRangeDate[0]).format(dateFormat);
        CycleEndTime = moment(CycleRangeDate[1]).format(dateFormat);
      }else {
        CycleStartTime = undefined;
        CycleEndTime = undefined;
      }
      const values = {
        ActivityId: AcitivityId,
        DrawIds: DrawIds.join(','),
        CycleStartTime,
        CycleEndTime,
        TimePoints: TimePoints && TimePoints.join(',') || undefined,
        AppointTime: AppointTime && moment(AppointTime).format(dateFormat) || undefined,
        ...rest,
      }
      console.log('生成奖池传递的数据：', values)
      saveHandle(values, () => {
        modalEditHandle(false, createPrizePoolForm)
      });

    });
  };

  TimerHandleValidator = (rule: any, val: any, callback: any) => {
    if (!val) {
      callback();
    }

    const { form } = this.props;
    const { tags } = this.state;
    form.setFieldsValue({
      "TimePoints": tags
    })
    if(tags.length !== 0){
      callback();
    }else {
      callback('请添加每日生成时间点！');
    }
  }

  render() {
    const { visible, form, modalEditHandle, createPrizePoolForm } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const { shareCountStatus, tags, DateValue, DateVisible, createRuleType, initDate } = this.state;
    console.log('createPrizePoolForm', createPrizePoolForm)
    const singlePrizeNum = createRuleType === 1 ?
      (getFieldsValue()['GenerateCount'] || 1) * tags.length :
      getFieldsValue()['GenerateCount'] || 1;
    const prizeTotalNum = createPrizePoolForm.length * singlePrizeNum;

    return <Modal
      width={660}
      visible={visible}
      destroyOnClose={true}
      title='生成奖池'
      onCancel={() => modalEditHandle(false, createPrizePoolForm)}
      afterClose={() => modalEditHandle()}
      className={styles.modal}
      bodyStyle={{
        padding: '24px 24px 10px'
      }}
      footer={[
        <Button key="back" onClick={() => modalEditHandle(false, createPrizePoolForm)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={this.okHandle}>
          保存
        </Button>,
      ]}
    >
      <Form>
        <Row gutter={16}>
          <Col span={24}>
            <FormItem label="已选中礼品" className={styles['tags-form-item']} labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {
                createPrizePoolForm.map((e: any) => (
                  <Tag color="red" key={e.LuckyDrawId}>{e.DrawName}</Tag>
                ))
              }
            </FormItem>
          </Col>
          <Divider dashed />
          <Col span={24}>
            <FormItem label="生成规则" labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {getFieldDecorator('GenerateType', {
                initialValue: 1
              })(
                <Radio.Group onChange={this.handleOnChange}>
                  <Radio value={1}>周期生成</Radio>
                  <Radio value={2}>指定时间生成</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Col>
          {
            createRuleType === 1 ? <>
              <Col span={24}>
                <FormItem label="生成时间范围" labelCol={{span: 8}} wrapperCol={{span: 16}}>
                  {getFieldDecorator('CycleRangeDate', {
                    rules: [{ required: true, message: '请选择生成时间范围！'}],
                    initialValue: initDate
                  })(
                    <RangePicker
                      format={dateFormat}
                      ranges={{
                        '今日': [moment().startOf('days'), moment().endOf('days')],
                        '本月': [moment().startOf('month'), moment().endOf('month')],
                      }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="每日生成时间点" labelCol={{span: 8}} wrapperCol={{span: 16}}>
                  {getFieldDecorator('TimePoints', {
                    rules: [
                      { required: true, message: '请添加每日生成时间点'},
                    ],
                  })(
                    <div>
                      {tags.map((tag, index) => {
                        const isLongTag = tag.length > 20;
                        const tagElem = (
                          <Tag key={tag} closable={true} onClose={() => this.handleClose(tag)}>
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                          </Tag>
                        );
                        return isLongTag ? (
                          <Tooltip title={tag} key={tag}>
                            {tagElem}
                          </Tooltip>
                        ) : (
                          tagElem
                        );
                      })}
                      {DateVisible && (
                        <TimePicker
                          style={{ width: 96 }}
                          format={format}
                          placeholder='选择时间'
                          size="small"
                          onChange={this.handleInputChange}
                          onOpenChange={this.handleInputConfirm}
                        />
                      )}
                      {!DateVisible && (
                        <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                          <Icon type="plus" /> 新增时间点
                        </Tag>
                      )}
                    </div>
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem
                  label='每个时间点生成数量'
                  labelCol={{span: 8}}
                  wrapperCol={{span: 16}}
                >
                  {getFieldDecorator('GenerateCount', {
                    rules: [{ required: true, message: '请输入每个时间点生成数量！'}],
                    initialValue: 1
                  })(
                    <InputNumber
                      placeholder='生成数量'
                      min={1}
                      style={{width: 120}}
                    />
                  )}
                  <span className="ant-form-text"> 个</span>
                </FormItem>
              </Col>
            </> : <>
              <Col span={24}>
                <FormItem label="生成时间点" labelCol={{span: 8}} wrapperCol={{span: 16}}>
                  {getFieldDecorator('AppointTime', {
                    rules: [{ required: true, message: '请输入生成时间！'}],
                    // initialValue: []
                  })(
                    <DatePicker
                      format={dateFormat}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem
                  label='生成数量'
                  labelCol={{span: 8}}
                  wrapperCol={{span: 16}}
                >
                  {getFieldDecorator('GenerateCount', {
                    rules: [{ required: true, message: '请输入赠送抽奖次数！'}],
                    initialValue: 1
                  })(
                    <InputNumber
                      placeholder='生成数量'
                      min={1}
                      style={{width: 120}}
                    />
                  )}
                  <span className="ant-form-text">个</span>
                </FormItem>
              </Col>
            </>
          }
          <Divider  dashed >合计</Divider>

          <Col span={12}>
            <FormItem
              label={
                <span>礼品生成总数<i style={{fontStyle: 'normal', color: 'rgba(0,0,0,.45)'}}>（个）</i></span>
              }
              labelCol={{span: 12}}
              wrapperCol={{span: 12}}
              style={{marginBottom: 0}}
            >
              <b>{prizeTotalNum}</b>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label={<span>每个礼品生成数<i style={{fontStyle: 'normal', color: 'rgba(0,0,0,.45)'}}>（个）</i></span>}
              labelCol={{span: 12}}
              wrapperCol={{span: 12}}
            >
              <b>{singlePrizeNum}</b>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  }
}


export default Form.create<CreatPrizePoolProps>()(CreatPrizePool);
