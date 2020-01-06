import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { DraggableModal, DraggableModalProvider } from 'ant-design-draggable-modal'
import 'ant-design-draggable-modal/dist/index.css'
import styles from './index.less';

interface DraggableModalProps {
  title: string;
  viewDrawerFormVal: any;
  DraggableModalVisible: boolean;
  onOk?: (e: any) => void;
  onCancel?: (e: any) => void;
}

class DraggableModal extends PureComponent<DraggableModalProps, {}>{


  render() {
    const { DraggableModalVisible, onOk, onCancel, title } = this.props;
    return (
      <DraggableModalProvider>
        <DraggableModal title={title} visible={DraggableModalVisible} onOk={onOk} onCancel={onCancel}>
          Body text.
        </DraggableModal>
      </DraggableModalProvider>
    )
  }
}

export default Form.create<DraggableModalProps>()(DraggableModal);
