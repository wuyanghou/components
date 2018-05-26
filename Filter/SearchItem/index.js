import React from 'react';
import {Icon} from 'antd';
import styles from './index.less';
const UNLIMITED_TEXT = '不限';
const UNLIMITED_VAL = '';
const UNLIMITED_OBJ = {text: UNLIMITED_TEXT, val: UNLIMITED_VAL};
const is = (type, val) => Object.prototype.toString.call(val) === ('[object ' + type + ']');
class SearchItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMoreBtn: false,
      expend: false
    }
  }

  componentDidMount() {
    if (this.$inner.offsetHeight > 50) {
      this.setState({
        showMoreBtn: true
      })
    }
  }
  /**
   * 增加默认项
   */
  addDefaultItem = () => {
    this.props.dict.unshift(UNLIMITED_OBJ);
  }
  showOrHidden = () => {
    let {expend} = this.state;
    let $items = this.$inner.parentNode;
    this.setState({expend: !expend}, () => {
      if (this.state.expend) {
        $items.style.height = this.$inner.offsetHeight + 'px';
        $items.parentNode.querySelector('.label').style.height = this.$inner.offsetHeight + 'px';
      } else {
        $items.style.height = '50px';
        $items.parentNode.querySelector('.label').style.height = '50px';
      }
    });
  }
  multiSelect = (value, val, isClose) => {
  let {onChange, dict} = this.props;
    // 如果是字符串先转成数组
    if (is('String', value)) {
      value = value === '' ? [] : value.split(',');
    }
    // 反选
  if (isClose && value.indexOf(val) !== -1) {
      for (let i = 0; i < value.length; i++) {
        if (value[i] === val) {
          value.splice(i, 1);
          break;
        }
      }
      // 当反选到无选中项时 需选中“不限”
      value.length === 0 && value.push(UNLIMITED_VAL);
    }
    // 选中
    else {
    // 如果选中“不限” 需要把其他选项清空
      if (val === UNLIMITED_VAL) {
        value = [val];
      } else {
        // 当点击选项 如果存在“不限”需清除
        value = value.filter(v => v !== UNLIMITED_VAL);
        value.push(val);
        // 如果全选 要回到“不限”
        dict.filter(v => v.val !== UNLIMITED_VAL).length === value.length && (value = [UNLIMITED_VAL])
      }
    }
    console.log(value)
    // 回调
  onChange(value);
  }

  render() {
    let {title, dict, isMultiSelect, onChange, value, conditionWidth} = this.props;
    let {showMoreBtn, expend} = this.state;
    // 当没有“不限”选项才加
    !dict.find(val => val.val === UNLIMITED_VAL) && this.addDefaultItem();
    return (
      <div className={'clearfix'}>
        <div className={'label'} style={ conditionWidth ? { width: conditionWidth } : {}}>{title}</div>
        <div className={'items'}>
          <div ref={e => {this.$inner = e; return this.$inner}} className={'clearfix'}>
            {isMultiSelect &&
            <div>
              <div className={'item multiSelect'}>
                可多选
              </div>
              {
                dict.map((item, key) => {
                  return (<div
                    className={`item ${item.val === '' ? 'noClose' : ''} ${value !== undefined && value.indexOf(item.val) !== -1 ? 'filter-active' : ''}`}
                    key={key}
                    onClick={(e) => this.multiSelect(value, item.val)}>
                    {item.text}
                    {
                      value !== undefined && value.indexOf(item.val) !== -1 && item.val !== '' &&
                      <Icon className='icon' type='close' onClick={(e) => {
                          e.stopPropagation()
                          this.multiSelect(value, item.val, true)
                       }
                      } />
                    }
                  </div>)
                })
              }
            </div>
            }
            {!isMultiSelect &&
            <div>
              {
                dict.map((item, key) => {
                  return (<div className={`item noClose ${value === item.val || ( !value && !item.val ) ? 'filter-active' : ''}`}
                               key={key}
                               onClick={value === item.val ? null : () => onChange(item.val)}>
                    {item.text}
                    {/* 单选不需要X按钮 */}
                    {/*{*/}
                      {/*JSON.stringify(value) === JSON.stringify(item) &&*/}
                      {/*<Icon type='close'/>*/}
                    {/*}*/}
                  </div>)
                })
              }
            </div>
            }
            {showMoreBtn &&
            <div onClick={this.showOrHidden} className={styles.showMore}>
              <span>{!expend ? '更多' : '收起'}</span>
              <Icon type={expend ? 'up' : 'down'}/>
            </div>
            }
          </div>

        </div>
      </div>
    )
  }
}

export default SearchItem;
