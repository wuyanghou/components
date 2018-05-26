import React from 'react'
import './styles.less'
import TextLink from '../../TextLink'
import Input from '../../Input'
import Icon from '../../Icon'
import IconButton from '../../IconButton'
import FileIcon from '../../FileIcon'
import styleVars from '../../theme/variables'
import classnames from 'classnames'
import { Progress } from 'antd'
import downloadFile from '../../utils/file/downloadFile'
import { getFileTypeByExtension } from '../../FileIcon/utils'

const prefixCls = 'FileList-item'
const btnItemCls = `${prefixCls}-btnItem`

class Item extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      ...this.getName(props),
    }
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.data && 'name' in nextProps.data) {
      this.setState(this.getName(nextProps))
    }
  }

  getName = (props) => {
    if (props.data && 'name' in props.data) {
      const fullName = props.data.name
      const idx = fullName.lastIndexOf('.')
      return { name: fullName.slice(0, idx), nameExtend: fullName.slice(idx) }
    }
    return { name: null, nameExtend: null }
  }

  onOk = () => {
    const { name, nameExtend } = this.state
    this.props.onNameChange(name + nameExtend)
    this.setState({ editing: false })
  }

  getNameEle = () => {
    const { type, onPreview, data: { previewPath, src } } = this.props
    const { editing, name, nameExtend } = this.state
    let content
    if (editing) {
      content = (
        <div>
          <Input className={`${prefixCls}-nameLeft`} maxLength={'50'} value={name} style={{ width: 230 }} onChange={e => this.setState({ name: e.target.value })} />
          <div className={`${prefixCls}-nameRight`}>
            {nameExtend}
          </div>
        </div>
      )
    } else {
      if (type === 'view') {
        content = <TextLink type="secondary" onClick={() => onPreview({ previewPath, src, type: getFileTypeByExtension(nameExtend.slice(1)) })}>{name + nameExtend}</TextLink>
      } else {
        content = name + nameExtend
      }
    }
    return (
      <div className={`${prefixCls}-nameWrap`}>
        {content}
      </div>
    )
  }

  getBtnsEle = () => {
    const { type, data: { error, src, name, showProgress }, onDelete } = this.props
    const { editing } = this.state
    let content
    if (type === 'view') {
      content = (
        <IconButton type="download_mc" onClick={() => downloadFile(src, name)} className={btnItemCls} />
      )
    } else if (showProgress) {
    } else if (error) {
      content = (
        <span>
          <IconButton type="delete_mc" className={btnItemCls} onClick={onDelete} />
        </span>
      )
    } else {
      if (editing) {
        content = (
          <span>
            <TextLink onClick={this.onOk} className={btnItemCls}>保存</TextLink>
            <TextLink type="secondary" className={btnItemCls} onClick={() => this.setState({ editing: false })}>取消</TextLink>
          </span>
        )
      } else {
        content = (
          <span>
            <IconButton type="edit_mc" className={btnItemCls} onClick={() => this.setState({ editing: true })} />
            <IconButton type="delete_mc" className={btnItemCls} onClick={onDelete} />
          </span>
        )
      }
    }
    return (
      <div className={`${prefixCls}-btnsWrap`}>
        {content}
      </div>
    )
  }

  render() {
    const { type, data: { showProgress, percent,  error, src, iconSrc }, onNameChange, onDelete, showIcon } = this.props
    const { editing, name, nameExtend } = this.state

    const cls = {
      [`${prefixCls}-wrap`]: 1,
      [`${prefixCls}-wrapEditing`]: editing,
    }

    return (
      <div className={classnames(cls)}>
        <div className={`${prefixCls}-main`}>
          {showIcon &&
            <div className={`${prefixCls}-icon`}>
              {iconSrc ?
                <img src={iconSrc} width="38" height="38" />
                :
                <FileIcon extensionName={nameExtend.slice(1)} />
              }
            </div>
          }
          {this.getNameEle()}
          {this.getBtnsEle()}
        </div>
        {showProgress &&
          <div className={`${prefixCls}-progressWrap`}>
            <Progress
              percent={percent}
              size="small"
              showInfo={false}
              strokeWidth={4}
            />
          </div>
        }
        {error &&
          <div className={`${prefixCls}-errorWrap`}>
            <Icon type="warning" color={styleVars.highlightColor} className={btnItemCls} size={12} />
            <span className={`${prefixCls}-error`}>{error}</span>
          </div>
        }
      </div>
    )
  }
}

export default Item
