/**
 * 图标
 * @property {string} type - 图标类型
 * @property {string} [size] - 大小（px），默认为普通字体大小
 * @property {string} [color] - 颜色，仅对单色图标有效，默认为普通字体色
 * @property {string} [className] - 附加在根元素的类名
 * @property {object} [style] - 附加在根元素的样式
 * @property {object} [...props] 其他属性，与弹出层等其他组件结合使用时，需要接收一些其他的属性
 */
import React from 'react'
import SvgLib from '../assets/svgs/symbol-defs.svg'
import './styles.less'

class Icon extends React.Component {

  render() {
    const { type, size, color, className, style: styleProp, ...props } = this.props
    let style = {}

    if (color) {
      style = { ...style, color }
    }

    if (size) {
      style = { ...style, width: size, height: size, lineHeight: size + 'px' }
    }

    if (styleProp) {
      style = { ...style, ...styleProp }
    }

    return (
      <svg
        className={
          'Icon ' +
          (className ? className : '')
        }
        style={style}
        {...props}
      >
        <use xlinkHref={`${SvgLib}#Icon-${type}`}></use>
      </svg>
    )
  }
}

export default Icon
