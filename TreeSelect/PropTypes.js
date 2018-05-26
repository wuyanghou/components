import PropTypes from 'prop-types'
import { SELECT_NOT_FOUND_TIPS } from '../utils/form/config'

const noop = () => {}

export const SelectPropTypes = {
  className: PropTypes.string,  //附加在根元素上的类名
  dict: PropTypes.arrayOf(PropTypes.shape({
    val: PropTypes.string,  //选项值，在整棵树中唯一
    text: PropTypes.string,  //选项显示文字
    disabled: PropTypes.bool,  //选项禁用状态
    isLeaf: PropTypes.bool,  //是否叶子结点，仅动态加载结点数据时使用
    parentVal: PropTypes.string,  //父结点值，根结点时为null
  })),  //选项字典
  dropdownClassName: PropTypes.string,  //附加在下拉菜单根元素的类名
  disabled: PropTypes.bool,  //禁用状态
  filter: PropTypes.func,  //自定义的搜索函数
  getPopupContainer: PropTypes.func,  //获取承载弹框的DOM元素的函数
  noOptionTips: PropTypes.string,  //无选项提示文字
  searchNotFoundTips: PropTypes.string,  //搜索无匹配结果时提示文字
  searchPlaceholder: PropTypes.string,  //搜索框的占位文字
  onChange: PropTypes.func,  //值变化时的回调
  onSelect: PropTypes.func,  //选中选项时的回调
  onFocus: PropTypes.func,  //得到焦点时的回调
  onBlur: PropTypes.func,  //失去焦点时的回调
  onClick: PropTypes.func,  //点击事件回调
  placeholder: PropTypes.string,  //占位文字
  showSearch: PropTypes.bool,  //是否可搜索
  size: PropTypes.oneOf(['small', 'xSmall']),  //大小
  style: PropTypes.object,  //附加在根元素上的样式
  title: PropTypes.string,  //提示性的标题
  validator: PropTypes.object,  //校验器的配置参数，参考Validator组件的属性
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({    //当textInValue为true时使用这种格式
      val: PropTypes.string,
      text: PropTypes.string,
    }),
  ]),  //选中值
  textInValue: PropTypes.bool,  //值包含选项文本，此时value使用{val, text}格式
  allowClear: PropTypes.bool,  //是否允许清除
  dropdownStyle: PropTypes.object,  //附加在下拉菜单根元素的样式
  onLoadChildren: PropTypes.func,  //触发加载子结点数据时的回调，设置了该属性即指定为动态加载结点数据
  onSearchKeyChange: PropTypes.func,  //搜索关键字变化时的回调，设置了该属性时默认的搜索失效
  expandedKeys: PropTypes.arrayOf(PropTypes.string),  //展开的结点。只有一个一级结点时默认展开一级结点；多个一级结点时，默认不展开
  onExpandChange: PropTypes.func,  //展开结点变化时的回调
}

const defaultFilterFn = (searchKey, option) => {
  return option.text.indexOf(searchKey) >= 0
}

export const SelectDefaultPropTypes = {
  placeholder: '请选择',
  showSearch: true,
  onChange: noop,
  onSelect: noop,
  onFocus: noop,
  onBlur: noop,
  noOptionTips: SELECT_NOT_FOUND_TIPS,
  searchNotFoundTips: SELECT_NOT_FOUND_TIPS,
  searchPlaceholder: '请输入内容搜索',
  getPopupContainer: noop,
  onClick: noop,
  dict: [],
  filter: defaultFilterFn,
  allowClear: true,
  onExpandChange: noop,
}
