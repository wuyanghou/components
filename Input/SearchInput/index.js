/**
 * 单行文本输入框，基于antd的Input，默认为大号，可能要实现一些格式化的输入效果（待完善）
 * @property {string} [size] - 大小，'small'|'xSmall'
 * @property {boolean} [wordCount] - 是否需要字数统计
 * @property {number} [maxLength] - 字数上限
 */
import React from 'react'
import { Input as AntdInput } from 'antd'
import Icon from '../../Icon'
import styles from './styles.less'

class SearchInput extends React.Component {
  render() {
    const { size: sizeProp, search, width=280, style, ...props } = this.props

    let size = 'large'
    if (sizeProp === 'small') {
      size = 'default'
    } else if (sizeProp === 'xSmall') {
      size = 'small'
    }

    return (
      <div className={styles.searchInput} style={{...style, width: `${width}px`}}>
        <Icon type="search_mc" size={12} />
        <AntdInput size={size} {...props} onPressEnter={search} style={{width: `${width-25}px`}}/>
      </div>
    )
  }
}

export default SearchInput
