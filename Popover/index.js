/**
 * 气泡弹框
 */
import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import { Popover as AntdPopover, Icon } from 'antd'
import vars from '../theme/variables'
import TextLink from '../TextLink'
import './styles.less'
import PropTypes from 'prop-types'

const noop = () => {}

class Popover extends React.Component {

  static propTypes = {
    title: PropTypes.node,  //弹框标题
    content: PropTypes.node,  //弹框内容
    trigger: PropTypes.oneOf(['click']),  //打开弹框的触发方式，不传为鼠标悬浮触发
    icon: PropTypes.oneOf(['info', 'warning', 'error']),  //弹框图标类型
    maxWidth: PropTypes.number,  //弹框最大宽度（px）
    visible: PropTypes.bool,  //弹框显示状态
    onClose: PropTypes.func,   //关闭弹框时的回调
    onVisibleChange: PropTypes.func,   //弹框显示状态变化时的回调
    placement: PropTypes.oneOf([
      'topLeft', 'top', 'topRight', 'leftTop', 'left', 'leftBottom', 'rightTop', 'right', 'rightBottom', 'bottomLeft', 'bottom', 'bottomRight'
    ]),  //弹框在目标元素上弹出的位置
    arrowPointAtCenter: PropTypes.bool,  //弹框的箭头固定指向目标元素中心
    getPopupContainer: PropTypes.func,  //获取承载弹框的DOM元素
    children: PropTypes.node,  //目标元素内容
    footer: PropTypes.node,  //弹框底部栏
    okBtnShow: PropTypes.bool,   //弹框是否显示确定按钮
    cancelBtnShow: PropTypes.bool,   //弹框是否显示取消按钮
    onOk: PropTypes.func,   //弹框确定按钮点击回调
    onCancel: PropTypes.func,   //弹框取消按钮点击回调
    okBtnText: PropTypes.string,   //弹框确定按钮文字
    cancelBtnText: PropTypes.string,   //弹框取消按钮文字
    overlayClassName: PropTypes.string,  //附加在弹框根元素的类名
    overlayStyle: PropTypes.object,  //附加在弹框根元素的样式
  }
  static defaultProps = {
    getPopupContainer: noop,
    onClose: noop,
    onVisibleChange: noop,
    onOk: noop,
    onCancel: noop,
    okBtnText: '确定',
    cancelBtnText: '取消',
  }

  getPopupContainer = (ele) => {
    return (
      this.props.getPopupContainer(ele) ||
      document.body
    )
  }

  handleVisibleChange = (visible) => {
    this.props.onVisibleChange(visible)
    if(!visible){
      this.props.onClose()
    }
  }

  render () {
    const { 
      title, content, trigger, icon, maxWidth, visible, onClose, onVisibleChange, placement, arrowPointAtCenter, getPopupContainer, 
      children, footer, okBtnShow, cancelBtnShow, onOk, onCancel, okBtnText, cancelBtnText, overlayClassName, overlayStyle,
    } = this.props
    let iconType
    let iconColor
    if (icon === 'info') {
      iconType = 'info-circle'
      iconColor = vars.infoColor
    } else if (icon === 'warning') {
      iconType = 'exclamation-circle'
      iconColor = vars.warningColor
    } else if (icon === 'error') {
      iconType = 'close-circle'
      iconColor = vars.highlightColor
    }
    const contentCls = {
      'Popover-content': 1,
      'Popover-content-hasIcon': iconType,
    }
    let contentComp = (
      <div className={classnames(contentCls)} style={maxWidth ? { maxWidth: maxWidth - 32 } : null}>
        {iconType &&
          <div className="Popover-icon-wrap">
            <div className="Popover-icon">
              <Icon type={iconType} style={{ color: iconColor }} />
            </div>
          </div>
        }
        <div className="Popover-body">
          {content}
        </div>
        {(okBtnShow || cancelBtnShow) &&
          <div className="Popover-footer">
            {!footer && okBtnShow &&
              <TextLink onClick={onOk}>{okBtnText || '确定'}</TextLink>
            }
            {!footer && cancelBtnShow &&
              <TextLink onClick={onCancel} type="secondary" style={{ marginLeft: 20 }}>{cancelBtnText || '取消'}</TextLink>
            }
            {footer}
          </div>
        }
      </div>
    )

    const overlayCls = {
      'Popover': 1,
      [overlayClassName]: !!overlayClassName,
    }

    const visibleProp = 'visible' in this.props ? { visible } : {}

    return (
      <AntdPopover
        title={title}
        content={contentComp}
        trigger={trigger}
        onVisibleChange={this.handleVisibleChange}
        placement={placement}
        arrowPointAtCenter={arrowPointAtCenter}
        getPopupContainer={this.getPopupContainer}
        overlayClassName={classnames(overlayCls)}
        overlayStyle={overlayStyle}
        {...visibleProp}
      >
        {children}
      </AntdPopover>
    )
  }
}

export default Popover
