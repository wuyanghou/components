import Trigger from 'rc-trigger'
import React from 'react'
import DropdownMenu from './DropdownMenu'
import ReactDOM from 'react-dom'
import { saveRef } from './util'
import classnames from 'classnames'
import SearchInput from '../_SearchInput'

const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
}

const dropdownPrefixCls = 'Dropdown'

export default class SelectTrigger extends React.Component {

  state = {
    dropdownWidth: null,
  }

  componentDidMount() {
    this.setDropdownWidth()
  }

  componentDidUpdate(prevProps) {
    this.setDropdownWidth()
    if (this.inputRef && !prevProps.visible && this.props.visible) {
      setTimeout(() => {
        this.inputRef.getInputInstance().focus()
      }, 100)
    }
  }

  setDropdownWidth = () => {
    const width = ReactDOM.findDOMNode(this).offsetWidth
    if (width !== this.state.dropdownWidth) {
      this.setState({ dropdownWidth: width })
    }
  }

  getInnerMenu = () => {
    return this.dropdownMenuRef && this.dropdownMenuRef.menuRef
  }

  getDropdownElement = () => {
    const props = this.props
    return (
      <div style={{ width: '100%' }}>
        {props.showSearch &&
          <div className={`${dropdownPrefixCls}-search-field-wrap`}>
            <SearchInput
              autoComplete="off"
              onChange={props.onInputChange}
              onKeyDown={props.onInputKeyDown}
              value={props.inputValue}
              className={`${dropdownPrefixCls}-search-field`}
              placeholder={props.searchPlaceholder}
              ref={saveRef(this, 'inputRef')}
            />
          </div>
        }
        <DropdownMenu
          prefixCls={dropdownPrefixCls}
          menuItems={props.menuItems}
          inputValue={props.inputValue}
          visible={props.visible}
          onMenuSelect={props.onMenuSelect}
          onMenuDeselect={props.onMenuDeselect}
          selectedKeys={props.menuSelectedKeys}
          ref={saveRef(this, 'dropdownMenuRef')}
        />
      </div>
    )
  }

  render() {
    const props = this.props
    const { size } = props
    const popupStyle = { width: this.state.dropdownWidth }
    const popupCls = {
      'MultiMenu-dropdown': 1,
      [props.dropdownClassName]: !!props.dropdownClassName,
      [`MultiMenu-dropdown-${size}`]: !!size,
    }


    return (
      <Trigger
        showAction={['click']}
        hideAction={['click']}
        popupPlacement="bottomLeft"
        builtinPlacements={BUILT_IN_PLACEMENTS}
        prefixCls={dropdownPrefixCls}
        popupTransitionName={`${dropdownPrefixCls}-slide-up`}
        onPopupVisibleChange={props.onDropdownVisibleChange}
        popup={this.getDropdownElement()}
        popupVisible={props.visible}
        getPopupContainer={props.getPopupContainer}
        popupStyle={popupStyle}
        popupClassName={classnames(popupCls)}
        ref={saveRef(this, 'triggerRef')}
      >
        {props.children}
      </Trigger>
    )
  }
}
