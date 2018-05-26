/**
 * 标签输入框
 * @property {string} [size] - 大小，'small'|'xSmall'
 * @property {string} [color] - 颜色值
 * @property {boolean} [closable] - 是否可关闭
 * @property {Function} [onClose] - 关闭时的回调
 * @property {Function} [afterClose] - 关闭动画完成后的回调
 * @property {boolean} [fontWhite] - 字体色是否白色
 */
import React from 'react'
import Tag from '../Tag'
import Input from '../Input'
import styles from './styles.less'
import {message, seletct} from 'antd'

class TagsInput extends React.Component {
  state = {
    inputValue: ''                  //输入框的值
  }
  flag = true;
  /**
   * change事件在keydown之后触发，输入空格和逗号之后keydown事件生成新tag，
   * 但此时输入框内容并未change，残留的空格和逗号在change事件清空
   * 如果tags的数量已经到达上限，控制输入框无法输入
   */
  handleChange = (e) => {
    const {value: tags, maxNum} = this.props;
    if (e.target.value === ' ' || e.target.value === ',' || (tags && tags.length >= maxNum)) {
      this.setState({inputValue: ''});
      return;
    }
    this.setState({inputValue: e.target.value});
  }
  /**
   * 输入为回车，空格，逗号时，检查标签是否存在，
   * 检查输入框输入是否合法，合法生成新tag并清空输入框
   * 如果输入框内容为空，输入退格键则删除最后一个标签
   */
  handleKeyDown = (e) => {
    const {value: tags, onChange} = this.props;
    let code = e.key;
    if (e.target.value && (code === 'Enter' || code === ' ' || code === ',') && this.flag) {
      if (tags.findIndex((val) => val === e.target.value) >= 0) {
        message.warn('标签已存在');
      }
      else if (/^[\u4e00-\u9fa5\w]+$/.test(e.target.value)) {
        onChange([...tags, e.target.value]);
        this.setState({inputValue: ''});
      } else {
        message.warn('含有非法字符');
      }
    } else if (code === 'Backspace' && !e.target.value) {
      if (tags && tags.length) {
        this.tagClose(tags.length - 1);
      }
    }
  }

  handleCompositionStart = () => {
    this.flag = false;
  }
  handleCompositionEnd = () => {
    this.flag = true;
  }
  handleBlur = (e) => {
    const {value: tags, onChange} = this.props;
    if(e.target.value){
      if (tags.findIndex((val) => val === e.target.value) >= 0) {
        message.warn('标签已存在');
      }
      else if (/^[\u4e00-\u9fa5\w]+$/.test(e.target.value)) {
        onChange([...tags, e.target.value]);
        this.setState({inputValue: ''});
      } else {
        message.warn('含有非法字符');
      }
    }
  }
  tagClose = (index) => {
    const {value: tags, onChange} = this.props;
    let new_tags = tags.slice();
    new_tags.splice(index, 1);
    onChange(new_tags);
  }

  render() {
    const {color, closable = true, onClose, afterClose, value: tags, maxLength, style} = this.props
    const {inputValue} = this.state;
    return (
      <div className='tagsInput' style={style}>
        {tags &&
        tags.map((val, index) => (
          <Tag key={val} color={color} closable={closable} onClose={onClose} afterClose={() => {
            this.tagClose(index)
          }}>{val}</Tag>
        ))
        }
        <Input placeholder='' maxLength={maxLength} onKeyDown={this.handleKeyDown}
               onCompositionEnd={this.handleCompositionEnd} onCompositionStart={this.handleCompositionStart}
               onBlur={this.handleBlur}
               onChange={this.handleChange} value={inputValue}/>
      </div>
    )
  }
}

export default TagsInput
