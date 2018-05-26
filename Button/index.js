/**
 * 按钮
 * @property {ReactNode} children - 内容
 * @property {string} [iconType] - 图标类型
 * @property {string} [type] - 类型，'primary'
 * @property {string} [size] - 大小，'small'|'xSmall'
 * @property {Function} [onClick] - 点击时的回调
 * @property {object} [...props] - 传递给antd Button的其他属性
 */
import React from 'react'
import { Button as AntdButton } from 'antd'
import './styles.less'
import Icon from '../Icon'
import classnames from 'classnames'


class Button extends React.Component {
  disabledClick = false;

  //防止多次快速点击
  onClick = async (e) => {
    const { onClick } = this.props;
    if (this.disabledClick) {
      return
    }
    this.disabledClick = true;
    typeof onClick === 'function' && onClick(e);
    setTimeout(() => {
      this.disabledClick = false;
    }, 300);
  }
  render() {
    const { children, type, iconType, size: sizeProp, onClick, disabled, style, className, ...props } = this.props

    let size = 'large'
    if (sizeProp === 'small') {
      size = undefined
    } else if (sizeProp === 'xSmall') {
      size = 'small'
    }

    const content = typeof children === 'string' && children.length === 2 && !iconType ? `${children[0]} ${children[1]}` : children
    const cls = {
      'Button': 1,
      [className]: !!className,
    }
    return (
      <AntdButton
        type={type === 'primary' ? 'primary' : undefined}
        size={size}
        onClick={this.onClick}
        disabled={disabled === true ? true : undefined}
        style={style}
        className={classnames(cls)}
        {...props}
        ref='btn'
      >
        {iconType && <Icon className="Button-icon" type={iconType} size={size === 'large' ? 14 : 12} />}
        {content}
      </AntdButton>
    )
  }
}

export default Button
