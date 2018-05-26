/**
 * 标记
 * @property {number|string} children - 文案信息
 * @property {string?} className 附加在外层包裹元素的类
 * @property {object?} style 附加在外层包裹元素的样式
 */
import React from 'react'
import styles from './styles.less'

class Badage extends React.Component {

  render() {
    const { children, className, style } = this.props

    return (
      <div className={'Badage' + (className ? className : '')} style={style || {}}>
        {children}
      </div>
    )
  }
}

export default Badage
