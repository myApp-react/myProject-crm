import React, { memo } from 'react'

import { Prefix } from '@/utils/constant'
import styles from './index.less';

interface titleProps {
  Fromabove: any,
  Istemplate: any,
  BackColor: any,
  BackImage: any,
  LeftImage: any,
  HeadLine: any,
  HeadLineSize: any,
  HeadLineColor: any,
  RightWord: any,
  RightWordSize: any,
  RightWordColor: any,
  RightImage: any,
  FuncLink: any,
}

export default memo((props: titleProps) => {

  const {
    Fromabove,
    Istemplate,
    BackColor,
    BackImage,
    LeftImage,
    HeadLine,
    HeadLineSize,
    HeadLineColor,
    RightWord,
    RightWordSize,
    RightWordColor,
    RightImage,
    FuncLink
  } = props;

  const bgType = Istemplate || 1;


  return (
    <div
      className={styles.titlebar}
      style={{
        marginTop: Fromabove || 0,
        fontSize: 20,
        background: `${bgType === 1 ? (BackColor || '#fff') : (BackImage && 'url("'+ Prefix + BackImage +'") 0px 0px / 100% 100% no-repeat')}`,
      }}
    >
      <div className={styles['titlebar-inner']}>
        <a style={{display: 'block'}}>
          <div className={styles['titlebar-flex']}>
            <div className={styles['left-title']}>
              {
                LeftImage ? <i
                  className={styles['left-icon']}
                  style={{
                    backgroundImage: `url("${Prefix + LeftImage}")`,
                  }}/> : null
              }
              <div className={styles['left-title-text']}
                   style={{
                    fontSize: HeadLineSize,
                    color: HeadLineColor,
                  }}
              >{HeadLine}</div>
            </div>
            <div
              className={styles['right-text']}
            >
              <div
                className={styles['right-text-text']}
                style={{
                  color: RightWordColor,
                  fontSize: RightWordSize,
                }}
              >
                {RightWord}
              </div>
              {
                RightImage ? <i
                  className={styles['right-icon']}
                  style={{
                    backgroundImage: `url("${Prefix + RightImage}")`,
                  }}/> : null
              }
            </div>
          </div>
        </a>
      </div>
    </div>

  )
});
