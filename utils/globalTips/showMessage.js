import { message } from 'antd'

export default function showMessage(text, type) {
  if(type && type === 'success'){
    message.destroy();
    message.success(text)
  }else{
    message.destroy();
    message.error(text)
  }
}
