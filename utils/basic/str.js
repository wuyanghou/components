/**
 * 去首尾空格
 */
const trim = (str) => {
  if(str){
    return str.replace(/(^\s*)|(\s*$)/g,'')
  }
  return str
}

/**
 * 限制字符串长度
 * @param  {string} text 原字符串
 * @param  {number} maxNum 最大字符数
 * @return {string}
 */
const cutText = (text, maxNum) => {
  return text ? text.slice(0, maxNum) : ''
}

const S4 =() => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)

const uuid = () => S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()

export {
  trim,
  cutText,
  uuid
}
