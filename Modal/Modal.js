import React from 'react'
import { Modal as AntdModal } from 'antd'
import PopTip from '../PopTip'
import PopConfirm from '../PopConfirm'
import Loading from '../Loading'
import Button from '../Button'
import ErrorTips from '../ErrorTips'
import './styles.less'
import classnames from 'classnames'
import PropTypes from 'prop-types'

class Modal extends React.Component {
  
  static defaultProps = {
    closable: false,
    okText: '确定',
    cancelText: '取消',
  }

  constructor(props) {
    super(props)
    this.state = {
      okTips: null,  //确定按钮提示信息
      okTipsVisible: false,  //确定按钮提示信息显示状态
      $container: document,  //承载弹框浮层的DOM元素
    }
  }

  componentDidMount() {
    const modalWraps = document.querySelectorAll('.Modal')
    const $container = modalWraps[modalWraps.length - 1]
    this.setState({$container})
  }

  showOkTips = (text) => {
    this.setState({ okTips: text, okTipsVisible: true })
  }

  onOkTipsVisibleChange = (visible) => {
    if (!visible) {
      this.setState({ okTipsVisible: visible })
    }
  }

  onCancel = () => {
    if (this.props.cancelConfirm) {
      this._cancelConfirm.show()
    } else {
      this.cancel()
    }
  }

  cancel = () => {
    const { onCancel, onClose } = this.props
    if (onCancel) {
      onCancel()
    } else if (onClose) {
      onClose()
    }
  }

  close = () => {
    const { onCancel, onClose } = this.props
    if (onClose) {
      onClose()
    } else if (onCancel) {
      onCancel()
    }
  }

  render() {
    const { children, loading, okBtnDisabled, okBtnShow: okBtnShowProp, cancelBtnShow: cancelBtnShowProp, okText, cancelText, onOk, onCancel, onClose, closable,
      footer: footerProp, className, noLine, cancelConfirm, error, fixedLoading, ...props } = this.props
    const { okTips, okTipsVisible, $container } = this.state
    const okBtnShow = okBtnShowProp === undefined ? true : okBtnShowProp
    const cancelBtnShow = cancelBtnShowProp === undefined ? true : cancelBtnShowProp
    const {content: cancelConfirmContent, okBtnText: cancelConfirmOkBtnText, cancelBtnText: cancelConfirmCancelBtnText} = cancelConfirm || {}
    let cancelBtn = <Button onClick={this.onCancel}>{cancelText}</Button>
    if (cancelConfirm) {
      cancelBtn = (
        <PopConfirm
          content={cancelConfirmContent}
          okBtnText={cancelConfirmOkBtnText}
          cancelBtnText={cancelConfirmCancelBtnText}
          onOk={this.cancel}
          ref={c => this._cancelConfirm = c}
          getPopupContainer={() => $container}
        >
          {cancelBtn}
        </PopConfirm>
      )
    }
    const footer = (footerProp !== undefined ? footerProp : (
      <div>
        {okBtnShow &&
          <PopTip content={okTips} visible={okTipsVisible} onVisibleChange={this.onOkTipsVisibleChange} getPopupContainer={() => $container}>
            <Button type="primary" onClick={onOk} disabled={okBtnDisabled || loading}>{okText}</Button>
          </PopTip>
        }
        {cancelBtnShow &&
        cancelBtn
        }
      </div>
    ))

    const cls = {
      Modal: 1,
      'Modal-noLine': noLine,
      'Modal-fixedLoading': !!fixedLoading,
      [className]: !!className,
    }

    return (
      <AntdModal
        visible={true}
        maskClosable={false}
        wrapClassName={classnames(cls)}
        onCancel={this.close}
        footer={footer}
        closable={closable}
        zIndex={900}
        {...props}
        ref={c => this.modal = c}
      >
        {children}
        <Loading loading={loading}/>
        {error &&
        <div className="Modal-error">
          <ErrorTips text={error}/>
        </div>
        }
      </AntdModal>
    )
  }
}

export default Modal
