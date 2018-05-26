/**
 * 文字链接
 */
import React from 'react'
import styles from './styles.less'
import classnames from 'classnames'
import PropTypes from 'prop-types'

class TextLink extends React.Component {
  static propTypes = {
    children: PropTypes.node,  //内容
    fontSize: PropTypes.number,  //字体大小
    disabled: PropTypes.bool,  //禁用状态
    type: PropTypes.string,  //类型，可选'secondary'
    onClick: PropTypes.func,  //点击时的回调
    className: PropTypes.string,  //附加在根元素上的类名
    style: PropTypes.object,  //附加在根元素上的样式
  }

  render() {
    const { children, fontSize, disabled, type, onClick, className, style: styleProp, ...props } = this.props
    const cls = {
      TextLink: 1,
      'TextLink-disabled': !!disabled,
      [`TextLink-${type}`]: !!type,
    }
    let style = styleProp || {}
    if (fontSize) {
      style = { ...style, fontSize }
    }
    return (
      <span className={classnames(cls) + (className ? ' ' + className : '')} style={style} onClick={disabled ? null : onClick} {...props}>
        {children}
      </span>
    )
  }
}

export default TextLink
