/**
 * 检验一个元素是否含有某一个类
 */
const hasClass = ($ele, className) => {
  const classNames = $ele.getAttribute('class')
  return classNames && classNames.indexOf(className) >= 0
}

/**
 * 元素添加一个类
 */
const addClass = ($ele, className) => {
  if(!$ele || hasClass($ele, className)){
    return
  }
  let classNames = $ele.getAttribute('class')
  classNames = (classNames ? classNames.split(' ') : [])
  if(classNames.indexOf(className) < 0){
    classNames.push(className)
  }
  $ele.setAttribute('class', classNames.join(' '))
}

/**
 * 元素删除一个类
 */
const removeClass = ($ele, className) => {
  if(!$ele){
    return
  }
  let classNames = $ele.getAttribute('class')
  classNames = classNames ? classNames.split(' ') : []
  const idx = classNames.indexOf(className)
  if(idx >=0){
    classNames.splice(idx, 1)
  }
  $ele.setAttribute('class', classNames.join(' '))
}

/**
 * 查找第一个满足条件的父节点
 * @param {documentElement} $ele  DOM元素
 * @param {string} selector  选择器
 * @return {documentElement}
 */
const findFirstParent = ($ele, selector) => {
  if (!$ele) {
    return null
  }
  const all = document.querySelectorAll(selector)
  let find = null
  if (all) {
    let par = $ele.parentNode
    while (par && par !== document) {
      for (let i = 0; i < all.length; i++) {
        if (all[i] === par) {
          find = par
          break
        }
      }
      if (find) {
        break
      }
      par = par.parentNode
    }
  }
  return find
}

export {
  hasClass,
  addClass,
  removeClass,
  findFirstParent,
}
