import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { NavBar } from 'antd-mobile';

import { DraggableModal, DraggableModalProvider } from 'ant-design-draggable-modal'
import 'ant-design-draggable-modal/dist/index.css'

import { EggsGames } from '@/components'
import styles from './index.less';

interface ViewDrawerProps {
  viewDrawerFormVal: any;
  ueditorContent: any;
  viewDrawerVisible: boolean;
  handleEditViewDrawer: (flag?: boolean, record?: any) => void;
}

class ViewDrawer extends PureComponent<ViewDrawerProps, {}>{

  render() {
    const { viewDrawerVisible, handleEditViewDrawer, viewDrawerFormVal, ueditorContent } = this.props;
    return (
      <>
        <DraggableModalProvider>
          <DraggableModal
            title='模板预览(可上下调整窗口大小)'
            width={408}
            visible={viewDrawerVisible}
            onCancel={() => handleEditViewDrawer(false, { flag: true})}
            footer={null}
            className={styles['drag-warp']}
          >
            <div className={styles.phone}>
              <div className={styles.container}>
                <div className={styles['preview-header']}>
                  <div className={styles['preview-statbar']}>
                    <img src={require('@/assets/mobile/phone-header.png')} alt=""/>
                  </div>
                  <NavBar
                    className={styles.NavBar}
                    mode="light"
                  >砸金蛋</NavBar>
                </div>
                <div className={styles['show-main']}>
                  <div className={styles['scroll-view']}>
                    <EggsGames showHtml={ueditorContent}/>
                  </div>
                </div>
              </div>
            </div>
          </DraggableModal>
        </DraggableModalProvider>
      </>
    )
  }
}

export default Form.create<ViewDrawerProps>()(ViewDrawer);
