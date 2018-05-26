/**
 * 标签
 * @property {string} [size] - 大小，'small'|'xSmall'
 * @property {string} [color] - 颜色值
 * @property {boolean} [closable] - 是否可关闭
 * @property {Function} [onClose] - 关闭时的回调
 * @property {Function} [afterClose] - 关闭动画完成后的回调
 * @property {boolean} [fontWhite] - 字体色是否白色
 * @property {string} [className] - 附加在根元素的类名
 */
import React from 'react'
import { Tag as AntdTag } from 'antd'
import classnames from 'classnames'
import styles from './styles.less'

class Tag extends React.Component {

  render() {
    const { size, color, closable, onClose, children, fontWhite, afterClose, className } = this.props

    const cls = {
      'Tag': 1,
      'Tag-font-white': fontWhite,
      [`Tag-small`]: size === 'small',
      [`Tag-xSmall`]: size === 'xSmall',
      [className]: !!className,
    }

    return (
      <AntdTag
        className={classnames(cls)}
        color={color}
        closable={closable}
        onClose={onClose}
        afterClose={afterClose}
        children={children}
      />
    )
  }
}

export default Tag
