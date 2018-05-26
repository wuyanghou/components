import PropTypes from 'prop-types'

export const pTypes = {
  className: PropTypes.string,  //附加在根元素上的类名
  style: PropTypes.object,  //附加在根元素上的样式
  title: PropTypes.node,  //标题
  toolBar: PropTypes.node,  //右侧工具栏
  children: PropTypes.node,  //主体内容
  loading: PropTypes.bool,  //加载状态
}

export const SelectDefaultPropTypes = {

}
