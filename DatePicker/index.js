import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import Trigger from 'rc-trigger'
import KeyCode from 'rc-util/lib/KeyCode'
import { momentToDate, dateToMoment, DATE_FORMAT } from '../utils/form'
import { findFirstParent } from '../utils/dom'
import { datePickerPropTypes, datePickerDefaultPropTypes } from './propTypes'
import Calendar from './Calendar'
import zhCN from './locale/zh_CN'
import './styles/index.less'
import './styles/Calendar.less'
import Validator from '../Validator'
import Input from '../Input'
import Icon from '../Icon'
import IconButton from '../IconButton'
import styleVars from '../theme/variables'

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
  bottomRight: {
    points: ['tr', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topRight: {
    points: ['br', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
}
const UNSELECTABLE_STYLE = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
}
const UNSELECTABLE_ATTRIBUTE = {
  unselectable: 'unselectable',
}
const saveRef = (instance, name) => {
  return (node) => {
    instance[name] = node
  }
}
const prefixCls = 'DatePicker'
const dropdownPrefixCls = 'Dropdown'

export default class DatePicker extends React.Component {
  static propTypes = datePickerPropTypes
  static defaultProps = datePickerDefaultPropTypes

  constructor(props) {
    super(props)
    const value = this.getValueFromProps(props)
    this.state = {
      value,
      inputValue: value || '',
      open: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setValue(this.getValueFromProps(nextProps))
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.open && prevState.open) {
      if (!this._rootFocused) {
        this.timeoutBlur()
      }
    }
  }

  timeoutFocus = () => {
    if (!this.focusTimer && !this.blurTimer) {
      this.focusTimer = setTimeout(() => {
        if (this._rootFocused) {
          this.props.onFocus()
        }
        this.clearFocusTimer()
      }, 10)
    } else {
      this.clearFocusTimer()
      this.clearBlurTimer()
    }
  }

  timeoutBlur = () => {
    if (!this.focusTimer && !this.blurTimer) {
      this.blurTimer = setTimeout(() => {
        if (!this._rootFocused) {
          this.props.onBlur()
        }
        this.clearBlurTimer()
      }, 10)
    } else {
      this.clearFocusTimer()
      this.clearBlurTimer()
    }
  }

  clearFocusTimer = () => {
    clearTimeout(this.focusTimer)
    this.focusTimer = null
  }

  clearBlurTimer = () => {
    clearTimeout(this.blurTimer)
    this.blurTimer = null
  }

  getValueFromProps = props => {
    const { value, disabledDate } = props
    if ('value' in props && (!disabledDate || !disabledDate(value))) {
      return value
    }
    return null
  }

  setValue = value => {
    this.setState({
      value,
      inputValue: value || '',
    })
  }

  onCalendarSelect = (mValue, cause = {}) => {
    const props = this.props
    const value = momentToDate(mValue)
    if (!('value' in props)) {
      this.setValue(value)
    }
    if (cause.source !== 'dateInput' && cause.source !== 'todayButton') {
      this.closePanel()
    }
    props.onChange(value)
  }

  rootFocus = () => {
    ReactDOM.findDOMNode(this.rootRef).focus()
  }

  getInputElement = () => {
    return ReactDOM.findDOMNode(this.inputCompRef).querySelector('input')
  }

  inputFocus = () => {
    this.getInputElement().focus()
  }

  onKeyDown = (event) => {
    if (!this.props.disabled && event.keyCode === KeyCode.DOWN && !this.state.open) {
      this.setState({ open: true })
      event.preventDefault()
    }
  }

  onInputChange = (v, callback) => {
    const { disabledDate } = this.props
    let changed = { inputValue: v }
    const m = dateToMoment(v)
    if ((m || v === '') && !disabledDate(v)) {
      this.calendarRef.onDateInputChange(m)
      changed = { ...changed, value: v }
    }
    this.setState(changed, callback)
  }

  closePanel = () => {
    this.setState({ open: false }, () => {
      this.synInputValue()
    })
  }

  synInputValue = () => {
    this.setState({ inputValue: this.state.value || '' })
  }

  onPanelOpenChange = (open) => {
    if (!this.props.disabled && this.state.open !== open) {
      if (open) {
        this.setState({ open }, this.inputFocus)
      } else {
        setTimeout(() => {
          if ( document.activeElement !== this.getInputElement() ) {
            this.setState({ open }, this.synInputValue)
            const rootElement = ReactDOM.findDOMNode(this.rootRef)
            if (!open && document.activeElement !== rootElement) {
              rootElement.blur()
            }
          }
        })
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

  onRootFocus = (e) => {
    if (this.props.disabled) {
      e.preventDefault()
      return
    }
    if (!this._rootFocused) {
      this._rootFocused = true
      if (!this.state.open) {
        this.timeoutFocus()
      }
    }
  }

  onRootBlur = (e) => {
    if (this.props.disabled) {
      e.preventDefault()
      return
    }
    this._rootFocused = false
    if (!this.state.open ) {
      this.timeoutBlur()
    }
  }

  onRootClick = (e) => {
    if (this.props.disabled) {
      e.preventDefault()
      return
    }
    this.props.onClick(e)
  }

  clear = e => {
    e.stopPropagation()
    this.onInputChange('', this.inputFocus)
  }

  render() {
    const props = this.props
    const state = this.state
    const { open, inputValue, value } = state
    const { className, disabled, size, dropdownClassName } = props
    const rootCls = {
      [prefixCls]: 1,
      [`${prefixCls}-open`]: open,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-${size}`]: size,
      [className]: !!className,
    }
    const popupCls = {
      [`${prefixCls}-dropdown`]: 1,
      [`${prefixCls}-dropdown-${size}`]: !!props.size,
      [dropdownClassName]: !!dropdownClassName,
    }
    const clearShow = !disabled && open && inputValue
    const clearCls = {
      [`${prefixCls}-clear`]: 1,
      [`${prefixCls}-clear-show`]: clearShow,
    }

    const calendar = (
      <Calendar
        locale={zhCN}
        style={{ zIndex: 1000 }}
        formatter={DATE_FORMAT}
        showDateInput={false}
        selectedValue={dateToMoment(value)}
        onSelect={this.onCalendarSelect}
        disabledDate={m => props.disabledDate(momentToDate(m))}
        prefixCls={`${prefixCls}-calendar`}
        ref={saveRef(this, 'calendarRef')}
      />
    )

    let mainNode = (
      <Trigger
        action={['click']}
        popupPlacement={props.popupPlacement}
        builtinPlacements={BUILT_IN_PLACEMENTS}
        prefixCls={dropdownPrefixCls}
        popupTransitionName={`${dropdownPrefixCls}-slide-up`}
        onPopupVisibleChange={this.onPanelOpenChange}
        popup={calendar}
        popupVisible={state.open}
        getPopupContainer={this.getPopupContainer}
        popupClassName={classnames(popupCls)}
        popupStyle={props.dropdownStyle}
      >
        <div
          tabIndex={0}
          onKeyDown={this.onKeyDown}
          onBlur={this.onRootBlur}
          onFocus={this.onRootFocus}
          onClick={this.onRootClick}
          title={props.title}
          className={classnames(rootCls)}
          style={props.style}
          ref={saveRef(this, 'rootRef')}
        >
          <div key="input" className={`${prefixCls}-input`}>
            <Input
              placeholder={props.placeholder}
              disabled={props.disabled}
              value={state.inputValue}
              onChange={e => this.onInputChange(e.target.value)}
              ref={saveRef(this, 'inputCompRef')}
            />
          </div>
          <IconButton
            key="clear"
            type="cross_circle"
            color={styleVars.primaryColor}
            style={UNSELECTABLE_STYLE}
            {...UNSELECTABLE_ATTRIBUTE}
            className={classnames(clearCls)}
            onClick={this.clear}
          />
          {!clearShow &&
            <Icon
              key="icon"
              type="calendar"
              color={props.disabled ? styleVars.fontColorTips : styleVars.primaryColor}
              className={`${prefixCls}-icon`}
              style={UNSELECTABLE_STYLE}
              {...UNSELECTABLE_ATTRIBUTE}
            />
          }
        </div>
      </Trigger>
    )

    if (props.validator) {
      mainNode = (
        <Validator value={value} {...props.validator}>
          {mainNode}
        </Validator>
      )
    }

    return mainNode
  }
}

