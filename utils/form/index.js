import moment from 'moment'
import formTips from 'COMPONENT/Validator/tips'

/**
 * 日期的标准字符串格式
 */
const DATE_FORMAT = 'YYYY-MM-DD'

/**
 * 月份的标准字符串格式
 */
const MONTH_FORMAT = 'YYYY-MM'

/**
 * 时间的标准字符串格式
 */
const TIME_FORMAT = 'HH:mm'

/**
 * moment对象转标准字符串格式的日期
 */
const momentToDate = (m) => {
  return m ? m.format(DATE_FORMAT) : null
}

/**
 * 标准字符串格式的日期转moment对象
 */
const dateToMoment = (date) => {
  if (/^(\d{4})-(\d{2})-(\d{2})$/.test(date)) {
    const m = moment(date, DATE_FORMAT)
    if (m.isValid()) {
      return m
    }
    return null
  }
  return null
}

/**
 * moment对象转标准字符串格式的月份
 */
const momentToMonth = (m) => {
  return m ? m.format(MONTH_FORMAT) : null
}

/**
 * 标准字符串格式的月份转moment对象
 */
const monthToMoment = (val) => {
  if (/^(\d{4})-(\d{2})$/.test(val)) {
    const m = moment(val, MONTH_FORMAT)
    if (m.isValid()) {
      return m
    }
    return null
  }
  return null
}

/**
 * moment对象转标准字符串格式的时间
 */
const momentToTime = (m) => {
  return m ? m.format(TIME_FORMAT) : null
}

/**
 * 标准字符串格式的时间转moment对象
 */
const timeToMoment = (time) => {
  //return time ? moment(time, TIME_FORMAT) : null
  if (/^(\d{2}):(\d{2})$/.test(time)) {
    const m = moment(time, TIME_FORMAT)
    if (m.isValid()) {
      return m
    }
    return null
  }
  return null
}

const getCommonErrorTips = (errors) => {
  const values = Object.values(errors)
  let tips = null
  if (values.some(v => v)) {
    if (values.some(v => v === formTips.required)) {
      tips = '您有信息未填写'
    } else {
      tips = '请正确填写信息'
    }
  }
  return tips
}

const FIELD_FILLER = '-'

const checkFieldEmpty = (content) => {
  return content === null || content === undefined || content === '' ? true : false
}

const getFieldWithFiller = (content) => {
  if (checkFieldEmpty(content)) {
    return FIELD_FILLER
  }
  return content
}

export {
  DATE_FORMAT,
  MONTH_FORMAT,
  TIME_FORMAT,
  momentToDate,
  dateToMoment,
  momentToMonth,
  monthToMoment,
  momentToTime,
  timeToMoment,
  getCommonErrorTips,
  FIELD_FILLER,
  checkFieldEmpty,
  getFieldWithFiller,
}
