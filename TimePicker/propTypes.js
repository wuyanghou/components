import PropTypes from 'prop-types'

const noop = () => {}

export const compPropTypes = {
  disabledHours: PropTypes.func,  //获取要禁用的小时
  disabledMinutes: PropTypes.func,  //获取要禁用的分钟
  getPopupContainer: PropTypes.func,  //获取承载弹框的DOM元素的函数
  onChange: PropTypes.func,  //值变化时的回调
  onFocus: PropTypes.func,  //得到焦点时的回调
  onBlur: PropTypes.func,  //失去焦点时的回调
  onClick: PropTypes.func,  //点击事件回调
  placeholder: PropTypes.string,  //占位文字
  size: PropTypes.oneOf(['small', 'xSmall']),  //大小
  title: PropTypes.string,  //提示性的标题
  value: PropTypes.string,  //选中值
  disabled: PropTypes.bool,  //禁用状态
  className: PropTypes.string,  //附加在根元素上的类名
  dropdownClassName: PropTypes.string,  //附加在下拉菜单根元素的类名
  style: PropTypes.object,  //附加在根元素上的样式
  dropdownStyle: PropTypes.object,  //附加在下拉菜单根元素的样式
  validator: PropTypes.object,  //校验器的配置参数，参考Validator组件的属性
}

export const compDefaultPropTypes = {
  disabledHours: noop,
  disabledMinutes: noop,
  getPopupContainer: noop,
  onChange: noop,
  onFocus: noop,
  onBlur: noop,
  onClick: noop,
  placeholder: '请选择时间',
}
