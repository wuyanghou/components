import PropTypes from 'prop-types'

const noop = () => {}

export const types = {
  className: PropTypes.string,  //附加在根元素上的类名
  style: PropTypes.object,  //附加在根元素上的样式
  type: PropTypes.oneOf(['view', 'edit']),  //类型，查看：'view'，编辑：'edit'
  showIcon: PropTypes.bool,  //是否显示图标
  data: PropTypes.arrayOf(PropTypes.shape({   //列表数据
    id: PropTypes.string,  //文件ID
    name: PropTypes.string,  //文件名称
    src: PropTypes.string,  //文件源地址
    previewPath: PropTypes.string,  //文件预览地址
    showProgress: PropTypes.bool,  //是否显示上传进度条
    percent: PropTypes.number,  //上传进度百分比
    error: PropTypes.string,  //错误信息
    iconSrc: PropTypes.string,  //自定义图标源地址
  })), 
  onChange: PropTypes.func,  //变化时的回调
  onPreview: PropTypes.func,  //预览时的回调
}

export const defaultTypes = {
  type: 'edit',
  showIcon: true,
  data: [],
  onChange: noop,
  onPreview: noop,
}
