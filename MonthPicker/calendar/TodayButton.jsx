import React from 'react';
import { getTodayTimeStr, getTodayTime, isAllowedDate } from '../util/';
import Button from '../../Button';

export default function TodayButton({
  prefixCls,
  locale,
  value,
  timePicker,
  disabled,
  disabledDate,
  onToday,
  text,
}) {
  const localeNow = (!text && timePicker ? locale.now : text) || locale.today;
  const disabledToday =
          disabledDate && !isAllowedDate(getTodayTime(value), disabledDate);
  const isDisabled = disabledToday || disabled;
  return (
    <Button
      size="small"
      disabled={isDisabled}
      onClick={isDisabled ? null : onToday}
      title={getTodayTimeStr(value)}
    >
      返回今天
    </Button>
  );
}
