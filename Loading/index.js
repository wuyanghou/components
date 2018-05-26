/**
 * 通用加载动画组件
 * @property {string?} size 图标大小，可选值为 small、large
 * @property {boolean?} loading 加载状态
 * @property {string?} tip 文字提示
 * @property {number?} delay 延迟显示加载效果的时间(毫秒)
 * @property {string} [className] - 附加在根元素的类名
 * @property {object} [style] - 附加在根元素的样式
 */
import React from 'react'
import { Spin } from 'antd'
import cns from 'classnames'
import './styles.less'

export default function({ size, loading, tip, delay, className, style }) {

  return (
    <div
      className={cns({
        Loading: true,
        none: !loading,
        "Loading-hasTips": tip,
        [className]: !!className,
      })}
      style={style}
    >
      <div className={cns({
          'Loading-inner': true,
          small: size === 'small',
          large: size === 'large',
        })}
      >
        <Spin size={size} spinning={loading} tip={tip} delay={delay}></Spin>
      </div>
    </div>
  )

}
