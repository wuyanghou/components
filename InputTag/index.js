/**
 * 带有输入控件的标签
 * @property {ReactNode[]} children - 左侧标签内容
 * @property {string} [size] - 大小，'small'|'xSmall'
 * @property {string} [type] - 输入类型，默认为文本输入框，可选'number'
 * @property {boolean} [closable] - 是否可关闭
 * @property {Function} [onClose] - 关闭时的回调
 * @property {string} [className] - 附加在根元素的类名
 * @property {object} [style] - 附加在根元素的样式
 * @property {object} [...props] - 输入框额其他属性
 * @property {Object} [validator] - 校验器的配置参数
 * @property {number} [inputWidth] - 输入框的宽度（px）
 */
import React from 'react'
import styles from './styles.less'
import Input from '../Input'
import InputNumber from '../InputNumber'
import IconButton from '../IconButton'
import Validator from '../Validator'
import vars from '../theme/variables'
import classnames from 'classnames'

class InputTag extends React.Component {

  onInputChange = (val) => {
    const { onChange, type } = this.props
    if (onChange) {
      if (type === 'number') {
        onChange(val)
      } else {
        onChange(val.target.value)
      }
    }
  }

  render() {
    const { closable, onClose, children, size, type, style, className, validator, inputWidth, onChange, ...props } = this.props

    let inputProps = { ...props }

    if (size) {
      inputProps.size = inputProps
    }
    
    const cls = {
      InputTag: 1,
      ['InputTag-' + size]: !!size,
      'InputTag-flexInput': !('inputWidth' in this.props),
      [className]: !!className,
    }

    let inputTag = (
      <div className={classnames(cls)} style={style || {}}>
        <div className="InputTag-main">
          <div className="InputTag-label">
            {children}
          </div>
          <div className="InputTag-input" style={'inputWidth' in this.props ? { width: inputWidth } : null}>
            {type === 'number' ?
              <InputNumber onChange={this.onInputChange} {...inputProps} />
              :
              <Input onChange={this.onInputChange} {...inputProps} />
            }
          </div>
        </div>
        {closable &&
          <IconButton
            type="cross"
            hoverType="cross_circle"
            color={vars.primaryColor}
            className="InputTag-close-icon"
            onClick={onClose}
            size={size === undefined ? 14 : 12}
          />
        }
      </div>
    )

    if (validator) {
      inputTag = (
        <Validator value={this.props.value} {...validator}>
          {inputTag}
        </Validator>
      )
    }

    return inputTag
  }
}

export default InputTag
