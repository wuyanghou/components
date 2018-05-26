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
import { findFirstParent } from 'COMPONENT/utils/dom'
import Validator from 'COMPONENT/Validator'
import Tag from 'COMPONENT/Tag'

const noop = () => {}
const SELECT_ALL_KEY = 'SELECT_ALL_KEY'
const prefixCls = 'TagSelect'

export default class TagSelect extends React.Component {
  static propTypes = SelectPropTypes
  static defaultProps = SelectDefaultPropTypes

  constructor(props) {
    super(props)
    this.state = {
      value: this.formatValue(props.dict, props.value),
      inputValue: '',
      open: false,
    }
    this.updateOptions()
  }

  componentWillReceiveProps = nextProps => {
    if ('value' in nextProps) {
      this.setState({ value: this.formatValue(nextProps.dict, nextProps.value) })
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

  onMenuSelect = (selectedValue) => {
    let value = this.state.value
    const props = this.props
    props.onSelect(selectedValue)
    if (selectedValue === SELECT_ALL_KEY) {
      value = [...value, ...this._optionsFlat.filter(o => !o.disabled && !value.some(v => v.val === o.val))]
    } else {
      value = [...value, ...this.formatValue(props.dict, selectedValue)]
    }
    this.fireChange(value)
  }

  onMenuDeselect = (selectedValue) => {
    let value = this.state.value
    this.props.onDeselect(selectedValue)
    if (selectedValue === SELECT_ALL_KEY) {
      value = value.filter(v => !this._optionsFlat.some(o => o.val === v.val) || v.disabled)
    } else {
      value = value.filter(v => v.val !== selectedValue)
    }
    this.fireChange(value)
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
    if (value.length) {
      const newValue = value.filter(v => v.disabled)
      if (value.length !== newValue.length) {
        this.fireChange(newValue)
      }
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
    if (this.state.inputValue && open) {
      this.setState({ inputValue: '' })
    }
    this.setState({ open })
  }

  filterOption = (option) => {
    const { value, inputValue } = this.state
    if (!inputValue) {
      return true
    }
    const filterFn = this.props.filter || defaultFilterFn
    return filterFn.call(this, inputValue, option)
  }

  formatValue = (dict, value) => {
    const dictOptions = this.getDictOptionsFlat(dict)
    let newValue = []
    toArray(value).forEach(v => {
      const detailValue = dictOptions.find(o => o.val === v)
      if (detailValue) {
        newValue.push(detailValue)
      }
    })
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
    const sortedValue = this.getDictOptionsFlat(props.dict).filter(o => value.some(v => v.val === o.val))
    if (sortedValue.length > 0) {
      return sortedValue.map(v => v.val)
    }
    return null
  }

  updateOptions = () => {
    const props = this.props
    let { optionItems, options } = this.getFilteredOptions(props.dict)
    const optionsFlat = this.getDictOptionsFlat(options)
    if (optionItems.length > 0) {
      optionItems = [
        <MenuItem
          value={SELECT_ALL_KEY}
          key={SELECT_ALL_KEY}
          disabled={!optionsFlat.some(o => !o.disabled)}
        >
          { this.props.selectAllText }
        </MenuItem>
      ].concat(optionItems)
    } else {
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

  onCloseTag = (value) => {
    this.onMenuDeselect(value)
  }

  renderContentNode = () => {
    const { title, disabled, tagTextMaxCount } = this.props
    const { value } = this.state
    const className = `${prefixCls}-content`
    const text = value.map(v => v.text).join(', ')
    return (
      <div className={className}>
        {value.length === 0 && this.getPlaceholderElement()}
        {
          value.length > 0 &&
          <div
            key="value"
            className={`${prefixCls}-selected-value`}
            title={title}
          >
            {
              value.map(v => {
                return (
                  <Tag
                    key={v.val}
                    className={`${prefixCls}-selected-value-item`}
                    size="xSmall"
                    closable={disabled || v.disabled ? false : true}
                    onClose={e => e.stopPropagation()}
                    afterClose={() => this.onCloseTag(v.val)}
                  >
                    {tagTextMaxCount && v.text.length > tagTextMaxCount ? v.text.slice(0, tagTextMaxCount) + '...' : v.text}
                  </Tag>
                )
              })
            }
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
      [`${prefixCls}-clear-show`]: !disabled && open && value.filter(v => !v.disabled).length,
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

  getMenuSelectedKeys = () => {
    const { value } = this.state
    let keys = value.map(v => v.val)
    if (value.length > 0 && !this._optionsFlat.some(o => !o.disabled && !value.some(v => v.val === o.val))) {
      keys = [SELECT_ALL_KEY, ...keys]
    }
    return keys
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
        showSearch={props.showSearch && toArray(props.dict).length > 0}
        menuItems={this._optionItems}
        visible={open}
        inputValue={inputValue}
        menuSelectedKeys={this.getMenuSelectedKeys()}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
        getPopupContainer={this.getPopupContainer}
        onMenuSelect={this.onMenuSelect}
        onMenuDeselect={this.onMenuDeselect}
        onInputChange={val => this.setState({ inputValue: val })}
        onInputKeyDown={this.onInputKeyDown}
        searchPlaceholder={props.searchPlaceholder}
        ref={saveRef(this, 'selectTriggerRef')}
        dropdownClassName={props.dropdownClassName}
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
          {this.renderClear()}
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

