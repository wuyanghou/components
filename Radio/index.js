/**
 * 单选框组件
 * @property {string} [size] - 大小，'small'|'xSmall'
 */
import React from 'react'
import { Radio as AntdRadio } from 'antd'
import styles from './styles.less'
import classnames from 'classnames'

class Radio extends React.Component {

  render() {
    const { size, className, style, ...props } = this.props
    const sizeCls = 'Radio-' + size
    const cls = {
      'Radio': 1,
      [sizeCls]: !!size,
      [className]: !!className,
    }
    return (
      <div className={classnames(cls)} style={style}>
        <AntdRadio {...props} />
      </div>
    )
  }
}

Radio.Group = AntdRadio.Group
Radio.RadioButton = AntdRadio.Button

export default Radio
