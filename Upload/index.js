import React from 'react';
import styles from './index.less';
import showMessage from 'COMPONENT/utils/globalTips/showMessage';
import {getSseKey} from 'SERVICE/common';
import {uuid} from 'COMPONENT/utils/basic/str';

export default class SelfUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
  }

  triggerInput = () => {
    this.$input.click();
  }

  limitValidate(data, file) {
    let {size, type} = data;
    if (size && !(file.size / 1024 < size)) {
      showMessage(`文件大小超过${size}k`);
      return false;
    }
    if (type) {
      let limitType;
      type.split('/').forEach((v, k) => {
        if (file.type.includes(v)) {
          limitType = true;
        }
      })
      if (!limitType) {
        showMessage(`只能上传${type}文件`);
        return false;
      }
    }
    return true;
  }

  onChange = async (e) => {
    let list = [];
    let {beforeUpload} = this.props;
    let fileList = Object.values(e.target.files);
    if (typeof beforeUpload === 'function') {
      fileList.forEach((v, k) => {
        v['fileKey'] = uuid();
      })
      let res = beforeUpload(fileList);
      if (res === false) {
        return false;
      } else if (res instanceof Array) {
        if (!this.checkLimit(res || fileList)) {
          return false;
        }
        this.getKeyAndMapRequest(res || fileList, list);
      } else {
        res.then(async (resolve) => {
          if (!this.checkLimit(resolve || fileList)) {
            return false;
          }
          this.getKeyAndMapRequest(resolve || fileList, list);
        }).catch((reject) => {
          return false;
        })
      }
    } else {
      if (!this.checkLimit(fileList)) {
        return false;
      }
      this.getKeyAndMapRequest(fileList, list);
    }
  }

  checkLimit = (fileList) => {
    let {limit} = this.props;
    if (limit) {
      for (let item of fileList) {
        if (!this.limitValidate(limit, item)) {
          return false;
        }
      }
    }
    return true;
  }
  getKeyAndMapRequest = async (fileList, list) => {
    let configKey = await getSseKey();
    //  循环  uploadFile
    for (let file of fileList) {
      this.uploadFile(file, configKey, list);
    }
  }

  uploadFile = (file, configKey, list) => {
    let realname =file.name;
    let {fileKey} = file;
    let formData = new FormData();
    formData.append('x:realname', realname);
    formData.append('x:uploadtype', 'ipad');
    formData.append('x:uploadid', uuid());
    formData.append('key', fileKey);
    Object.keys(configKey).forEach((key, index) => {
      if (key != 'host') formData.append(key, configKey[key]);
    });
    formData.append('file', file);
    let info = {};
    let xhr = new XMLHttpRequest();
    xhr.open('POST', configKey.host, true);
    xhr.upload.onloadstart = (file) => {
      info = {...info, fileKey, showProgress: true, percent: 0};
      this.update(info, list);
    }
    xhr.upload.onprogress = (file) => {
      info = {...info, percent: file.loaded * 100 / file.total};
      this.update(info, list);
    }
    xhr.onload = (res) => {
      if (res.target.status === 200) {
        info = {...info, src: configKey.host + fileKey, showProgress: false, ...JSON.parse(res.target.response)};
      } else {
        info = {...info, src: configKey.host + fileKey, showProgress: false, errorCode: res.target.status};
      }
      this.update(info, list);
    }
    xhr.onerror = () => {
      info['error'] = true;
      this.update(info, list);
    }
    xhr.send(formData);
  }
  update = (info, list) => {
    let {onChange, multiple = false} = this.props;
    if (multiple) {
      // let {list} = this.state;
      let tags = false;
      let index;
      for (let i = 0; i < list.length; i++) {
        if (list[i].fileKey === info.fileKey) {
          tags = true;
          index = i;
          break;
        }
      }
      if (tags) {
        list[index] = info;
      } else {
        list.push(info);
      }
      onChange(list);
    } else {
      onChange(info);
    }
  }

  render() {
    let {multiple = false} = this.props;
    return (
      <div onClick={this.triggerInput}>
        <input type="file"
               multiple={multiple}
               ref={e => this.$input = e}
               onChange={this.onChange}
               className={styles.upload}/>
        {this.props.children}
      </div>
    )
  }
}
