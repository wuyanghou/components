import React from 'react'
import './styles.less'
import classnames from 'classnames'
import Loading from '../Loading'
import { pTypes, defaultP } from './PropTypes'

class Section extends React.Component {
  static propTypes = pTypes
  static defaultProps = defaultP

  render() {
    const { title, toolBar, children, className, style, loading } = this.props
    const cls = {
      Section: 1,
      [className]: !!className,
    }
    return (
      <div className={classnames(cls)} style={style}>
        <div className="Section-header">
          <div className="Section-title">
            {title}
          </div>
          <div className="Section-toolBar">
            {toolBar}
          </div>
        </div>
        <div className="Section-body">
          {children}
        </div>
        <Loading loading={loading} />
      </div>
    )
  }
}
export default Section
