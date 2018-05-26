/**
 * 气泡确认框
 */
import React from 'react'
import vars from '../theme/variables'
import Popover from '../Popover'
import PropTypes from 'prop-types'

const noop = () => {}

class PopConfirm extends React.Component {

  static propTypes = {
    content: PropTypes.node,  //弹框内容
    icon: PropTypes.oneOf(['info', 'warning', 'error']),  //弹框图标类型
    maxWidth: PropTypes.number,  //弹框最大宽度（px）
    visible: PropTypes.bool,  //弹框显示状态
    onVisibleChange: PropTypes.func,   //弹框显示状态变化时的回调
    placement: PropTypes.oneOf([
      'topLeft', 'top', 'topRight'
    ]),  //弹框在目标元素上弹出的位置
    arrowPointAtCenter: PropTypes.bool,  //弹框的箭头固定指向目标元素中心
    getPopupContainer: PropTypes.func,  //获取承载弹框的DOM元素
    children: PropTypes.node,  //目标元素内容
    onOk: PropTypes.func,   //弹框确定按钮点击回调
    onCancel: PropTypes.func,   //弹框取消按钮点击回调
    okBtnText: PropTypes.string,   //弹框确定按钮文字
    cancelBtnText: PropTypes.string,   //弹框取消按钮文字
    overlayClassName: PropTypes.string,  //附加在弹框根元素的类名
    overlayStyle: PropTypes.object,  //附加在弹框根元素的样式
  }
  static defaultProps = {
    getPopupContainer: noop,
    onVisibleChange: noop,
    onOk: noop,
    onCancel: noop,
    okBtnText: '确定',
    cancelBtnText: '取消',
    icon: 'warning',
    maxWidth: 200,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible || false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if('visible' in nextProps){
      this.setState({ visible: nextProps.visible })
    }
  }

  ok = () => {
    const { onOk } = this.props
    if (!('visible' in this.props)) {
      this.setState({ visible: false })
    }
    onOk()
  }

  cancel = () => {
    const { onCancel } = this.props
    if (!('visible' in this.props)) {
      this.setState({ visible: false })
    }
    onCancel()
  }

  show = () => {
    this.setState({ visible: true })
  }

  handleVisibleChange = (visible) => {
    const { onVisibleChange, onCancel } = this.props
    if (!('visible' in this.props)) {
      this.setState({ visible })
    }
    onVisibleChange(visible)
    if (!visible) {
      onCancel()
    }
  }

  render() {
    const { content, icon, maxWidth, onVisibleChange, placement: placementProp, arrowPointAtCenter, getPopupContainer, 
      children, onOk, onCancel, okBtnText, cancelBtnText, overlayClassName, overlayStyle,
    } = this.props
    const { visible } = this.state
    const placement = ['topLeft', 'top', 'topRight' ].indexOf(placementProp) >= 0 ? placementProp : 'top' 
    return (
      <Popover
        content={content}
        onVisibleChange={this.handleVisibleChange}
        trigger="click"
        visible={visible}
        icon={icon}
        okBtnShow
        okBtnText={okBtnText}
        onOk={this.ok}
        cancelBtnShow
        cancelBtnText={cancelBtnText}
        onCancel={this.cancel}
        placement={placement}
        arrowPointAtCenter={arrowPointAtCenter}
        maxWidth={maxWidth}
        getPopupContainer={getPopupContainer}
        overlayClassName={overlayClassName}
        overlayStyle={overlayStyle}
      >
        {children}
      </Popover>
    )
  }
}

export default PopConfirm
