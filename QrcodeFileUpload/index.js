/**
 * 二维码文件上传
 * @property {string} width 宽度
 * @property {string} height 高度
 * @property {function} callback sse回调事件,置入参数fileInfo{filePath(文件路径),fileSize(文件大小),realFileName(文件名),type(文件类型)}
 */
import React from 'react'
import {uuid} from '../utils/basic/str'
import {urlBase} from 'CONST/config'
import showMessage from '../utils/globalTips/showMessage'

const QRCode = window.QRCode;
const EventSource = window.EventSource;
const origin = window.location.origin.replace('localhost', '172.16.3.212');

class QrcodeFileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: `q${uuid()}`,
      qrcode: null,
      eventSource: null
    };
  }

  componentDidMount() {
    const {width, height, callback} = this.props;
    const {id} = this.state;
    let {multiple} = this.props;
    if (EventSource) {
      let qrcode = new QRCode(document.querySelector(`#${id}`), {
        text: `${origin}/mobileFileUpload?id=${id}&multiple=${multiple}`,
        width: width,
        height: height,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.Q
      });
      this.setState({qrcode: qrcode});

      let source = new EventSource(`${urlBase}sse/push.do?id=${id}&type=PC`, {withCredentials: true});
      source.onerror = (event) => {
      };
      source.addEventListener(`${id}PC`, (event) => {
        let {multiple} = this.props;
        let data = multiple ? JSON.parse(event.data)[0].fileInfo : JSON.parse(event.data)[0].fileInfo[0];
        callback(data);
      }, false);
      this.setState({eventSource: source});
    } else {
      showMessage('抱歉，当前浏览器不支持扫码上传，请选用Chrome浏览器');
    }
  }

  componentWillUnmount() {
    const {qrcode, eventSource} = this.state;
    qrcode && qrcode.clear();
    eventSource && eventSource.close();
  }

  render() {
    const {id} = this.state;
    return (
      <div id={id}>
      </div>
    )
  }
}

export default QrcodeFileUpload
