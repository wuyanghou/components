/**
 * 表单输入项校验器
 * @property {ReactNode} children - 输入控件
 * @property {[string|Object|Function]} [rules] - 校验规则集合，默认为['required']，可以为三种类型：
 *                                            1、string，为预设的校验规则
 *                                            2、Object，key为预设的校验规则，value为提示信息
 *                                            3、Function，自定义的校验方法，参数为待校验的值，返回校验错误null|true|string
 *                                            预设的校验规则有：1、必填项，'required'
 * @property {any} value - 待校验的值
 * @property {Function} onErrorChange - 错误信息变化时的回调
 * @property {boolean} [silent] - 不显示错误提示
 * @property {boolean} [keepHeight] - 保持原有高度，即提示信息不撑开高度
 * @property {string?} className 附加在外层包裹元素的类
 * @property {object?} style 附加在外层包裹元素的样式
 */
import React from 'react'
import './styles.less'
import {objectDeepEquals} from '../utils/basic/obj'
import formTips from '../Validator/tips'
import {checkRequired, checkPhone} from './checkers'
import {types, defaultTypes} from './propTypes'
import classnames from 'classnames'

class Validator extends React.Component {
  static propTypes = types
  static defaultProps = defaultTypes

  state = {
    error: null,
  }

  componentDidMount() {
    this.check()
  }

  componentWillReceiveProps(nextProps) {
    if ('error' in nextProps) {
      this.setState({error: nextProps.error})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!objectDeepEquals(prevProps.value, this.props.value)) {
      this.check()
    }
  }

  check = () => {
    const {value, rules, onErrorChange} = this.props
    const {error} = this.state
    let e = null
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i]
      if (rule instanceof Function) {
        e = rule(value)
      } else {
        let ruleType
        let ruleTips
        if (typeof rule === 'string') {
          ruleType = rule
        } else if (rule instanceof Object) {
          ruleType = Object.keys(rule)[0]
          ruleTips = Object.values(rule)[0]
        }
        if (ruleType === 'required') {
          ruleTips = ruleTips || formTips.required
          e = checkRequired(value) && ruleTips
        }
        if (ruleType === 'phone') {
          ruleTips = ruleTips || formTips.phone
          e = checkPhone(value) && ruleTips
        }
      }
      if (e) {
        break
      }
    }
    if (e !== error) {
      if (!('error' in this.props)) {
        this.setState({error: e})
      }
      if (onErrorChange) {
        onErrorChange(e)
      }
    }
  }

  render() {
    const {children, silent, keepHeight, className, style, showStatus, showTips: showTipsProp} = this.props
    const {error} = this.state
    const showTips = !silent && !!error && showTipsProp
    const cls = {
      'Validator': 1,
      'Validator-keepHeight': keepHeight,
      'Validator-showTips': showTips,
      'Validator-showStatus': !silent && showStatus,
      [className]: !!className,
    }

    return (
      <div className={classnames(cls)} style={style || {}}>
        {children}
        {showTips && typeof error === 'string' &&
        <div className="Validator-tips">
          {error}
        </div>
        }
      </div>
    )
  }
}

export default Validator
