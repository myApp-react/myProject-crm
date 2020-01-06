import React, { PureComponent } from 'react';

import styles from './index.less';
import eggsBg from '@/assets/games/eggs-bg.png';

interface EggsGamesProps {
  bgImage: string;
  showHtml: any
}

class EggsGames extends PureComponent<EggsGamesProps, {}>{

  static defaultProps = {
    bgImage: eggsBg,
    showHtml: '<p>暂无活动规则</p>'
  }

  render() {
    const { bgImage, showHtml } = this.props;
    return (
      <div
        className={styles['games-warp']}
        style={{
          backgroundImage: `url("${bgImage}")`
        }}
      >
        <div
          className={styles['eggs-bg']}
          style={{
            backgroundImage: `url("${bgImage}")`
          }}/>
        <div className={styles.content} >
          <div className={styles['content-img']} />
          <div className={styles['activity-info']}>
            <div className={styles['activity-info-inner']}>
              <h3 className={styles.title}><span>活动规则</span></h3>
              <div className={styles['activity-info-des']} >
                {
                  showHtml ?
                    <span dangerouslySetInnerHTML={{__html: showHtml}} /> :
                    <p style={{color: '#fff', textAlign: 'center'}}>暂无活动规则</p>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EggsGames
