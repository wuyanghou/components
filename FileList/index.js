/**
 * 文件列表
 */
import React from 'react'
import './styles.less'
import { types, defaultTypes } from './propTypes'
import classnames from 'classnames'
import Item from './Item'

class FileList extends React.Component {
  static propTypes = types
  static defaultProps = defaultTypes

  onFileNameChange = (id, name) => {
    const { data, onChange } = this.props
    const newData = data.map(file => {
      if (file.id === id) {
        return { ...file, name }
      }
      return file
    })
    onChange(newData)
  }

  onDelete = (id) => {
    const { data, onChange } = this.props
    onChange(data.filter(f => f.id !== id))
  }

  render() {
    const { className, style, type, data, onChange, onPreview, showIcon } = this.props
    const cls = {
      FileList: 1,
      [className]: !!className
    }

    return (
      <div className={classnames(cls)} style={style}>
        {
          data.map((file, idx) => {
            const { id } = file
            return (
              <div key={id} className="FileList-itemWrap">
                <Item 
                  type={type === 'view' ? 'view' : null}
                  onNameChange={name => this.onFileNameChange(id, name)}
                  onDelete={() => this.onDelete(id)}
                  data={file}
                  onPreview={onPreview}
                  showIcon={showIcon}
                />
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default FileList
