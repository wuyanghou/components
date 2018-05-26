/**
 * 图标按钮，即可点击的图标，鼠标悬浮时变色
 * @property {string} type - 图标类型
 * @property {string} [hoverType] - 鼠标悬浮时的图标类型，当type带有_mc（mc为muticolor缩写，表示为多色图标）后缀时，如：star_mc，hoverType默认值为type加上_h（h为hover的缩写，表示鼠标悬浮状态）后缀，如：star_mc_h
 * @property {string} [color] - 颜色，仅对单色图标有效，默认为次要字体色
 * @property {string} [hoverColor] - 鼠标悬浮时的颜色，仅对单色图标有效，默认为主色
 * @property {string} [disabledColor] - 禁用状态时的颜色，仅对单色图标有效，默认为提示字体色；多色图标禁用状态暂时处理为：40%透明
 * @property {string} [size] - 大小（px），默认为14
 * @property {Function} [onClick] - 点击时的回调
 * @property {string | object} [title] - 标题，可以是文字，或者Tooltip组件的配置对象，参数详见https://ant.design/components/tooltip-cn/
 * @property {boolean} [disabled] - 是否禁用
 * @property {string} [className] - 附加在根元素的类名
 * @property {object} [style] - 附加在根元素的样式
 * @property {object} [...props] 其他属性，与弹出层等其他组件结合使用时，需要接收一些其他的属性
 */
import React from 'react'
import { Tooltip  } from 'antd'
import styles from './styles.less'
import Icon from '../Icon'
import vars from '../theme/variables'

class IconButton extends React.Component {

  constructor(props) {
    super(props)
    this.state = this.getInitStateFromProps(props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getInitStateFromProps(nextProps))
  }

  getInitStateFromProps = (props) => {
    const { type, color, disabled, disabledColor } = props
    return {
      currType: type,
      currColor: disabled ? disabledColor : color,
    }
  }

  checkMultiColor = (type) => {
    const arry = type.split('_')
    return arry[arry.length - 1] === 'mc'
  }

  mouseEnter = () => {
    const { type, hoverType, hoverColor, disabled, disabledColor } = this.props
    const isMultiColor = this.checkMultiColor(type)

    if (isMultiColor) {
      this.setState({
        currType: !disabled ? (hoverType ? hoverType : type + '_h') : type
      })
    } else {
      this.setState({
        currType: hoverType && !disabled ? hoverType : type,
        currColor: disabled ? disabledColor : hoverColor,
      })
    }
  }

  mouseLeave = () => {
    const { type, color, disabled, disabledColor } = this.props
    const isMultiColor = this.checkMultiColor(type)

    if (isMultiColor) {
      this.setState({
        currType: type,
      })
    } else {
      this.setState({
        currType: type,
        currColor: disabled ? disabledColor : color,
      })
    }
  }

  render() {
    const { type, hoverType, size, onClick, title, disabled, className, style: styleProp, color, hoverColor, disabledColor, ...props } = this.props
    const { currType, currColor } = this.state

    const isMultiColor = this.checkMultiColor(type)

    let iconBtnProps = {
      className: 'IconButton' + (isMultiColor ? ' IconButton-multiColor' : '') + (disabled ? ' IconButton-disabled' : '') + (className ? ' ' + className : ''),
    }

    if (!disabled) {
      iconBtnProps = { ...iconBtnProps, onClick, ...props }
    }

    let style = { height: size, width: size, lineHeight: size + 'px', ...style }
    if (styleProp) {
      style = { ...style, ...styleProp }
    }


    let iconBtn = (
      <span
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
        {...iconBtnProps}
        style={style}
      >
        <Icon type={currType} color={currColor} size={size} />
      </span>
    )

    if (title && !disabled) {
      let tooltipProps
      if (typeof title === 'string') {
        tooltipProps = { title }
      } else {
        tooltipProps = title
      }
      iconBtn = (
        <Tooltip { ...tooltipProps }>
          {iconBtn}
        </Tooltip>
      )
    }

    return iconBtn
  }
}

IconButton.defaultProps = {
  color: vars.fontColorSecondary,
  hoverColor: vars.primaryColor,
  disabledColor: vars.fontColorTips,
  size: 14,
}

export default IconButton
