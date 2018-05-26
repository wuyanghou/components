const checkRequired = value => {
  let e = null
  if (typeof value === 'number') {
    if (!value && value !== 0) {
      e = true
    }
  } else if (value instanceof Object) {
    if (!value || Object.keys(value).length === 0) {
      e = true
    }
  } else if (value instanceof Array) {
    if (!value || value.length === 0) {
      e = true
    }
  } else {
    if (!value) {
      e = true
    }
  }
  return e
}

const isCellPhone = value => {
  if(/^(?:13\d|15[89])-?\d{5}(\d{3}|\*{3})$/.test(value)){
    return true
  }
  return false
}

const isTelPhone = value => {
  if(/^(([0+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(value)){
    return true
  }
  return false
}

const checkPhone = value => {
  value = value + ''
  const tel= /(^010\d{8}$)|(^010-\d{8}$)|(^02[0-9]\d{8}$)|(^02[0-9]-\d{8}$)|(^0[3-9]\d{2}-\d{7,8}$)|((^0[3-9]\d{9,10}$))|(^[2-9]\d{6,7}$)|(^13\d{9}$)|(^14[145678]\d{8}$)|(^15\d{9}$)|(^166\d{8}$)|(^17[01345678]\d{8}$)|(^18\d{9}$)|(^19[89]\d{8}$)/
  return tel.test(value) ? null : true
  //return (isCellPhone(value) || isTelPhone(value)) ? null : true
}

const checkNumber = (value, config = {}) => {
  const { min, max, excludeMin, excludeMax, tips, int } = config
  const hasMin = 'min' in config
  const hasMax = 'max' in config
  const hasExcludeMin = 'excludeMin' in config
  const hasExcludeMax = 'excludeMax' in config
  const isNumber = typeof value === 'number'
  const isInt = isNumber && value % 1 === 0
  const basicCheck = int ? isInt : isNumber
  const typeText = int ? '整数' : '数字'
  let error = null
  if (!hasMin && !hasMax && !hasExcludeMin && !hasExcludeMax) {
    if (!basicCheck) {
      error = `请输入${typeText}`
    }
  } else if (hasMin && !hasMax && !hasExcludeMin && !hasExcludeMax) {
    if (!basicCheck || value < min) {
      error = `请输入大于或等于${min}的${typeText}`
    }
  } else if (!hasMin && hasMax && !hasExcludeMin && !hasExcludeMax) {
    if (!basicCheck || value > max) {
      error = `请输入小于或等于${max}的${typeText}`
    }
  } else if (!hasMin && !hasMax && hasExcludeMin && !hasExcludeMax) {
    if (!basicCheck || value <= excludeMin) {
      error = `请输入大于${excludeMin}的${typeText}`
    }
  } else if (!hasMin && !hasMax && !hasExcludeMin && hasExcludeMax) {
    if (!basicCheck || value >= excludeMax) {
      error = `请输入小于${excludeMax}的${typeText}`
    }
  } else {
    if (hasMin && hasMax) {
      if (!basicCheck || value < min || value > max) {
        error = `请输入${min}-${max}之间的${typeText}`
      }
    } else if (hasExcludeMin && hasMax) {
      if (!basicCheck || value <= excludeMin || value > max) {
        error = `请输入${excludeMin}~${max}之间的${typeText}（不含${excludeMin}）`
      }
    } else if (hasMin && hasExcludeMax) {
      if (!basicCheck || value < min || value >= excludeMax) {
        error = `请输入${min}~${excludeMax}之间的${typeText}（不含${excludeMax}）`
      }
    } else if (hasExcludeMin && hasExcludeMax) {
      if (!basicCheck || value <= excludeMin || value >= excludeMax) {
        error = `请输入${excludeMin}~${excludeMax}之间的${typeText}（不含${excludeMin}和${excludeMax}）`
      }
    }
  }
  if (error && tips) {
    error = tips
  }
  return error
}

export {
  checkRequired,
  checkPhone,
  checkNumber,
}
