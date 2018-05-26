import Modal from 'COMPONENT/Modal'

/**
 * 显示提示弹框
 * @param  {string} content 提示文案
 * @param  {function?} onOk  点击确定按钮后的回调
 */
const showAlert = (content, onOk) => {
  Modal.warning({
    content,
    onOk,
  })
}

export default showAlert
