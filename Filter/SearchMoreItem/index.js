import React from 'react';
import styles from './index.less'
import {Icon} from 'antd';
const UNLIMITED_TEXT = '不限';
const UNLIMITED_VAL = '';
const UNLIMITED_OBJ = {text: UNLIMITED_TEXT, val: UNLIMITED_VAL};
class SearchMoreItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expend: false
    }
  }
  /**
   * 增加默认项
   */
  addDefaultItem = (key) => {
    this.props.dict[key].unshift(UNLIMITED_OBJ);
  }
  render() {
    let {titles, dict, titleValue, subValue, changeTabs, onChange, conditionWidth} = this.props;
    // 当没有“不限”选项才加
  Object.keys(dict).forEach(key => {
      !dict[key].find(val => val.val === UNLIMITED_VAL) && this.addDefaultItem(key);
    })
    return (
      <div style={{backgroundColor: '#F5F5F5'}}>
        <div className={'label'} style={ conditionWidth ? { width: conditionWidth } : {}}>
          <div>
            {'更多筛选'}
          </div>
        </div>
        <div className={styles.selectItem} style={{backgroundColor: '#f9f9f9'}}>
          <div className={styles.title}>
            {
              titles.map((val, key) => {
                // val形如{text: xxx, val: xxx}
                const titleVal = val.val;
                // 如果选不限 则显示该项的标题 如果选其他选项 则显示选项名字
                let text = val.text;
                if (subValue.length>0) {
                  const subValueVal = subValue[titleVal];
                  text = subValueVal === UNLIMITED_VAL ? val.text : dict[titleVal].find(v => v.val === subValueVal).text;
                }
                let titleValueVal = titleValue ? titleValue.val : '';
                return (
                  <span className={titleValueVal === titleVal ? 'active' : ''} onClick={e => {changeTabs(val)}} key={key}>{text}<Icon type={titleValueVal === titleVal ? 'up' : 'down'}/>
                    <i className={styles.hideLine}></i></span>
                )
              })
            }
          </div>
          {
            titles.map(title => {
              const titleVal = title.val;
              let titleValueVal = titleValue ? titleValue.val : '';
              let subValueVal = subValue ? subValue[titleVal] : '';
              return (
                  <div className={styles.content} key={titleVal} style={{display: titleVal === titleValueVal ? 'block' : 'none'}}>
                    {
                      dict[titleVal].map(item => {
                        return (
                          <span className={ subValueVal === item.val ? 'active' : null} key={item.val} onClick={e => {
                            onChange(item.val, titleVal,item.text)
                          }}>{item.text}</span>
                        )
                      })
                    }
                  </div>
                )
              }
            )
          }
        </div>

      </div>

    )
  }
}

export default SearchMoreItem;
