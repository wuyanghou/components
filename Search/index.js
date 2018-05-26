/**
 @property conditions {Array}  [
 {
  // 搜索条件名字
  title: '季节',
  // 该搜索条件的字段名
  field: 'quarters',
  // 是否多选 不写默认单选
  isMultiSelect: true,
  // 类型 不写默认为default 而moreSelect为更多筛选模式
  type: 'default',
  // 搜索条件选项 形式[{text: xx, val: xx}]
  dict: [{text: '一年级', val: '001'}, {text: '二年级', val: '002'}]
 },
 {
  title: '年级',
  field: 'grade',
  dict: [{text: '一年级', val: '001'}]
 },
 {
  // 更多筛选模式的title为数组 形式如下 其中val相当于单选的field
  title: [
    {text: '季度', val: 'holiday'},
    {text: '期数', val: 'periods'}
  ],
  // 搜索条件选项为对象 key对应title中的val
  dict: {
    holiday: [
      {text: '春季', val: 'chun'},
      {text: '暑假', val: 'shu'},
      {text: '秋季', val: 'qiu'},
      {text: '寒假', val: 'han'}
    ],
    periods: [
      {text: '一期', val: '1'},
      {text: '二期', val: '2'},
      {text: '三期', val: '3'},
      {text: '四期', val: '4'}
    ]
  },
  // 默认为default 而moreSelect为更多筛选模式
  type: 'moreSelect'
 }
 ]

 @property selectedDatas {Object} 与搜索项双向绑定 key对应默认模式的field与更多筛选模式的val
 {
   // 其中inputValue为固定的key 是输入框的key
   inputValue: '为让我去',
   quarters: ['005', '006'],
   grade: '',
   holiday: '',
   periods: ''
 }

 @property result 搜索结果条数

 @property onSearch {Function(result)} 搜索回调 result是搜索结果

 @property onInitFinish {Function(result)} 初始化完成的回调 result是初始化完成的结果

 @property onInputChange {Function(result)} 输入框变化回调

 @property headerSide {node} [不传则使用默认布局] 头部 可传入如下 用于填充搜索组件头部的左边内容
 headerSide={
      <div className="pageTitleWrap">
        <div className="pageTitle">
          教师管理
        </div>
        <Switch checkedChildren="在职" unCheckedChildren="全部"></Switch>
      </div>
    }

 @property footerSide {node} [不传则使用默认布局] 尾部 用于填充搜索组件尾部的右边内容

 @property isShowResult {Boolean} 是否显示搜索结果
 */
import React from 'react';
//筛选
import {Row, Col} from 'antd';
import styles from './index.less'
import SearchItem from './SearchItem';
import SearchMoreItem from './SearchMoreItem';
import SearchInput from './SearchInput';
import {cloneObjectDeep} from '../utils/basic/obj';

const DefaultHeader = (props) => (
  <Row>
    <Col span={18} offset={3}>
      <SearchInput {...props}></SearchInput>
    </Col>
  </Row>
)
const DefaultFooter = ({result}) => (
  <div className={styles.infoTips}>
    共搜索到
    <span>{result}</span>
    个结果
  </div>
)

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 搜索框值
      inputValue: '',
      // 更多筛选的父标签值
      titleValue: null,
      // 更多筛选项每个的选中项
      subValue: {}
    }
    // 保存第一次传入的selectedDatas 用于重置
    this.initialSelectedDatas = null
    // 是否初始化完成
    this.isInitFinish = false
  }

  /**
   * 如果筛选项存在异步 需要这里再次更新
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    this.init(nextProps, () => {
      if (!this.isInitFinish) {
        const result = this.getResult();
        this.initialSelectedDatas = result;
        nextProps.onInitFinish(result);
        this.isInitFinish = true;
      }
    });
  }

  /**
   * 初始化
   * @param props
   */
  init = (props, cb) => {
    const {conditions, selectedDatas} = props;
    if (conditions) {
      const initialValue = conditions.reduce((cur, pre) => {
        // type默认为default
        if (!pre.type || pre.type === 'default') {
          cur[pre.field] = selectedDatas[pre.field];
        } else if (pre.type === 'moreSelect') {
          Object.keys(pre.dict).forEach(key => {
            if (cur.subValue) {
              cur.subValue = {...cur.subValue, ...{[key]: selectedDatas[key]}}
            } else {
              cur.subValue = {[key]: selectedDatas[key]};
            }
          })
        }
        return cur;
      }, {});
      this.setState({...this.state, ...initialValue, ...{inputValue: selectedDatas.inputValue}}, () => {
        cb && cb();
      });
    }
  }
  /**
   * 文本框输入改变回调
   * @param value
   */
  inputOnChange = (value) => {
    this.setState({inputValue: value}, () => {
      this.props.onInputChange(value);
    });
  }
  /**
   * 文本框搜索回调
   * @param inputContent
   */
  afterQuery = () => {
    this.toSearch();
  }
  /**
   * 重置
   */
  afterReset = () => {
    this.init({...this.props, ...{selectedDatas: this.initialSelectedDatas}}, () => {
      this.toSearch();
    });
  }
  /**
   * 单选选中后回调
   * @param changeItem
   */
  afterSelect = (changeItem) => {
    this.setState(changeItem, () => {
      this.toSearch();
    });
  }
  /**
   * 多选选中后回调
   * @param changeKey
   * @param item
   * @param key
   */
  afterSelectMore = (changeItem, key, text) => {
    console.log(changeItem, key, text);
    const {conditions} = this.props;
    let {titles} = this.state;
    if (!titles) {
      titles = this.state.titles || JSON.parse(JSON.stringify(conditions.filter((v, k) => {
        return v.type === 'moreSelect';
      })[0]['title']));
    }

    if (key !== undefined) {
      const changeTitles = titles.map((v, k) => {
        if (v.val === key) {
          v.text = text;
        }
        return v;
      })
      let {subValue} = this.state;
      // 更新更多筛选的子标签项
      subValue[key] = changeItem;
      // 选中是否隐藏下面的内容
      this.setState({titleValue: '', titles: changeTitles, subValue}, () => {
        this.toSearch();
      });
    }
  }
  /**
   * 更多筛选tab切换
   * @param val
   */
  changeTabs = (tab) => {
    let {titleValue} = this.state;
    // titleValue: ''隐藏所有tab下的菜单
    if (tab.val === titleValue) {
      this.setState({'titleValue': ''})
      return;
    }
    // 显示指定tab
    this.setState({'titleValue': tab})
  }
  /**
   * 获取最终搜索项
   * @returns {Object}
   */
  getResult = () => {
    const is = (type, val) => Object.prototype.toString.call(val) === ('[object ' + type + ']');
    let result = cloneObjectDeep(this.state);
    delete result.titleValue;
    result = {...result, ...result['subValue']}
    delete result.subValue;
    delete result.titles;
    return result;
  }
  /**
   * 搜索回调
   */
  toSearch = () => {
    this.props.onSearch(this.getResult());
  }
  /**
   * 渲染头部
   */
  renderHeader = () => {
    const {headerComponent: HeaderComponent, headerSide, placeholder} = this.props;
    // 支持传入headerComponent替换默认布局
    if (HeaderComponent) {
      return (
        <HeaderComponent>
          <SearchInput value={this.state.inputValue} onChange={this.inputOnChange} afterQuery={this.afterQuery}
                       afterReset={this.afterReset} placeholder={placeholder || '请输入'}/>
        </HeaderComponent>
      )
    }
    // 使用左右布局
    else if (headerSide) {
      return (
        <div className={styles.sideWrap}>
          {headerSide}
          <SearchInput value={this.state.inputValue} afterQuery={this.afterQuery} onChange={this.inputOnChange}
                       afterReset={this.afterReset} width="718px" placeholder={placeholder || '请输入'}/>
        </div>
      )
    }
    // 默认布局
    else {
      return (
        <DefaultHeader value={this.state.inputValue} onChange={this.inputOnChange} afterQuery={this.afterQuery}
                       afterReset={this.afterReset} placeholder={placeholder || '请输入'}/>
      )
    }
  }
  /**
   * 渲染尾部
   */
  renderFooter = () => {
    const {footerComponent: FooterComponent, footerSide, result, isShowResult} = this.props;
    // 支持传入footerComponent替换默认布局
    if (FooterComponent) {
      return (
        <FooterComponent>
          {isShowResult ? <DefaultFooter result={result}></DefaultFooter> : null}
        </FooterComponent>
      )
    }
    // 使用左右布局
    else if (footerSide) {
      return (
        <div className={styles.sideWrap} style={{marginTop: '20px'}}>
          {isShowResult ? <DefaultFooter result={result}></DefaultFooter> : null}
          {footerSide}
        </div>
      )
    }
    // 使用默认布局
    else {
      return (
        <div style={{marginTop: '20px'}}>
          {isShowResult ? <DefaultFooter result={result}></DefaultFooter> : null}
        </div>
      )
    }
  }

  render() {
    const {titles} = this.state;
    const {conditions, conditionWidth} = this.props;
    return (
      <div className={styles.search}>
        {/*头部*/}
        {
          this.renderHeader()
        }
        {/* 搜索项 */}
        <div className={styles.contents}>
          {
            conditions && conditions.length !== 0 ? conditions.map((item, index) => {
                // type默认为default
                if (!item.type || item.type === 'default') {
                  const {dict, title, field, isMultiSelect} = item;
                  return <SearchItem title={title} dict={dict} value={this.state[field] || ''}
                                     isMultiSelect={isMultiSelect}
                                     key={index} onChange={val => this.afterSelect({[field]: val})}
                                     conditionWidth={conditionWidth}
                  />
                } else if (item.type === 'moreSelect') {
                  const {titleValue, subValue} = this.state;
                  return <SearchMoreItem titles={titles || item.title} dict={item.dict} titleValue={titleValue}
                                         subValue={subValue} key={index}
                                         onChange={(val, item, text) => this.afterSelectMore(val, item, text)}
                                         changeTabs={val => {
                                           this.changeTabs(val)
                                         }}
                                         conditionWidth={conditionWidth}/>
                }
              }
            ) : null
          }
        </div>
        {/*尾部*/}
        {
          this.renderFooter()
        }
      </div>
    )
  }
}

Search.defaultProps = {
  isShowResult: true
}

export default Search;
