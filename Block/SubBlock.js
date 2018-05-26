/**
 * 子版块
 * @property {string|reactNode?} title 标题
 * @property {string?} className 附加在外层包裹元素的类
 * @property {object?} style 附加在外层包裹元素的样式
 * @property {string?} type 类型 可选'dark'：深色背景
 * @property {reactNode?} headerToolBar 顶部工具栏（位于顶部栏右侧）
 */
import React from 'react'
import styles from './SubBlock.less'

const SubBlock = ({ title, children, className, style, type, headerToolBar }) => {
  return (
    <div className={'SubBlock ' + (type === 'dark' ? 'SubBlock-dark ' : 'SubBlock-default ') + (className ? className : '')} style={style || {}}>
      {(title || headerToolBar) &&
        <div className="SubBlock-header">
          {title && <div className="SubBlock-title">{title}</div>}
          {headerToolBar && <div className="SubBlock-toolBar">{headerToolBar}</div>}
        </div>
      }
      <div className="SubBlock-content">
        {children}
      </div>
    </div>
  )
}

export default SubBlock
