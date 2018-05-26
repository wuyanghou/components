import React from 'react'
import ReactDOM from 'react-dom'
import KeyCode from 'rc-util/lib/KeyCode'
import classnames from 'classnames'
import {
  toArray,
  UNSELECTABLE_ATTRIBUTE,
  UNSELECTABLE_STYLE,
  saveRef,
} from './util'
import SelectTrigger from './SelectTrigger'
import './styles.less'
import { SelectPropTypes, SelectDefaultPropTypes } from './PropTypes'
import { findFirstParent } from '../utils/dom'
import Validator from '../Validator'
import { objectDeepEquals } from '../utils/basic/obj'

const prefixCls = 'TreeMultiSelect'

export default class TreeMultiSelect extends React.Component {
  static propTypes = SelectPropTypes
  static defaultProps = SelectDefaultPropTypes

  constructor(props) {
    super(props)
    this.state = {
      value: this.formatValue(props, props.value),
      inputValue: '',
      open: false,
      ...this.getTreeDataDetail('', props),
    }
  }

  componentWillReceiveProps = nextProps => {
    if ('value' in nextProps) {
      this.setState({ value: this.formatValue(nextProps, nextProps.value) })
    }
    if ('expandedKeys' in nextProps) {
      this.setState({ expandedKeys: nextProps.expandedKeys })
    }
    if (!objectDeepEquals(this.props.dict, nextProps.dict)) {
      this.setState(this.getTreeDataDetail(this.state.inputValue, nextProps))
    }
  }

  componentWillUpdate(nextProps, nextState) {
    this.props = nextProps
    this.state = nextState
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
    if (this.props.disabled) {
      return
    }
    this.setOpenState(open)
  }

  onKeyDown = event => {
    if (this.props.disabled) {
      return
    }
    if (!this.state.open) {
      const keyCode = event.keyCode
      if (keyCode === KeyCode.ENTER || keyCode === KeyCode.DOWN) {
        this.setOpenState(true)
        event.preventDefault()
      }
    }
  }

  onMenuSelect = (val, text) => {
    const value = this.state.value
    const props = this.props
    const { textInValue } = props
    const selectedValue = textInValue ? { val, text } : val
    props.onSelect(selectedValue)
    this.fireChange([...value, ...this.formatValue(props, selectedValue)])
  }

  onMenuDeselect = (val, text) => {
    let value = this.state.value
    const props = this.props
    const { textInValue } = props
    const selectedValue = textInValue ? { val, text } : val
    this.props.onDeselect(selectedValue)
    this.fireChange(value.filter(v => v.val !== val))
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
    if (value.length) {
      const newValue = value.filter(v => v.disabled)
      if (value.length !== newValue.length) {
        this.fireChange(newValue)
      }
    }
  }

  getPlaceholderElement = () => {
    const props = this.props
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
/*    if (this.state.inputValue && !open) {
      setTimeout(() => {
        this.onInputChange('')
      }, 300)
    }*/
    this.setState({ open })
  }

  formatValue = (props, value) => {
    const { dict, textInValue } = props
    let newValue = []
    toArray(value).forEach(v => {
      const detailValue = dict.find(o => o.val === v)
      if (detailValue) {
        newValue.push(detailValue)
      } else {
        if (textInValue) {
          newValue.push(v)
        }
      }
    })
    return newValue
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
    const sortedValue = [
      ...value.filter(v => !props.dict.some(o => o.val === v.val)),
      ...props.dict.filter(o => value.some(v => v.val === o.val))
    ]
    if (sortedValue.length > 0) {
      return sortedValue.map(v => {
        if (props.textInValue) {
          return { val: v.val, text: v.text }
        }
        return v.val
      })
    }
    return null
  }

  updatePopupAlign = () => {
    setTimeout(() => {
      if (this.selectTriggerRef && this.selectTriggerRef.triggerRef) {
        this.selectTriggerRef.triggerRef.forcePopupAlign()
      }
    }, 10)
  }

  renderContentNode = () => {
    const { title } = this.props
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

  getAllParents = (treeData, item) => {
    let parents = []
    let parentVal = item.parentVal
    while (parentVal) {
      const par = treeData.find(t => t.val === parentVal)
      parents.push(par)
      parentVal = par.parentVal
    }
    return parents
  }

  filterOption = (inputValue, option) => {
    const { filter } = this.props
    if (!inputValue) {
      return true
    }
    return filter(inputValue, option)
  }

  getTreeDataDetail = (inputValue, props) => {
    let treeData
    if (props.onSearchKeyChange || !inputValue) {
      treeData = props.dict || []
    } else {
      const treeDataDry = props.dict.filter(d => this.filterOption(inputValue, d))
      treeData = [...treeDataDry]
      treeDataDry.forEach(d => {
        const parents = this.getAllParents(props.dict, d)
        parents.forEach(p => {
          if (!treeData.some(t => t.val === p.val)) {
            treeData.push(p)
          }
        })
      })
    }
    let expandedKeys = []
    if ('expandedKeys' in props) {
      expandedKeys = props.expandedKeys
    } else {
      if (inputValue) {
        expandedKeys = treeData.filter(t => treeData.some(d => d.parentVal === t.val)).map(da => da.val)
      } else {
        if (props.dict.length > 0) {
          const rootOptions = props.dict.filter(d => !d.parentVal)
          if (rootOptions.length === 1) {
            expandedKeys = [rootOptions[0].val]
          }
        }
      }
    }
    return { treeData, expandedKeys }
  }

  onInputChange = val => {
    const { onSearchKeyChange } = this.props
    this.setState({ inputValue: val, ...this.getTreeDataDetail(val, this.props) })
    if (onSearchKeyChange) {
      onSearchKeyChange(val)
    }
  }

  onExpandChange = expandedKeys => {
    const props = this.props
    if (!('expandedKeys' in props)) {
      this.setState({ expandedKeys })
    }
    props.onExpandChange(expandedKeys)
  }

  render() {
    const props = this.props
    const { open, inputValue, value, expandedKeys, treeData } = this.state
    const rootCls = {
      [props.className]: !!props.className,
      [prefixCls]: 1,
      [`${prefixCls}-open`]: open,
      [`${prefixCls}-disabled`]: props.disabled,
      [`${prefixCls}-${props.size}`]: props.size,
    }
    let selectNode = (
      <SelectTrigger
        prefixCls={prefixCls}
        showSearch={props.showSearch}
        dict={props.dict}
        filter={props.filter}
        searchNotFoundTips={props.searchNotFoundTips}
        noOptionTips={props.noOptionTips}
        visible={open}
        inputValue={inputValue}
        menuSelectedKeys={value.map(v => v.val)}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
        getPopupContainer={this.getPopupContainer}
        onMenuSelect={this.onMenuSelect}
        onMenuDeselect={this.onMenuDeselect}
        onInputChange={this.onInputChange}
        onSearchKeyChange={props.onSearchKeyChange}
        searchPlaceholder={props.searchPlaceholder}
        dropdownClassName={props.dropdownClassName}
        dropdownStyle={props.dropdownStyle}
        size={props.size}
        expandedKeys={expandedKeys}
        onExpandChange={this.onExpandChange}
        onLoadChildren={props.onLoadChildren}
        treeData={treeData}
        ref={saveRef(this, 'selectTriggerRef')}
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
          <span
            key="arrow"
            className={`${prefixCls}-arrow`}
            style={UNSELECTABLE_STYLE}
            {...UNSELECTABLE_ATTRIBUTE}
          />
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

