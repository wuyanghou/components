/**
 * 版块
 * @property {string|reactNode?} title 标题
 * @property {string?} className 附加在外层包裹元素的类
 * @property {object?} style 附加在外层包裹元素的样式
 * @property {string?} type 类型 可选'dark'：深色背景
 * @property {reactNode?} headerToolBar 顶部工具栏（位于顶部栏右侧）
 */
import React from 'react'
import styles from './styles.less'

const Block = ({ title, children, className, style, type, headerToolBar }) => {
  return (
    <div className={'Block ' + (type === 'dark' ? 'Block-dark ' : 'Block-default ') + (className ? className : '')} style={style || {}}>
      {(title || headerToolBar) &&
        <div className="Block-header">
          {title && <div className="Block-title">{title}</div>}
          {headerToolBar && <div className="Block-toolBar">{headerToolBar}</div>}
        </div>
      }
      <div className="Block-content">
        {children}
      </div>
    </div>
  )
}

export default Block
