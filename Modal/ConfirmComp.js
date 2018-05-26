
import Modal from './Modal'
import Button from '../Button'
import { Icon } from 'antd'
import classnames from 'classnames'
import PropTypes from 'prop-types'

const prefixCls = 'ant-confirm'
const noop = () => {}

class Confirm extends React.Component {

  static defaultProps = {
    iconType: 'question-circle',
    width: 416,
    style: {},
    okText: '确定',
    cancelText: '取消',
    onCancel: noop,
    onOk: noop,
    onClose: noop,
  }

  onCancel = () => {
    this.props.onCancel()
    this.props.close()
  }

  onOk = () => {
    this.props.onOk()
    this.props.close()
  }

  render() {
    const props = this.props
    const { onCancel, onOk, close, zIndex, iconType, width, style, okText, cancelText, className, title, content } = props

    const classString = classnames(
      prefixCls,
      `${prefixCls}-confirm`,
      className,
    )

    return (
      <Modal
        className={classString}
        onClose={close}
        onOk={this.onOk}
        onCancel={this.onCancel}
        title=""
        transitionName="zoom"
        footer=""
        maskTransitionName="fade"
        style={style}
        width={width}
        zIndex={zIndex}
        closable={true}
      >
        <div className={`${prefixCls}-body-wrapper`}>
          <div className={`${prefixCls}-body`}>
            <Icon type={iconType} />
            <span className={`${prefixCls}-title`}>{title}</span>
            <div className={`${prefixCls}-content`}>{content}</div>
          </div>
          <div className={`${prefixCls}-btns`}>
            <Button onClick={this.onCancel}>{cancelText}</Button>
            <Button onClick={this.onOk} type="primary">{okText}</Button>
          </div>
        </div>
      </Modal>
    )
  }
}

export default Confirm