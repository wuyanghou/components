/**
 * 单行文本输入框，基于antd的Input，默认为大号，可能要实现一些格式化的输入效果（待完善）
 * @property {string} [size] - 大小，'small'|'xSmall'
 * @property {boolean} [wordCount] - 是否需要字数统计
 * @property {number} [maxLength] - 字数上限
 * @property {Object} [validator] - 校验器的配置参数
 */
import React from 'react'
import { Input as AntdInput } from 'antd'
import styles from './styles.less'
import Validator from '../Validator'
import classnames from 'classnames'

class Input extends React.Component {
  // state = {
  //   inputValue: this.props.value === undefined ? '' : this.props.value + '',
  //   isOnComposition: false
  // }
  // componentWillReceiveProps(nextProps) {
  //   const { value } = nextProps;
  //   if (value !== undefined) {
  //     this.setState({inputValue: nextProps.value})
  //   }
  // }
  focus() {
    this.input.focus();
  }
  blur() {
    this.input.blur();
  }
  saveInput = (node) => {
    this.input = node;
  }
  render() {
    const { size: sizeProp, validator, wordCount, style, className, maxLength, ...props } = this.props
    let size = 'large'
    if (sizeProp === 'small') {
      size = 'default'
    } else if (sizeProp === 'xSmall') {
      size = 'small'
    }

    const cls = {
      Input: 1,
      [className]: !!className,
    }

    let input = <AntdInput size={size} maxLength={maxLength !== undefined && maxLength !== null ? (maxLength + '') : undefined} {...props} ref={this.saveInput}/>
    if (wordCount) {
      input = (
        <div className="Input-wordCount-wrap">
          {/* <AntdInput size={size} {...{...props, onChange:this.getValue}} /> */}
          {input}
          <div className="Input-wordCount"><span>{(props.value !== undefined && props.value !== null) ? props.value.length : 0}</span>/{maxLength || 20}</div>
        </div>
      )
    }
    input = (
      <div className={classnames(cls)} style={style}>
        {input}
      </div>
    )
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

export default Input
