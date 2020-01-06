import React from 'react';
import { menuList } from '@/utils/constant'

import styles from './index.less';

export default () => {
  return (
    <div className={styles['board-list']}>
      <ul>
        {
          menuList.map(_ =>
            <li  key={_.id}>
              <button
                data-text={_.name}
                data-id={_.id}
                className={styles['board-list-li']}
              >
                <span className={styles['board-title']}>点击添加</span>
              </button>
            </li>)
        }
      </ul>
    </div>
  );
};
