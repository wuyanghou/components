/**
 * 错误提示
 * @property {string} text - 错误信息
 */
import React from 'react'
import { Icon } from 'antd'
import styleVars from '../theme/variables'
import './styles.less'

class Button extends React.Component {

  render() {
    const { text } = this.props

    return (
      <div className="ErrorTips">
        <div>
          <Icon type="exclamation-circle" style={{ fontSize: 72, color: styleVars.fontColorTips, marginBottom: 30 }} />
        </div>
        {text}
      </div>
    )
  }
}

export default Button
