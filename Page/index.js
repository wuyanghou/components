/**
 * 通用页面组件，封装业务页面的基础功能，如加载状态、底部按钮
 * @property {object?} route  路由信息
 * @property {boolean?} fitWindowHeight  是否适应窗口高度
 * @property {boolean|reactNode?}  title  标题（位于顶部栏左侧），默认显示导航信息
 * @property {ReactNode?} headerToolBar  顶部工具栏（位于顶部栏右侧）
 * @property {boolean|reactNode?}  footer  底部工具栏，为true时显示默认内容，即确定和取消两个按钮
 * @property {function?} onOk  点底部栏的确定按钮时的回调函数
 * @property {function?} onCancel  点底部栏的取消按钮时的回调函数
 * @property {boolean?} okBtnShow  确定按钮显示状态，默认为true
 * @property {boolean?} cancelBtnShow  取消按钮显示状态，默认为false
 * @property {string?} okBtnText  确定按钮文字，默认为“提交”
 * @property {string?} cancelBtnText  确定按钮文字，默认为“取消”
 * @property {boolean?} loading  页面加载状态
 * @property {string?} error  内容加载错误信息
 * @property {string?} className  页面最外层容器附加类名
 * @property {Object?} cancelConfirm 取消按钮点击确认框配置信息，结构如下：
 * {
 *   content, {ReactNode} - 信息内容
 *   okBtnText, {string?} - 确定按钮的文字
 *   cancelBtnText {string?} - 取消按钮的文字
 * }
 * @property {boolean?} hasBackground  是否有背景，默认为true
 * @property {reactNode?}  name  页面名称，导航栏中对应于当前页面的项目
 *
 * 公用方法：showOkTips
 */
import React from 'react'
import { Link, browserHistory } from 'dva/router'
import ReactDOM from 'react-dom'
import { Breadcrumb } from 'antd'
import PopTip from '../PopTip'
import PopConfirm from '../PopConfirm'
import Loading from '../Loading'
import './styles.less'
import DotButton from '../DotButton'
import Button from '../Button'
import ErrorTips from '../ErrorTips'
import PropTypes from 'prop-types'

class Page extends React.Component {
  static defaultProps = {
    hasBackground: true,
  }
  constructor(props) {
    super(props)
    this.state = {
      hasScroll: false,  //页面是否有滚动条
      scrollMax: false,  //页面是否滚动到了最末
      okTips: null,  //确定按钮提示信息
      okTipsVisible: false,  //确定按钮提示信息显示状态
    }
  }

  componentDidMount() {
    this._scroller.addEventListener('scroll', this.handlePageScroll, false)
    window.addEventListener('resize', this.handlePageScroll, false)
    this.handlePageHeightChange()
  }

  componentDidUpdate() {
    this.handlePageHeightChange()
  }

  componentWillUnmount() {
    this._scroller.removeEventListener('scroll', this.handlePageScroll, false)
    window.removeEventListener('resize', this.handlePageScroll, false)
  }

  /**
   * 判断页面是否有滚动条，并更新状态
   */
  handlePageHeightChange = () => {
    const obj = this._scroller
    const hasScroll = obj.scrollHeight > obj.clientHeight || obj.offsetHeight > obj.clientHeight
    if(hasScroll !== this.state.hasScroll){
      this.setState({ hasScroll })
    }
  }

  /**
   * 判断页面是否滚动到了最末，并更新状态
   */
  handlePageScroll = () => {
    const obj = this._scroller
    this.setState({ scrollMax: obj.scrollHeight - obj.clientHeight - obj.scrollTop <= 16 })
  }

  /**
   * 确定按钮显示提示信息
   * @param  {string} text 信息文本
   */
  showOkTips = (text) => {
    this.setState({ okTips: text, okTipsVisible: true })
  }

  onOkTipsVisibleChange = (visible) => {
    if (!visible) {
      this.setState({ okTipsVisible: visible })
    }
  }

  onCancel = () => {
    const { onCancel, cancelConfirm } = this.props
    if (cancelConfirm) {
      this._cancelConfirm.show()
    } else {
      onCancel()
    }
  }

  back = () => {
    const { route } = this.props
    const { navs, path, name } = route || {}
    const allNavs = [...(navs || []), { path, name }]
    console.log(allNavs[allNavs.length - 2].path)
    browserHistory.push(allNavs[allNavs.length - 2].path)
  }

  getScrollerElement = () => {
    return ReactDOM.findDOMNode(this._scroller)
  }

  render(){
    const { fitWindowHeight, title, headerToolBar, footer, children, loading, onOk, onCancel,
      okBtnShow, cancelBtnShow: cancelBtnShowProp, okBtnText, cancelBtnText, className, route,
      cancelConfirm, error, hasBackground, name: nameProp,
    } = this.props
    const { navs, path, name } = route || {}
    const { hasScroll, scrollMax, okTips, okTipsVisible } = this.state
    const cancelBtnShow = cancelBtnShowProp === undefined ? false : cancelBtnShowProp
    const isCustomTitle = title !== undefined
    const allNavs = [...(navs || []), { path, name }]
    const isIndexPage = allNavs.length === 1
    const breadcrumbItems = allNavs.map((nav, i) => {
      const { path, name } = nav
      let inner = name
      if (i === allNavs.length - 1 && nameProp) {
        inner = nameProp
      }
      if(i !== allNavs.length - 1){
        inner = <Link to={path}>{inner}</Link>
      }
      if(i !== 0){
        inner = <span className="boss-page-nav-secondary">{inner}</span>
      }
      return <Breadcrumb.Item key={path}>{inner}</Breadcrumb.Item>
    })

    const { content: cancelConfirmContent, okBtnText: cancelConfirmOkBtnText, cancelBtnText: cancelConfirmCancelBtnText } = cancelConfirm || {}
    let cancelBtn = <Button onClick={this.onCancel}>{cancelBtnText || '取消'}</Button>
    if (cancelConfirm) {
      cancelBtn = (
        <PopConfirm
          content={cancelConfirmContent}
          okBtnText={cancelConfirmOkBtnText}
          cancelBtnText={cancelConfirmCancelBtnText}
          onOk={onCancel}
          ref={c => this._cancelConfirm = c}
          getPopupContainer={() => document.body}
        >
          {cancelBtn}
        </PopConfirm>
      )
    }
    const footerChild = footer === true ?
    <div style={{ overflow: 'hidden' }}>
      {(cancelBtnShow === undefined || cancelBtnShow === true) &&
        <div className="Page-btn-wrap">
          {cancelBtn}
        </div>
      }
      {(okBtnShow === undefined || okBtnShow === true) &&
        <div className="Page-btn-wrap">
          <PopTip content={okTips} visible={okTipsVisible} onVisibleChange={this.onOkTipsVisibleChange} getPopupContainer={() => document.body}>
            <Button type="primary" onClick={onOk} disabled={loading}>{okBtnText || '提交'}</Button>
          </PopTip>
        </div>
      }
    </div> : footer

    //当页面有滚动条，但没有滚动到最末，则底部栏为固定在底部的漂浮状态
    const btnFixed = hasScroll && !scrollMax

    return (
      <div className={'Page ' + (className || '')}>
        <div className="Page-scroller" ref={c => this._scroller = c}>
          <div className={'Page-content' + (fitWindowHeight ? ' Page-content-fit' : '') + (hasBackground ? ' Page-background' : '')}>
            {(!isCustomTitle || title || headerToolBar) &&
              <div className="Page-header">
                {!isCustomTitle && !isIndexPage &&
                  <div className="Page-backBtn">
                    <Link to={allNavs[allNavs.length - 2].path}>
                      <DotButton iconType="arrowLeft" size={18} className="Page-back-icon" />
                    </Link>
                  </div>
                }
                {!isCustomTitle &&
                  <div className={'Page-title Page-title-default' + (isIndexPage ? ' Page-iconTitle' : '')}>
                    <Breadcrumb>
                      {breadcrumbItems}
                    </Breadcrumb>
                  </div>
                }
                {isCustomTitle &&
                  <div className={'Page-title'}>
                    {title}
                  </div>
                }
                <div className="Page-headerToolBar">
                  {headerToolBar}
                </div>
              </div>
            }
            <div className="Page-body">
              {error ?
                <ErrorTips text={error} />
                :
                children
              }
            </div>
            {footerChild &&
              <div className="Page-footer" style={btnFixed ? { opacity: 0 } : null}>
                {!btnFixed && footerChild}
              </div>
            }
          </div>
        </div>
        {footerChild &&
          <div
            className="Page-footer-fixed-bg"
            style={{ opacity: btnFixed ? 1 : 0, transition: btnFixed ? 'opacity .5s' : 'none' }}>
          </div>
        }
        {footerChild && btnFixed &&
          <div className="Page-footer-fixed">
            {footerChild}
          </div>
        }
        <Loading loading={loading} />
      </div>
    )
  }

}

export default Page



