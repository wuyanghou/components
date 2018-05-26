/**
 * 下拉菜单
 */
import React from 'react'
import classnames from 'classnames'

class MenuContainer extends React.Component {

  componentDidMount() {

  }

  render() {
    const { children, className } = this.props
    const cls = {
      'DropdownMenu-menu-wrap': 1,
      [className]: !!className,
    }
    return (
      <div className={classnames(cls)}>
        {children}
      </div>
    )
  }
}

export default MenuContainer
