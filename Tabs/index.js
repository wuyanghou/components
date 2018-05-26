/**
 * 页签组，用于局部内容切换
 */
import React, { cloneElement } from 'react'
import styles from './styles.less'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import Icon from '../Icon'

const noop = () => {}

class Tabs extends React.Component {
  static propTypes = {
    activeKey: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),  //激活状态的页签key
    children: PropTypes.node.isRequired,  //页签集合
    className: PropTypes.string,  //附加在根元素上的类名
    defaultActiveKey: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),  //首次加载时，默认激活状态的页签key
    onChange: PropTypes.func,  //当期激活的页签改变时的回调
    style: PropTypes.object,  //附加在根元素上的样式
    type: PropTypes.oneOf(['card', 'button', 'line']),  //款式类型
    navAlign: PropTypes.oneOf(['center', 'right']),  //导航按钮对齐方式
  }
  static defaultProps = {
    onChange: noop,
  }

  constructor(props) {
    super(props)
    const { defaultActiveKey, activeKey } = props
    let key = null
    if ('activeKey' in props) {
      key = props.activeKey
    } else if ('defaultActiveKey' in props) {
      key = props.defaultActiveKey
    }
    this.state = {
      activeKey: key
    }
  }

  componentWillReceiveProps(nextProps) {
    if ( 'activeKey' in nextProps ) {
      this.setState({
        activeKey: nextProps.activeKey
      })
    }
  }

  tabBtnClick = (key) => {
    if (this.state.activeKey !== key) {
      this.setState({ activeKey: key })
      this.props.onChange(key)
    }
  }

  render() {
    const props = this.props
    const { children, className, style, type, navAlign } = props
    const { activeKey } = this.state
    const typeClassName = type || 'default'
    const cls = {
      Tabs: 1,
      clearfix: 1,
      [`Tabs-${typeClassName}`]: 1,
      [className]: !!className,
    }
    let tabBtns = []
    let tabPanels = []
    children.forEach((c, i) => {
      const props = c.props
      const value = props.value || i
      const isActive = activeKey === null ? i === 0 : activeKey === value
      const btnCls = {
        'Tab-btn': 1,
        'Tab-btn-active': isActive,
      }
      const panelCls = {
        'Tab-panel': 1,
        'Tab-panel-active': isActive,
        [props.className]: !!props.className,
      }
      tabBtns.push(
        <div key={value} className={classnames(btnCls)} onClick={() => this.tabBtnClick(value)}>{props.title}</div>
      )
      tabPanels.push(
        <div key={value} className={classnames(panelCls)} style={props.style}>{props.children}</div>
      )
    })

    const navbarCls = {
      'Tabs-navbar': 1,
      'clearfix': 1,
      [`Tabs-navbar-${navAlign}`]: !!navAlign,
    }

    return (
      <div className={classnames(cls)} style={style}>
        <div className={classnames(navbarCls)}>
          {tabBtns}
        </div>
        <div className="Tabs-content">
          {tabPanels}
        </div>
      </div>
    )
  }
}

class Tab extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),  //唯一标识
    children: PropTypes.node,  //内容
    title: PropTypes.node.isRequired,  //标题
    className: PropTypes.string,  //附加在根元素上的类名
    style: PropTypes.object,  //附加在根元素上的样式
  }

  render() {
    console.log(this.props)
    return (
      <div {...this.props}></div>
    )
  }
}

Tabs.Tab = Tab

export default Tabs










