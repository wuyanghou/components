/**
 * 通用日期范围选择组件，在antd的DatePicker组件基础上做了一些优化：
 * 1、使用字符串YYYY-MM-DD格式的日期，取代原先的moment类型
 * 2、修复问题，如日期选择浮层不能随页面滚动、焦点状态的处理
 * 3、默认为大号
 *
 * @property {[string, string]?}   defaultValue     初始值
 * @property {[string, string]?}   value            值
 * @property {function([string, string])?} onChange 值变化时的回调函数
 * @property {function?} onFocus          获得焦点时的回调函数
 * @property {function?} onBlur           失去焦点时的回调函数
 *
 * 其他属性参见antd的DatePicker组件：https://ant.design/components/date-picker-cn/
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { DatePicker } from 'antd'
import { momentToDate, dateToMoment } from '../utils/form'
import { hasClass, addClass, removeClass, findFirstParent } from '../utils/dom'
import moment from 'moment'

const { RangePicker } = DatePicker

class DateRangePicker extends React.Component {
  constructor(props) {
    super(props)
    let value = [null, null]
    if('value' in this.props){
      value = this.props.value
    }else if('defaultValue' in this.props){
      value = this.props.defaultValue
    }
    this.state = {
      $container: document,  //承载日期选择浮层的DOM元素
      value,  //值
    }
  }

  componentDidMount() {
    const { popupContainer } = this.props
    this.$main = ReactDOM.findDOMNode(this._main)
    if (!popupContainer) {
      let $container
      const modalWraps = document.querySelectorAll('.ant-modal-wrap')
      if(modalWraps.length > 0){
        $container = modalWraps[modalWraps.length -1]
      }else{
        $container = findFirstParent(this.$main, '.Page-scroller')
      }
      this.setState({ $container })
    }

    this.$input = this.$main.querySelector('.ant-calendar-picker-input')

    this.$input.addEventListener('focus', this.handleInputFocus, false)
    this.$input.addEventListener('blur', this.handleInputBlur, false)
  }

  componentWillReceiveProps(nextProps) {
    if('value' in nextProps){
      this.setState({ value: nextProps.value })
    }
  }

  componentWillUnmount() {
    this.$input.removeEventListener('focus', this.handleInputFocus, false)
    this.$input.removeEventListener('blur', this.handleInputBlur, false)
  }

  /**
   * 输入框获得焦点时触发onFocus回调函数
   */
  handleInputFocus = () => {
    const { onFocus } = this.props
    if(onFocus){
      onFocus()
    }
  }

  /**
   * 输入框失去焦点且日期选择浮层没有打开时触发onBlur回调函数
   */
  handleInputBlur = () => {
    const { onBlur } = this.props
    if(!this.open && onBlur){
      onBlur()
    }
  }

  /**
   * 值变化时，1、如果父组件没有传入value，则更新内部状态，否则不更新，由父组件控制值  2、触发回调  3、日期值格式化为字符串YYYY-MM-DD
   * @param  {object} value moment格式的日期值
   */
  handleChange = (value) => {
    const { onChange } = this.props
    const start = value ? value[0] : null
    const end = value ? value[1] : null
    const formatedVal = [start ? momentToDate(start) : null, end ? momentToDate(value[1]) : null]
    if(!('value' in this.props)){
      this.setState({ value: formatedVal })
    }
    if(onChange){
      onChange(formatedVal)
    }
    this.$input.focus()
  }

  /**
   * 日期选择浮层打开/关闭时，焦点状态的处理
   * @param  {boolean} open 浮层打开状态
   */
  handleOpenChange = (open) => {
    const { onFocus, onBlur, onOpenChange, ranges } = this.props
    this.open = open
    if(open){
      if (onFocus) {
        onFocus()
      }
      addClass(this.$input, 'focus')
      setTimeout(() => document.querySelectorAll('.ant-calendar').forEach(n => ranges ? addClass(n, 'hasRanges') : removeClass(n, 'hasRanges')))
    }else{
      if (onBlur) {
        onBlur()
      }
      removeClass(this.$input, 'focus')
    }
    if(onOpenChange){
      onOpenChange(open)
    }
  }

  render() {
    const { defaultValue, value: valueProp, onChange, onOpenChange, getCalendarContainer, popupContainer, format,
      onFocus, onBlur, size: sizeProp, showToday, ...props
    } = this.props
    const { $container, value } = this.state

    let size = 'large'
    if (sizeProp === 'small') {
      size = undefined
    } else if (sizeProp === 'xSmall') {
      size = 'small'
    }

    return (
      <RangePicker
        value={value ? [dateToMoment(value[0]), dateToMoment(value[1])] : []}
        onChange={this.handleChange}
        onOpenChange={this.handleOpenChange}
        getCalendarContainer={() => popupContainer || $container}
        size={size}
        ranges={showToday ? {'返回今天': [moment(), moment()]} : null}
        {...props}
        ref={c => this._main = c}
      />
    )
  }
}

DateRangePicker.defaultProps = {
  'showToday': true
}

export default DateRangePicker
