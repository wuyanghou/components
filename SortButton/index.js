/**
 * 排序按钮，点击时依次切换排序状态为“由低到高”、“由高到低”、“清除排序”
 */
import React, { cloneElement } from 'react'
import styles from './styles.less'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import Icon from '../Icon'

const noop = () => {}

class SortButton extends React.Component {
  static propTypes = {
    ascTitle: PropTypes.string,  //升序状态下鼠标悬浮时的标题
    children: PropTypes.node,  //按钮内容
    className: PropTypes.string,  //附加在根元素上的类名
    descTitle: PropTypes.string,  //降序状态下鼠标悬浮时的标题
    onChange: PropTypes.func,  //状态变化时的回调
    style: PropTypes.object,  //附加在根元素上的样式
    title: PropTypes.string,  //默认状态下鼠标悬浮时的标题
    value: PropTypes.oneOf(['asc', 'desc']),  //排序状态值
  }
  static defaultProps = {
    onChange: noop,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value || null
    }
  }

  componentWillReceiveProps(nextProps) {
    if ( 'value' in nextProps ) {
      this.setState({
        value: nextProps.value
      })
    }
  }

  onClick = () => {
    const props = this.props
    const { value } = this.state
    const nextValue = value ? ( value === 'asc' ? 'desc' : null ) : 'asc'
    if (!( 'value' in props )) {
      this.setState({
        value: nextValue
      })
    }
    props.onChange(nextValue)
  }

  render() {
    const props = this.props
    const { children, className, style } = props
    const { value } = this.state
    const cls = {
      SortButton: 1,
      [`SortButton-${value}`]: !!value,
      [className]: !!className,
    }
    const isStringChildren = typeof children === 'string'
    let title = 'title' in props ? props.title : `点击后${isStringChildren ? '按' + children : ''}由低到高排序`
    let ascTitle = 'title' in props ? props.title : `点击后${isStringChildren ? '按' + children : ''}由高到低排序`
    let descTitle = 'title' in props ? props.title : `点击后清除${isStringChildren ? '按' + children : ''}排序`

    return (
      <Tooltip title={value ? ( value === 'asc' ? ascTitle : descTitle ) : title}>
        <div className={classnames(cls)} style={style} onClick={this.onClick}>
          <div className="SortButton-content">
            {children}
          </div>
          <div className="SortButton-arrows">
            <Icon type="triangle_up" size={10} className="SortButton-arrow-up"/>
            <Icon type="triangle_down" size={10} className="SortButton-arrow-down" />
          </div>
        </div>
      </Tooltip>
    )
  }
}

class Group extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,  //排序按钮集合
    className: PropTypes.string,  //附加在根元素上的类名
    onChange: PropTypes.func,  //状态变化时的回调
    style: PropTypes.object,  //附加在根元素上的样式
    value: PropTypes.shape({ name: PropTypes.string, type: PropTypes.oneOf(['asc', 'desc'])}),  //值，排序名称、类型
  }
  static defaultProps = {
    onChange: noop,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value || null
    }
  }

  componentWillReceiveProps(nextProps) {
    if ( 'value' in nextProps ) {
      this.setState({
        value: nextProps.value
      })
    }
  }

  btnValueChange = (name, val) => {
    const newValue = val ? {
      name,
      type: val,
    } : null
    if (!('value' in this.props)) {
      this.setState({ value: newValue })
    }
    this.props.onChange(newValue)
  }

  render() {
    const props = this.props
    const { children, className, style } = props
    const { value } = this.state
    const activeBtnName = value ? value.name : null
    const activeBtnType = value ? value.type : null
    const newChildren = children.map(btn => {
      const { name } = btn.props
      return cloneElement(btn, {
        key: name,
        value: activeBtnName === name ? activeBtnType : null,
        onChange: val => this.btnValueChange(name, val),
      })
    })
    const cls = {
      SortButtonGroup: 1,
      [className]: !!className,
    }
    return (
      <div className={classnames(cls)} style={style}>
        {newChildren}
      </div>
    )
  }
}

SortButton.Group = Group

export default SortButton










