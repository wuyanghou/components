/**
 * 搜索栏，功能是：1、布局，输入控件按指定的列数布局，当大于一行时，添加“显示更多”按钮  2、添加“查询”、“重置”按钮
 * @property {[ReactNode]} children 输入搜索条件的控件
 * @property {function} onSearch 触发查询时的回调
 * @property {function} onReset 触发重置时的回调
 * @property {boolean?} expand 是否展开
 * @property {function?} onToggleExpand 切换展开状态时的回调
 */
import React from 'react'
import { Form } from 'antd'
import Button from '../Button'
import TextLink from '../TextLink'
import './styles.less'

class SearchBar extends React.Component {

  constructor(props) {
    super(props)
    const { expand } = this.props
    this.state = {
      expand: expand === undefined ? false : expand,
    }
  }

  componentWillReceiveProps(nextProps) {
    if('expand' in nextProps){
      const { expand } = nextProps
      this.setState({ expand })
    }
  }

  /**
   * 触发查询
   * @param  {object} e 表单提交事件
   */
  search = (e) => {
    const { onSearch } = this.props
    e.preventDefault()
    onSearch()
  }

  /**
   * 点击“更多”按钮时的处理：1、切换展开状态；2、触发切换展开状态回调
   */
  moreBtnClick = () => {
    const { expand: expandProp, onToggleExpand } = this.props
    const { expand } = this.state
    const newExpand = !expand
    if (!expandProp) {
      this.setState({ expand: newExpand })
    }
    if (onToggleExpand) {
      onToggleExpand(newExpand)
    }
  }

  render() {
    const { children, onReset } = this.props
    const { expand } = this.state
    const controls = children instanceof Array ? children : [children]

    return (
      <Form className={'SearchBar' + (expand ? ' SearchBar-expand' : '')} onSubmit={this.search}>
        <div className={'SearchBar-controls' +
          ' SearchBar-controls-' + controls.length +
          (controls.length > 6 ? ' SearchBar-controls-moreThan6' : '')
        }>
          <div className="SearchBar-controls-inner">
            {
              controls.map((control, i) => {
                return (
                  <div key={i} className="SearchBar-control">
                    {control}
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="SearchBar-btns">
          <TextLink className="SearchBar-moreBtn" onClick={this.moreBtnClick}>
            {expand ? '收起' : '更多'}
          </TextLink>
          <Button type="primary" htmlType="submit" style={{ margin: '0 20px 0 30px' }}>查 询</Button>
          <Button onClick={onReset}>重 置</Button>
        </div>
      </Form>
    )
  }
}

export default SearchBar
