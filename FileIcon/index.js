/**
 * 文件类型图标
 */
import React from 'react'
import styles from './styles.less'
import { types, defaultTypes } from './propTypes'
import classnames from 'classnames'
import wordImg from '../assets/imgs/word.png'
import excelImg from '../assets/imgs/excel.png'
import pptImg from '../assets/imgs/ppt.png'
import pdfImg from '../assets/imgs/pdf.png'
import txtImg from '../assets/imgs/txt.png'
import zipImg from '../assets/imgs/zip.png'
import rarImg from '../assets/imgs/rar.png'
import pngImg from '../assets/imgs/x.png'
import jpgImg from '../assets/imgs/x.png'
import bmpImg from '../assets/imgs/x.png'
import xImg from '../assets/imgs/x.png'
import { FILE_TYPES, FILE_TYPE_MAP_EXTENSION } from './config'

const fileTypeMapImg = {
  word: wordImg, 
  excel: excelImg, 
  ppt: pptImg, 
  pdf: pdfImg, 
  txt: txtImg, 
  zip: zipImg, 
  rar: rarImg, 
  png: pngImg, 
  jpg: jpgImg, 
  bmp: bmpImg, 
}

let fileTypeMap = {}

FILE_TYPES.forEach(type => {
  fileTypeMap[type] = { extensionNames: FILE_TYPE_MAP_EXTENSION[type], icon: fileTypeMapImg[type] }
})

class FileIcon extends React.Component {
  static propTypes = types
  static defaultProps = defaultTypes

  render() {
    const { className, style, type, extensionName: extensionNameProp, size } = this.props
    const cls = {
      FileIcon: 1,
      [className]: !!className
    }
    let fileType
    if (type) {
      fileType = type
    } else if (extensionNameProp) {
      const extensionName = extensionNameProp.toLowerCase()
      fileType = Object.keys(fileTypeMap).find(key => fileTypeMap[key].extensionNames.indexOf(extensionName) >= 0)
    }
    const src = fileTypeMap[fileType] ? fileTypeMap[fileType].icon : null
    return (
      <div className={classnames(cls)} style={style}>
        {src ?
          <img src={src} width={size} height={size} />
          :
          <div className="FileIcon-placeholder" style={{ width: size, height: size }} />
        }
      </div>
    )
  }
}

export default FileIcon
