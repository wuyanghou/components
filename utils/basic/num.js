/**
 * 格式化金额，格式如￥2,100.00
 * @param  {number} num 金额数值
 * @param  {string?} unit 单位
 * @return {string} 格式化后的金额字符串
 */
const formatCurrency = (num, unit) => {
  if (typeof num !== 'number') {
    return '0'
  }
  num = num.toString().replace(/\$|\,/g, '')
  if (isNaN(num)) {
    num = '0'
  }
  const sign = (num == (num = Math.abs(num)))
  num = Math.floor(num * 100 + 0.50000000001)
  let cents = num % 100
  num = Math.floor(num / 100).toString()
  if (cents < 10)
    cents = '0' + cents
  for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3))
  }
  return (((sign) ? '' : '-') + (unit || '') + num + '.' + cents)
}

/**
 * 校验正整数
 * @param  {number|string}  str 待校验的数字或字符串
 */
const isPInt = (str) => {
    var g = /^[1-9]*[1-9][0-9]*$/
    return g.test(str)
}

export {
  formatCurrency,
  isPInt,
}
