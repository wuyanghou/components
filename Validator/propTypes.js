import PropTypes from 'prop-types'

const noop = () => {}

export const types = {
  value: PropTypes.any,  //待校验的值
  className: PropTypes.string,  //附加在根元素上的类名
  children: PropTypes.node.isRequired,  //待校验的输入项目
  onErrorChange: PropTypes.func,  //错误信息变化时的回调
  keepHeight: PropTypes.bool,  //保持原有高度，即提示信息不撑开高度
  rules: PropTypes.arrayOf(PropTypes.any),  //校验规则集合，可以为三种类型，string、object、function
  style: PropTypes.object,  //附加在根元素上的样式
  silent: PropTypes.bool,  //不显示错误信息及状态样式
  showTips: PropTypes.bool,  //显示错误信息
  showStatus: PropTypes.bool,  //显示错误状态样式
  error: PropTypes.string,  //错误信息
}

export const defaultTypes = {
  onErrorChange: noop,
  rules: ['required'],
  showTips: true,  
  showStatus: false, 
}
