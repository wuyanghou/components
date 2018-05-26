import React, { cloneElement } from 'react'
import { findDOMNode } from 'react-dom'
import toArray from 'rc-util/lib/Children/toArray'
import Menu from 'rc-menu'
import scrollIntoView from 'dom-scroll-into-view'
import { saveRef } from './util'

export default class DropdownMenu extends React.Component {

  constructor(props) {
    super(props)
    const { selectedKeys } = this.props
    this.state = {
      activeKey: selectedKeys[0],
    }
  }

  componentDidMount() {
    this.scrollActiveItemToView()
  }

  componentWillReceiveProps(nextProps) {
    const nextKeys = nextProps.selectedKeys
    const keys = this.props.selectedKeys
    let activeKey
    if (nextProps.inputValue === this.props.inputValue) {
      if (nextKeys.length < keys.length) {
        activeKey = keys.find(k => !nextKeys.some(n => n === k))
      } else if (nextKeys.length > keys.length) {
        activeKey = nextKeys.find(k => !keys.some(n => n === k))
      } else {
        activeKey = nextKeys[0]
      }
    }
    this.setState({ activeKey })
  }

  componentDidUpdate(prevProps) {
    const props = this.props
    if (!prevProps.visible && props.visible) {
      this.scrollActiveItemToView()
    }
  }

  scrollActiveItemToView = () => {
    const itemComponent = findDOMNode(this.firstActiveItem)
    if (itemComponent) {
      const scrollIntoViewOpts = {
        onlyScrollIfNeeded: true,
      }

      scrollIntoView(
        itemComponent,
        findDOMNode(this.menuRef),
        scrollIntoViewOpts
      )
    }
  }

  render() {
    const props = this.props
    const { activeKey } = this.state
    const {
      menuItems,
      selectedKeys,
      prefixCls,
      onMenuSelect,
      onMenuDeselect,
    } = props
    if (menuItems && menuItems.length) {
      let clonedMenuItems = menuItems
      if (selectedKeys.length) {
        let foundFirst = false
        const clone = item => {
          if ( !foundFirst && selectedKeys.indexOf(item.key) >= 0 ) {
            foundFirst = true
            return cloneElement(item, {
              ref: ref => {
                this.firstActiveItem = ref
              },
            })
          }
          return item
        }

        clonedMenuItems = menuItems.map(item => {
          if (item.type.isMenuItemGroup) {
            const children = toArray(item.props.children).map(clone)
            return cloneElement(item, {}, children)
          }
          return clone(item)
        })
      }
      return (
        <Menu
          ref={saveRef(this, 'menuRef')}
          defaultActiveFirst={true}
          activeKey={activeKey}
          multiple={true}
          onSelect={obj => onMenuSelect(obj.item.props.value, obj.item.props.children)}
          onDeselect={obj => onMenuDeselect(obj.item.props.value, obj.item.props.children)}
          selectedKeys={selectedKeys}
          prefixCls={`${prefixCls}-menu`}
        >
          {clonedMenuItems}
        </Menu>
      )
    }
    return null
  }
}
