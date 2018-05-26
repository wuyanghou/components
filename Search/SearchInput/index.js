/**
 * Created by yujiayu on 2017/12/25.
 */
import React from 'react'
import styles from './index.less';
import Button from '../../Button';
export default class SearchInput extends React.Component {
  render() {
    const {afterQuery, afterReset, onChange, placeholder, width, value} = this.props;
    return (
      <div className={styles.inputWrap} style={{width: width}}>
        <input type="text" placeholder={placeholder} value={value} onChange={
          (e) => {
            onChange(e.target.value);
          }
        }/>
        <Button className={styles.searchBtn} type="primary" onClick={afterQuery}>搜 索</Button>
        <Button onClick={afterReset}>重 置</Button>
      </div>
    )
  }
}
