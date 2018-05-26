/**
 * 列表，基于antd的Table组件
 * 1、添加默认的size、rowKey、pagination属性设置
 * 2、列配置属性支持字典项的格式化
 * 3、内滚动控制
 * 4、金额格式化
 * 5、设置默宽度为 COL_WIDTH_M（110px）
 *
 * @property {string} [noDataTips] - 无数据时的提示文字
 * @property {[Object]} columns 在antd的Table组件的columns属性配置的基础上，添加配置项：
 1、[dict] {[object]} 字典 格式如：
 [{
     val: string 字典项的值
     text: string 字典项显示的文字
   }]
 2、[format] {string} 格式化  目前支持的类型有：'money'
 3、[lines] {number} 最大行数
 4、[getActionConfig] {Function(text, record, index)} 获取操作按钮配置，
 @param {string} text - 当前单元格文字
 @param {object} record - 当前行记录
 @param {number} index - 行序号
 @return {object[]} - 操作按钮配置数据，有两种类型：单个按钮和“更多”按钮，格式如下：
 [
 { 一个操作按钮的配置
   text: string - 按钮文字
   [onClick]: Function - 点击时的回调
   [disabled]: boolean - 是否禁用
   [hide]: boolean - 是否隐藏
 },
 { “更多”按钮配置
   menus: object[] - 更多菜单下的按钮集合，其中单个按钮的配置同上
   [disabled]: boolean - 是否禁用
   [hide]: boolean - 是否隐藏
 },
 ]
 *
 * 实例方法：refreshScrollV
 *
 * antd的Table组件属性参见：https://ant.design/components/table-cn/
 */
import React from 'react'
import ReactDOM from 'react-dom'
import {Table} from 'antd'
import DropdownMenu from 'COMPONENT/DropdownMenu'
import {COL_WIDTH_XS, COL_WIDTH_S, COL_WIDTH_M, COL_WIDTH_L, COL_WIDTH_XL} from './config'
import MoneyCell from '../List/MoneyCell'
import LongCell from '../List/LongCell'
import styles from './CardList.less'
import TextLink from '../TextLink'

class CardList extends React.Component {

  constructor(props) {
    super(props)
    this.longCells = [] //内容超长单元格实例集合
    let expandedRowKeys = null
    if ('expandedRowKey' in this.props) {
      expandedRowKeys = this.props.expandedRowKey ? [this.props.expandedRowKey] : []
    } else if ('expandedRowKeys' in this.props) {
      expandedRowKeys = this.props.expandedRowKeys
    }
    this.state = {
      expandedRowKeys,
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize, true)
    this.handleWindowResize()
    this.setNoDataTips()
    this.setExpandRow()
  }

  componentWillReceiveProps(nextProps) {
    if ('expandedRowKey' in nextProps) {
      this.setState({expandedRowKeys: nextProps.expandedRowKey === null || nextProps.expandedRowKey === undefined ? [] : [nextProps.expandedRowKey]})
    } else if ('expandedRowKeys' in nextProps) {
      this.setState({expandedRowKeys: nextProps.expandedRowKeys})
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.rowSelection !== this.props.rowSelection) {
      this.handleWindowResize()
    }
    this.refreshScrollV()
    this.setNoDataTips()
    this.setExpandRow()

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize, true)
  }

  /**
   * 设置无数据提示信息
   */
  setNoDataTips = () => {
    const props = this.props
    if (!props.dataSource || props.dataSource.length === 0) {
      this.$list.querySelector('.ant-table-placeholder > span').innerHTML = props.noDataTips || '暂无数据'
    }
  }

  /**
   * 窗口大小变化时，
   * 1、同步固定列与他对应的列的宽度
   * 2、更新纵向滚动状态
   * 3、刷新内容超长单元格的提示框显示状态
   */
  handleWindowResize = () => {
    const {columns} = this.props
    let fixLeftW = 0
    let fixRightW = 0
    let totalW = 0
    columns.forEach(col => {
      const {width: widthConfig, fixed} = col
      const width = widthConfig || COL_WIDTH_M
      if (fixed === 'left') {
        fixLeftW += width
      }
      if (fixed === 'right') {
        fixRightW += width
      }
      totalW += width
    })
    const $table = this.$list.querySelector('.ant-table-wrapper')
    const tableW = $table.offsetWidth
    if (tableW > totalW) {
      fixLeftW = Math.ceil(fixLeftW * tableW / totalW)
      fixRightW = Math.ceil(fixRightW * tableW / totalW)
    }
    if (fixLeftW) {
      const $checkTh = $table.querySelector('th.ant-table-selection-column')
      if ($checkTh) {
        fixLeftW += $checkTh.offsetWidth
      }
      $table.querySelector('.ant-table-fixed-left').style.width = fixLeftW + 'px'
    }
    if (fixRightW) {
      $table.querySelector('.ant-table-fixed-right').style.width = fixRightW + 'px'
    }
    this.refreshScrollV()
    this.longCells.forEach(c => c.refreshTooltip())
  }

  /**
   * 刷新纵向滚状态，总高度超出父容器高度时滚动，
   * 总高度为：列表表头高度（48px） + 列表体内容高度 + 列标题下方横向滚动条高度（6px）+ 页码栏高度（44px或无）
   */
  refreshScrollV = () => {
    if (this.props.expandedRowRender) {
      return
    }
    const {pagination} = this.props
    const $list = this.$list
    const parentH = $list.parentNode.offsetHeight
    const bodyH = $list.querySelector('.ant-table-body .ant-table-fixed').offsetHeight
    const totalH = 48 + bodyH + 6 + (this.getPagination() ? 50 : 0)
    const $rightFixedInner = $list.querySelector('.ant-table-fixed-right .ant-table-body-inner')
    if (totalH > parentH) {
      $list.style.height = '100%'
      if ($rightFixedInner) {
        $rightFixedInner.style.overflowY = 'scroll'
      }
    } else {
      $list.style.height = 'auto'
      if ($rightFixedInner) {
        $rightFixedInner.style.overflowY = 'auto'
      }
    }
  }

  expandChange = (changed) => {
    this.setExpandRow()
    const {onExpandedRowsChange, onExpandedRowChange} = this.props
    const {expandedRowKeys} = this.state
    if (onExpandedRowChange) {
      const newKey = changed.length > expandedRowKeys.length ? changed.find(c => !expandedRowKeys.some(e => e === c)) : null
      onExpandedRowChange(newKey)
    } else if (onExpandedRowsChange) {
      onExpandedRowsChange(changed)
    }
  }

  /**
   * 设置展开行，去除第一个占位单元格，第二个单元格占满整行
   */
  setExpandRow = () => {
    let {detailIndent = false} = this.props;
    if(!detailIndent){
      setTimeout(() => {
        if (!this.$list) {
          return
        }
        const rows = this.$list.querySelectorAll('.ant-table-expanded-row.ant-table-expanded-row-level-1')
        rows.forEach(row => {
          const tds = row.querySelectorAll('td')
          if (tds.length === 2) {
            row.removeChild(tds[0])
            let td = tds[1]
            const colSpan = td.getAttribute('colSpan')
            td.setAttribute('colSpan', parseInt(colSpan) + 1)
            /*        let content = document.createElement('div')
                    content.setAttribute('class', 'CardList-expand-content')
                    content.innerHTML = td.innerHTML
                    td.innerHTML = content.outerHTML*/
          }
        })
      })
    }
  }

  /**
   * 获取页码配置，如果列表无数据则返回false
   */
  getPagination = () => {
    const {pagination: paginationProp, dataSource} = this.props
    let pagination = false
    if (paginationProp) {
      pagination = {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: total => `共 ${total} 条记录`,
        ...paginationProp,
      }
    }
    return pagination
  }

  render() {
    const {columns: columnsProp, pagination: paginationProp, scroll, dataSource: dataSourceProp, expandedRowRender, onExpandedRowsChange, ...props} = this.props
    const {expandedRowKeys} = this.state
    let scrollX = 0
    const columns = columnsProp.map(col => {
      const {dict, lines, format, width: widthConfig, title: titleConfig, render: renderConfig, getActionConfig, ...configs} = col
      const width = widthConfig || COL_WIDTH_M
      scrollX += width
      let title = titleConfig
      let render = renderConfig
      if (format) {
        if (format === 'money') {
          title = <div className="CardList-moneyTitle">{title}</div>
          render = (text, record, index) => {
            return <MoneyCell>{text}</MoneyCell>
          }
        }
      } else if (dict) {
        render = (text, record, index) => {
          let cellContent = text
          const opt = dict.find(opt => opt.val === text)
          if (opt) {
            cellContent = opt.text
          }
          if (renderConfig) {
            cellContent = renderConfig(cellContent, record, index)
          }
          return cellContent
        }
      } else if (getActionConfig) {
        render = (text, record, index) => {
          const actions = getActionConfig(text, record, index)
          let actionBtnItems = []
          let moreAction
          actions.filter(act => !act.hide).forEach((act, i) => {
            if (act.menus) {
              moreAction = act
            } else {
              actionBtnItems.push(<TextLink key={i} className="list-btn" onClick={act.onClick}
                                            disabled={act.disabled}>{act.text}</TextLink>)
            }
          })
          return (
            <span>
              {actionBtnItems}
              {moreAction &&
              <DropdownMenu
                className="list-btn"
                text="更多"
                size="small"
                placement="bottomRight"
                menus={moreAction.menus}
                disabled={moreAction.disabled}
                hasArrow={true}
              />
              }
            </span>
          )
        }
      }

      let newRender
      if (render) {
        newRender = (text, record, index) => {
          if (record.key === 'empty-placeholder-data') {
            return null
          } else {
            return render(text, record, index)
          }
        }
      }

      let afterRender
      if (lines) {
        afterRender = (text, record, index) => <LongCell lines={lines}
                                                         ref={c => this.longCells[index] = c}>{newRender ? newRender(text, record, index) : text}</LongCell>
      }

      return {width, title, render: afterRender || newRender, ...configs}
    })

    const dataSource = dataSourceProp.map((d, i) => {
      return {key: i, ...d}
    })

    const pagination = this.getPagination()

    return (
      <div
        className={'CardList' + (pagination ? ' CardList-hasPagination' : '') + (expandedRowRender ? ' CardList-expandable' : '')}
        ref={c => this.$list = ReactDOM.findDOMNode(c)}
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey={record => record.key}
          pagination={pagination}
          scroll={{x: scrollX, y: 5000}}
          expandedRowRender={expandedRowRender}
          expandedRowKeys={expandedRowKeys}
          onExpandedRowsChange={this.expandChange}
          {...props}
        />
      </div>
    )
  }
}

CardList.COL_WIDTH_XS = COL_WIDTH_XS

CardList.COL_WIDTH_S = COL_WIDTH_S

CardList.COL_WIDTH_M = COL_WIDTH_M

CardList.COL_WIDTH_L = COL_WIDTH_L

CardList.COL_WIDTH_XL = COL_WIDTH_XL

export default CardList
