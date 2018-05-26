/**
 * 暂无数据缺省样式
 */
import React from 'react'
import './styles.less'
import noDataImg from '../assets/imgs/no_data.svg'
import classnames from 'classnames'

class NoData extends React.Component {

  render(){
    const { className, style } = this.props
    const cls = {
      'NoData': 1,
      [className]: !!className,
    }
    return (
      <div 
        className={classnames(cls)} 
        style={style}
      >
        <img src={noDataImg} />
        <div className="NoData-text">
          暂无数据
        </div>
      </div>
    )
  }
}

export default NoData