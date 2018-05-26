/**
 * 表单项目组件，固定名称的宽度，输入区域占满剩下宽度，内容作为子元素传入
 * @property {string?} name 名称
 * @property {boolean?} required 是否必填
 * @property {string?} className 附加在外层包裹元素的类
 * @property {object?} style 附加在外层包裹元素的样式
 * @property {string?} size 大小  [default | small] 默认为 default
 * @property {number?} labelWidth 标签宽度（px）  默认为120
 */
import React from 'react'
import styles from './styles.less'

class FormItem extends React.Component {

  render(){
    const { name, required, children, className, style, size, labelWidth } = this.props
    return (
      <div 
        className={
          'FormItem ' + (size && size === 'small' ? ' FormItem-small' : '') + (className ? (' ' + className) : '')
        } 
        style={style || null}
      >
        {name &&
          <div className={'FormItem-label' + (required ? ' FormItem-required' : '')}>{name}</div>
        }
        <div className="FormItem-content" style={labelWidth === undefined ? null : { marginLeft: labelWidth }}>{children}</div>
      </div>
    )
  }
}

export default FormItem