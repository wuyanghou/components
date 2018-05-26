/**
 * 数字输入框，基于antd的InputNumber，默认为大号，可能要实现一些格式化的输入效果（待完善）
 * @property {string} [size] - 大小，'small'|'xSmall'
 * @property {Object} [validator] - 校验器的配置参数
 */
import React from 'react'
import { InputNumber as AntdInputNumber } from 'antd'
import styles from './styles.less'
import Validator from '../Validator'

class InputNumber extends React.Component {

  render() {
    const { size: sizeProp, validator, ...props } = this.props

    let size = 'large'
    if (sizeProp === 'small') {
      size = undefined
    } else if (sizeProp === 'xSmall') {
      size = 'small'
    }

    let input = <AntdInputNumber size={size} {...props} />
    if (validator) {
      input = (
        <Validator value={this.props.value} {...validator}>
          {input}
        </Validator>
      )
    }
    return input
  }
}

export default InputNumber
