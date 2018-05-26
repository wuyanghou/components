/**
 * 金额单元格，格式为：1、右对齐 2、格式化，如 2,500.00
 */
import React from 'react'
import { formatCurrency } from '../../utils/basic/num'
import styles from './styles.less'

const MoneyCell = ({ children }) => {
  let num = parseFloat(children)
  if (isNaN(num)) {
    return null
  }

  return (
    <div className={styles.wrap}>
      {formatCurrency(num)}
    </div>
  )
}

export default MoneyCell
