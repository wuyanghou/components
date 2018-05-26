import PropTypes from 'prop-types'

export const types = {
  className: PropTypes.string,  //附加在根元素上的类名
  style: PropTypes.object,  //附加在根元素上的样式
  type: PropTypes.string,  //文件类型
  extensionName: PropTypes.string,  //扩展名
  size: PropTypes.number,  //大小
}

export const defaultTypes = {
  size: 38,
}
