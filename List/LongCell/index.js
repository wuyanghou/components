/**
 * 超长列
 * @property {number?} lines 行数 默认为1
 *
 * 实例方法：refreshTooltip
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Tooltip } from 'antd'
import { COL_WIDTH_XL } from '../config'
import styles from './styles.less'

class LongCell extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      hasTooltip: false, //是否显示内容提示框
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.refreshTooltip()
    }, 500)
  }

  /**
   * 更新内容提示框的显示状态
   */
  refreshTooltip = () => {
    const { lines } = this.props
    const maxH = (lines || 1) * 24
    const fullH = this.$ruler.offsetHeight
    this.setState({ hasTooltip: fullH > maxH ? true : false })
  }

  render() {
    const { lines, children } = this.props
    const { hasTooltip } = this.state
    const line = lines || 1
    return (
      <div className="List-longCell-wrap">
        <Tooltip title={hasTooltip ? children : null}>
          <div
            className={'List-longCell' + (line === 1 ? ' List-rows-1' : (' List-multiRow List-rows-' + line))}
            style={{ maxHeight: COL_WIDTH_XL - 25 }}
            ref={c => this.$wrap = ReactDOM.findDOMNode(c)}
          >
            {children}
          </div>
        </Tooltip>
        <div className="List-longCell-ruler-wrap">
          <div ref={c => this.$ruler = ReactDOM.findDOMNode(c)}>
            {children}
          </div>
        </div>
      </div>
    )
  }
}

export default LongCell
