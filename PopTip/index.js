/**
 * 气泡提示框
 */
import React from 'react'
import vars from '../theme/variables'
import Popover from '../Popover'
import PropTypes from 'prop-types'

const noop = () => {}

class PopTip extends React.Component {

  static propTypes = {
    content: PropTypes.node,  //弹框内容
    icon: PropTypes.oneOf(['info', 'warning', 'error']),  //图标类型
    maxWidth: PropTypes.number,  //最大宽度（px）
    visible: PropTypes.bool,  //显示状态
    onClose: PropTypes.func,   //关闭时的回调
    onVisibleChange: PropTypes.func,   //显示状态变化时的回调
    placement: PropTypes.oneOf([
      'topLeft', 'top', 'topRight'
    ]),  //弹框在目标元素上弹出的位置
    arrowPointAtCenter: PropTypes.bool,  //弹框的箭头固定指向目标元素中心
    getPopupContainer: PropTypes.func,  //获取承载弹框的DOM元素
    children: PropTypes.node,  //目标元素
    btnText: PropTypes.string,   //取消按钮文字
    overlayClassName: PropTypes.string,  //附加在弹框根元素的类名
    overlayStyle: PropTypes.object,  //附加在弹框根元素的样式
  }
  static defaultProps = {
    icon: 'error',
    maxWidth: 200,
    getPopupContainer: noop,
    onClose: noop,
    onVisibleChange: noop,
    btnText: '知道了',
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

  close = () => {
    const { onVisibleChange, onClose } = this.props
    if (!('visible' in this.props)) {
      this.setState({ visible: false })
    }
    onVisibleChange(false)
    onClose()
  }

  handleVisibleChange = (visible) => {
    const { onVisibleChange, onClose } = this.props
    if (!('visible' in this.props)) {
      this.setState({ visible })
    }
    onVisibleChange(visible)
    if (!visible) {
      onClose()
    }
  }

  render() {
    const { content, icon, maxWidth, onClose, onVisibleChange, placement: placementProp, arrowPointAtCenter, getPopupContainer, 
      children, btnText, overlayClassName, overlayStyle } = this.props
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
        okBtnText={btnText}
        onOk={this.close}
        getPopupContainer={getPopupContainer}
        maxWidth={maxWidth}
        overlayClassName={overlayClassName}
        overlayStyle={overlayStyle}
      >
        {children}
      </Popover>
    )
  }
}

export default PopTip
