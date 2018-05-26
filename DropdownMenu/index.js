/**
 * 下拉菜单
 */
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Dropdown, Menu } from 'antd'
import { addClass, removeClass } from '../utils/dom'
import styles from './styles.less'
import Icon from '../Icon'
import MenuContainer from './MenuContainer'
import { findFirstParent } from '../utils/dom'

const noop = () => {}
class DropdownMenu extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    iconType: PropTypes.string,
    hasArrow: PropTypes.bool,
    disabled: PropTypes.bool,
    size: PropTypes.string,
    color: PropTypes.string,
    activeColor: PropTypes.string,
    disabledColor: PropTypes.string,
    content: PropTypes.node,
    activeContent: PropTypes.node,
    disabledContent: PropTypes.node,
    isCustom: PropTypes.bool,
    menus: PropTypes.arrayOf(PropTypes.shape({
      content: PropTypes.node,
      text: PropTypes.string,
      disabled: PropTypes.bool,
      hide: PropTypes.bool,
      onClick: PropTypes.func,
    })).isRequired,
    placement: PropTypes.string,
    trigger: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    dropdownClassName: PropTypes.string,
    getPopupContainer: PropTypes.func,
  }
  static defaultProps = {
    placement: 'bottomLeft',
    trigger: 'hover',
    getPopupContainer: noop,
  }

  state = {
    open: false,
  }

  handleVisibleChange = (visible) => {
    this.setState({ open: visible })
    if (this.props.hasArrow) {
      if (visible) {
        addClass(this.$arrow, 'DropdownMenu-arrow-up')
      } else {
        removeClass(this.$arrow, 'DropdownMenu-arrow-up')
      }
    }
  }

  handleMenuClick = (e) => {
  if (this.props.disabled) {
      return
    }
    this.setState({ open: false })
    const clickCallback = this.props.menus.filter(m => !m.hide)[parseInt(e.key)].onClick
    if (clickCallback) {
      clickCallback(e)
    }
    removeClass(this.$arrow, 'DropdownMenu-arrow-up')
  }

  getPopupContainer = () => {
    const $root = ReactDOM.findDOMNode(this.rootRef)
    return (
      this.props.getPopupContainer() ||
      findFirstParent($root, '.ant-modal') ||
      findFirstParent($root, '.Page-scroller') ||
      document.body
    )
  }

  render() {
    const {
      text, iconType, hasArrow, disabled, size, color, activeColor, disabledColor, content, activeContent, disabledContent,
      isCustom, menus, placement, trigger, className, style, dropdownClassName
    } = this.props
    const { open } = this.state

    const menuItems = menus.filter(m => !m.hide).map((m, i) => {
      return (
        <Menu.Item
          key={i}
          disabled={m.disabled}
        >
          {m.content || m.text}
        </Menu.Item>
      )
    })

    const overlay = (
      <MenuContainer className={dropdownClassName}>
        <Menu
          className={size === 'small' ? 'DropdownMenu-menu-small' : ''}
          selectedKeys={null}
          onClick={this.handleMenuClick}
          prefixCls="ant-dropdown-menu"
          mode="vertical"
        >
          {menuItems}
        </Menu>
      </MenuContainer>
    )
    const cls = {
      DropdownMenu: 1,
      [`DropdownMenu-${size}`]: !!size,
      [`DropdownMenu-disabled`]: disabled,
      [className]: !!className,
    }

    let customColor
    if (disabled && disabledColor) {
      customColor = disabledColor
    } else if (open && activeColor) {
      customColor = activeColor
    } else if (color) {
      customColor = color
    }

    return (
      <Dropdown
        trigger={[trigger]}
        placement={placement}
        overlay={overlay}
        disabled={disabled}
        onVisibleChange={this.handleVisibleChange}
        visible={open}
        getPopupContainer={this.getPopupContainer}
      >
        <span className={classnames(cls)} style={style}>
          {isCustom ?
            <span className="DropdownMenu-content-custom">{disabled ? disabledContent : (open ? activeContent : content)}</span>
            :
            <span className="DropdownMenu-content" style={customColor ? { color: customColor } : null}>
              {iconType ?
                <Icon type={iconType} color={customColor} />
                :
                text
              }
            </span>
          }
          {hasArrow &&
            <span
              style={customColor ? { color: customColor } : null}
              className={'DropdownMenu-arrow'}
              ref={c => this.$arrow = ReactDOM.findDOMNode(c)}
            />
          }
        </span>
      </Dropdown>
    )
  }
}

export default DropdownMenu
