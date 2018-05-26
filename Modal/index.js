/**
 * 通用模态框组件，基于antd的Modal组件，提供基础功能，如加载状态、底部按钮提示
 * @property {boolean?} loading  模态框加载状态
 * @property {string?} error 内容加载错误信息
 * @property {boolean?} okBtnShow  确定按钮显示状态，默认为true
 * @property {boolean?} cancelBtnShow  取消按钮显示状态，默认为true
 * @property {string?} okText  确定按钮文字，默认为“提交”
 * @property {string?} cancelText  确定按钮文字，默认为“取消”
 * @property {boolean?} noLine  去除顶部栏和底部栏的线，默认为false
 * @property {string?} className  页面最外层容器附加类名
 * @property {Object?} cancelConfirm 取消按钮点击确认框配置信息，结构如下：
 * {
 *   content, {ReactNode} - 信息内容
 *   okBtnText, {string?} - 确定按钮的文字
 *   cancelBtnText {string?} - 取消按钮的文字
 * }
 * @property {boolean?} fixedLoading - 加载动画相对窗口固定定位
 *
 * 公用方法：showOkTips
 *
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'dva'
import ModalComp from './Modal'
import { Modal as AntdModal } from 'antd'
import confirm from './confirm'

class Modal extends React.Component {

  componentDidMount() {
    this.props.pushModal(this.modalRef)
  }

  componentWillUnmount() {
    this.props.popModal()
  }

  showOkTips = (text) => {
    this.modalRef.showOkTips(text)
  }

  render() {
    return <ModalComp {...this.props} ref={c => this.modalRef = c} />
  }
}

Modal.confirm = confirm
Modal.warning = AntdModal.warning
Modal.success = AntdModal.success
Modal.error = AntdModal.error
Modal.info = AntdModal.info

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    pushModal(modal) {
      dispatch({
        type: 'main/pushModal',
        payload: {modal: modal},
      })
    },
    popModal() {
      dispatch({
        type: 'main/popModal',
      })
    }
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps ,mapDispatchToProps, mergeProps, { withRef: true })(Modal)
