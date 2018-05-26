import React from 'react'
import ReactDOM from 'react-dom'
import KeyCode from 'rc-util/lib/KeyCode'
import classnames from 'classnames'
import classes from 'component-classes'
import {
  toArray,
  UNSELECTABLE_ATTRIBUTE,
  UNSELECTABLE_STYLE,
  preventDefaultEvent,
  defaultFilterFn,
  saveRef,
} from './util'
import SelectTrigger from './SelectTrigger'
import { Item as MenuItem, ItemGroup as MenuItemGroup } from 'rc-menu'
import styles from './styles.less'
import { SelectPropTypes, SelectDefaultPropTypes } from './PropTypes'
import { findFirstParent } from '../utils/dom'
import Validator from '../Validator'

const noop = () => {}
const prefixCls = 'Select'

export default class Select extends React.Component {
  static propTypes = SelectPropTypes
  static defaultProps = SelectDefaultPropTypes

  constructor(props) {
    super(props)
    this.state = {
      value: this.formatValue(props, props.value),
      inputValue: '',
      open: false,
    }
    this.updateOptions()
  }

  componentWillReceiveProps = nextProps => {
    if ('value' in nextProps) {
      this.setState({ value: this.formatValue(nextProps, nextProps.value) })
    }
  }

  componentWillUpdate(nextProps, nextState) {
    this.props = nextProps
    this.state = nextState
    this.updateOptions()
    this.updatePopupAlign()
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.open && prevState.open) {
      if (!this._rootFocused) {
        this.props.onBlur()
      }
    }
  }

  getPopupContainer = () => {
    const $root = ReactDOM.findDOMNode(this.rootRef)
    return (
      this.props.getPopupContainer() ||
      findFirstParent($root, '.ant-modal-wrap') ||
      findFirstParent($root, '.Page-scroller') ||
      document.body
    )
  }

  onDropdownVisibleChange = open => {
    if (this.props.disabled || !this.props.selectable) {
      return
    }
    this.setOpenState(open)
  }

  onKeyDown = event => {
    if (this.props.disabled) {
      return
    }
    if (this.state.open) {
      if (!this.props.showSearch) {
        this.onInputKeyDown(event)
      }
    } else {
      const keyCode = event.keyCode
      if (keyCode === KeyCode.ENTER || keyCode === KeyCode.DOWN) {
        this.setOpenState(true)
        event.preventDefault()
      }
    }
  }

  onInputKeyDown = event => {
    const menu = this.selectTriggerRef.getInnerMenu()
    menu.onKeyDown(event, noop)
  }

  onMenuSelect = (val, text) => {
    const value = this.state.value
    const props = this.props
    const { textInValue } = props
    const selectedValue = textInValue ? { val, text } : val
    const newValue = this.formatValue(props, selectedValue)
    props.onSelect(this.getVLForOnChange(newValue))
    if ((value && !newValue) || (!value && newValue) || value.val !== newValue.val) {
      this.fireChange(newValue)
    }
    this.setOpenState(false)
    ReactDOM.findDOMNode(this.rootRef).blur()
  }

  onRootFocus = (e) => {
    if (this.props.disabled) {
      e.preventDefault()
      return
    }
    if (!this._rootFocused) {
      this._rootFocused = true
      if (!this.state.open) {
        this.props.onFocus()
      }
    }
  }

  onRootBlur = (e) => {
    if (this.props.disabled) {
      e.preventDefault()
      return
    }
    this._rootFocused = false
    if (!this.state.open) {
      this.props.onBlur()
    }
  }

  onRootClick = (e) => {
    if (this.props.disabled) {
      e.preventDefault()
      return
    }
    this.props.onClick(e)
  }

  onClearSelection = event => {
    const { value } = this.state
    event.stopPropagation()
    if (value && !value.disabled) {
      this.fireChange(null)
      //this.setOpenState(false)
    }
  }

  getPlaceholderElement = () => {
    const { props, state } = this
    const placeholder = props.placeholder
    if (placeholder) {
      return (
        <div
          style={UNSELECTABLE_STYLE}
          {...UNSELECTABLE_ATTRIBUTE}
          className={`${prefixCls}-placeholder`}
        >
          {placeholder}
        </div>
      )
    }
    return null
  }

  setOpenState = (open) => {
    const { props, state } = this
/*    if (this.state.inputValue && open) {
      this.setState({ inputValue: '' })
    }*/
/*     if (!open) {
      ReactDOM.findDOMNode(this.rootRef).blur()
    } */
    this.setState({ open })
  }

  filterOption = (option) => {
    const { value, inputValue } = this.state
    if (this.props.onSearchKeyChange || !inputValue) {
      return true
    }
    const filterFn = this.props.filter || defaultFilterFn
    return filterFn.call(this, inputValue, option)
  }

  formatValue = (props, value) => {
    const { dict, textInValue } = props
    const dictOptions = this.getDictOptionsFlat(dict)
    let newValue = null
    const detailValue = dictOptions.find(o => o.val === value)
    if (detailValue) {
      newValue = detailValue
    } else {
      if (textInValue) {
        newValue = value
      }
    }
    return newValue
  }

  getDictOptionsFlat = (dict) => {
    dict = toArray(dict)
    if (dict.length === 0) {
      return []
    }
    let opts = []
    dict.forEach(d => {
      if (d.label) {
        opts = [ ...opts, ...d.options ]
      } else {
        opts.push(d)
      }
    })
    return opts
  }

  fireChange = value => {
    const props = this.props
    if (!('value' in props)) {
      this.setState({ value })
    }
    props.onChange(this.getVLForOnChange(value))
  }

  getVLForOnChange = value => {
    const props = this.props
    if (value) {
      if (props.textInValue) {
        return { val: value.val, text: value.text }
      }
      return value.val
    }
    return null
  }

  updateOptions = () => {
    const props = this.props
    let { optionItems, options } = this.getFilteredOptions(props.dict)
    const optionsFlat = this.getDictOptionsFlat(options)
    if (optionItems.length === 0) {
      optionItems = [
        <MenuItem
          style={UNSELECTABLE_STYLE}
          attribute={UNSELECTABLE_ATTRIBUTE}
          disabled
          value="NOT_FOUND"
          key="NOT_FOUND"
          className={`Select-dropdown-menu-item-tips`}
        >
          {toArray(props.dict).length > 0 ? props.searchNotFoundTips : props.noOptionTips}
        </MenuItem>,
      ]
    }
    this._optionItems = optionItems
    this._optionsFlat = optionsFlat
  }

  updatePopupAlign = () => {
    setTimeout(() => {
      if (this.selectTriggerRef && this.selectTriggerRef.triggerRef) {
        this.selectTriggerRef.triggerRef.forcePopupAlign()
      }
    }, 10)
  }

  getFilteredOptions = (dict) => {
    dict = toArray(dict)
    let filteredOptionItems = []
    let filteredOptions = []
    const props = this.props
    dict.forEach(opt => {
      if (opt.label) {
        const { optionItems: childrenItems, options: childrenOptions } = this.getFilteredOptions(opt.options)
        if (childrenItems.length) {
          const label = opt.label
          filteredOptionItems.push(
            <MenuItemGroup
              key={label}
              title={<span>{label}</span>}
            >
              {childrenItems}
            </MenuItemGroup>
          )
          filteredOptions.push({ label, options: childrenOptions })
        }
        return
      }

      const val = opt.val
      const disabled = opt.disabled

      if (this.filterOption(opt)) {
        filteredOptionItems.push(
          <MenuItem
            style={UNSELECTABLE_STYLE}
            attribute={UNSELECTABLE_ATTRIBUTE}
            value={val}
            key={val}
            disabled={disabled}
            title={opt.title}
          >
            {opt.text}
          </MenuItem>
        )
        filteredOptions.push(opt)
      }
    })
    return { optionItems: filteredOptionItems, options: filteredOptions }
  }

  renderContentNode = () => {
    const { title } = this.props
    const { value } = this.state
    const className = `${prefixCls}-content`
    const text = value ? value.text : null
    return (
      <div className={className}>
        {!value && this.getPlaceholderElement()}
        {
          value &&
          <div
            key="value"
            className={`${prefixCls}-selected-value`}
            title={title || text}
          >
            {text}
          </div>
        }
      </div>
    )
  }

  renderClear() {
    const { disabled } = this.props
    const { value, open } = this.state
    const cls = {
      [`${prefixCls}-clear`]: 1,
      [`${prefixCls}-clear-show`]: !disabled && open && value && !value.disabled,
    }
    return (
      <span
        key="clear"
        style={UNSELECTABLE_STYLE}
        {...UNSELECTABLE_ATTRIBUTE}
        className={classnames(cls)}
        onClick={this.onClearSelection}
      />
    )
  }

  onInputChange = val => {
    const { onSearchKeyChange } = this.props
    this.setState({ inputValue: val })
    if (onSearchKeyChange) {
      onSearchKeyChange(val)
    }
  }

  render() {
    const props = this.props
    const { open, inputValue, value } = this.state
    const { className, disabled, size } = props
    const rootCls = {
      [className]: !!className,
      [prefixCls]: 1,
      [`${prefixCls}-open`]: open,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-${size}`]: size,
    }
    let selectNode = (
      <SelectTrigger
        prefixCls={prefixCls}
        showSearch={props.showSearch}
        menuItems={this._optionItems}
        visible={open}
        inputValue={inputValue}
        menuSelectedKeys={value ? [value.val] : []}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
        getPopupContainer={this.getPopupContainer}
        onMenuSelect={this.onMenuSelect}
        onInputChange={this.onInputChange}
        onInputKeyDown={this.onInputKeyDown}
        searchPlaceholder={props.searchPlaceholder}
        ref={saveRef(this, 'selectTriggerRef')}
        dropdownClassName={props.dropdownClassName}
        dropdownStyle={props.dropdownStyle}
        size={size}
      >
        <div
          tabIndex={0}
          onKeyDown={this.onKeyDown}
          onBlur={this.onRootBlur}
          onFocus={this.onRootFocus}
          onClick={this.onRootClick}
          className={classnames(rootCls)}
          style={props.style}
          ref={saveRef(this, 'rootRef')}
        >
          {this.renderContentNode()}
          {props.allowClear && this.renderClear()}
          {props.selectable &&
            <span
              key="arrow"
              className={`${prefixCls}-arrow`}
              style={UNSELECTABLE_STYLE}
              {...UNSELECTABLE_ATTRIBUTE}
            >
            </span>
          }
        </div>
      </SelectTrigger>
    )

    if (props.validator) {
      selectNode = (
        <Validator value={this.getVLForOnChange(value)} {...props.validator}>
          {selectNode}
        </Validator>
      )
    }

    return selectNode
  }
}

