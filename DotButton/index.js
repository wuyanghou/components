/**
 * 点状按钮，圆形或者圆角正方形的小按钮，内容一般为图标或者单个文字
 * @property {string} [type] - 类型，'primary'
 * @property {string} [iconType] - 图标类型
 * @property {string} [shape] - 形状，默认为圆形，可设为圆角正方形'square'
 * @property {ReactNode} [children] - 内容，一般为单个文字，设置了children时忽略iconType
 * @property {string} [size] - 大小（px），默认为28
 * @property {Function} [onClick] - 点击时的回调
 * @property {boolean} [disabled] - 是否禁用
 * @property {string?} [className] 附加在外层包裹元素的类
 * @property {object?} [style] 附加在外层包裹元素的样式
 * @property {string?} [title] 鼠标悬浮时的提示文字
 */
import React from 'react'
import Icon from '../Icon'
import './styles.less'

class DotButton extends React.Component {

  render() {
    const { children, type, iconType, shape, size, onClick, disabled, className, style: styleProp, title } = this.props

    let style = styleProp || {}
    style = {
      width: size,
      height: size,
      ...style,
    }

    const isText = typeof children === 'string' || typeof children === 'number'

    const content = children ?
      <span
        className={
          'DotButton-content' + (isText ? ' DotButton-text' : '')
        }
      >{children}</span>
      :
      <Icon className="DotButton-content" type={iconType} size={10} title={title} />

    return (
      <div
        className={
          'DotButton' +
          ' DotButton-' + size +
          (type === 'primary' ? ' DotButton-primary' : '') +
          (shape === 'square' ? ' DotButton-square' : '') +
          (size <= 14 ? ' DotButton-radius-sm' : '') +
          (size > 28 ? ' DotButton-lg' : '') +
          (disabled ? ' DotButton-disabled' : '') +
          (className ? ' ' + className : '')
        }
        onClick={disabled ? null : onClick}
        style={style}
        title={title}
      >
        {content}
      </div>
    )
  }
}

DotButton.defaultProps = {
  size: 28,
}

export default DotButton
