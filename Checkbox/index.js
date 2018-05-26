/**
 * 复选框组件
 * @property {string} [size] - 大小，'small'|'xSmall'
 */
import React from 'react'
import { Checkbox as AntdCheckbox } from 'antd'
import styles from './styles.less'
import classnames from 'classnames'

class Checkbox extends React.Component {

  render() {
    const { size, className, style, ...props } = this.props
    const sizeCls = 'Checkbox-' + size
    const cls = {
      'Checkbox': 1,
      [sizeCls]: !!size,
      'Checkbox-default': !size,
      [className]: !!className,
    }
    return (
      <div className={classnames(cls)} style={style}>
        <AntdCheckbox {...props} />
      </div>
    )
  }
}

class Group extends React.Component {

  render() {
    const { size, className, style, ...props } = this.props
    const sizeCls = 'CheckboxGroup-' + size
    const cls = {
      'CheckboxGroup': 1,
      [sizeCls]: !!size,
      'CheckboxGroup-default': !size,
      [className]: !!className,
    }
    return (
      <div className={classnames(cls)} style={style}>
        <AntdCheckbox.Group {...props} />
      </div>
    )
  }
}

Checkbox.Group = Group

export default Checkbox
