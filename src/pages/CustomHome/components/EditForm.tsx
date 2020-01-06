import { Form, Input, Modal } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { TableListItem } from '@/pages/CustomHome/data';

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  editModalVisible: boolean;
  handleEdit: (fieldsValue: { Id: string, ConfigName: string }) => void;
  handleEditModalVisible: () => void;
  values: Partial<TableListItem>;
}
const EditForm: React.FC<CreateFormProps> = props => {
  const { editModalVisible, form, handleEdit, handleEditModalVisible, values } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleEdit({...fieldsValue, Id: values.Id});
    });
  };

  return (
    <Modal
      destroyOnClose
      title="修改配置名称"
      visible={editModalVisible}
      onOk={okHandle}
      onCancel={() => handleEditModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="配置名称">
        {form.getFieldDecorator('ConfigName', {
          rules: [{ required: true, message: '请输入配置名称' }],
          initialValue: values.ConfigName
        })(<Input placeholder="请输入配置名称" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(EditForm);
