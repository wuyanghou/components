import Modal from 'COMPONENT/Modal'

/**
 * 显示确认弹框
 * @param  {string} content 提示文案
 * @param  {function} onOk  点击确定按钮后的回调
 * @param  {function?} onCancel  点击取消按钮后的回调
 */
const showConfirm = (content, onOk, onCancel) => {
  Modal.confirm({
    content,
    onOk,
    onCancel,
    iconType: 'exclamation-circle',
  })
}

export default showConfirm
