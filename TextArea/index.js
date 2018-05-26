/**
 * 多行文本输入框
 * @property {Object} [validator] - 校验器的配置参数
 */
import React from 'react'
import styles from './styles.less'
import Validator from '../Validator'
import classnames from 'classnames'
import PropTypes from 'prop-types'

class TextArea extends React.Component {
  static propTypes = {
    rows: PropTypes.number,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    validator: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
  }
  static defaultProps = {

  }

  getLength = value => {
    if (!value) {
      return 0
    }
    return value.replace(/\n+/g, '').length
  }

  render() {
    const { rows, value, disabled, placeholder, wordCount, maxLength, validator, className, style, ...props } = this.props
    const cls = {
      'TextArea': 1,
      'TextArea-hasWordCount': wordCount,
      [className]: !!className,
    }
    let input = (
      <div className={classnames(cls)} style={style}>
        <div className="TextArea-inner">
          <textarea 
            rows={rows}
            value={value === null ? '' : value} 
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength ? ( maxLength + '' ) : undefined}
            {...props}
          />
          {wordCount && maxLength &&
            <div className="TextArea-wordCount">
              <span>{this.getLength(value)}</span>/{maxLength}
            </div>
          }
        </div>
      </div>
    )
    if (validator) {
      input = (
        <Validator value={value} {...validator}>
          {input}
        </Validator>
      )
    }

    return input
  }
}

export default TextArea
