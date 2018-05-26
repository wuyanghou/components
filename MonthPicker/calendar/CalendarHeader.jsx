import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import toFragment from 'rc-util/lib/Children/mapSelf';
import MonthPanel from '../month/MonthPanel';
import YearPanel from '../year/YearPanel';
import DecadePanel from '../decade/DecadePanel';
import DotButton from '../../DotButton';
import moment from 'moment';

function goMonth(direction) {
  const next = this.props.value.clone();
  next.add(direction, 'months');
  this.props.onValueChange(next);
}

function goYear(direction) {
  const next = this.props.value.clone();
  next.add(direction, 'years');
  this.props.onValueChange(next);
}

function showIf(condition, el) {
  return condition ? el : null;
}

const CalendarHeader = createReactClass({
  propTypes: {
    prefixCls: PropTypes.string,
    value: PropTypes.object,
    onValueChange: PropTypes.func,
    showTimePicker: PropTypes.bool,
    onPanelChange: PropTypes.func,
    locale: PropTypes.object,
    enablePrev: PropTypes.any,
    enableNext: PropTypes.any,
    disabledMonth: PropTypes.func,
  },

  getDefaultProps() {
    return {
      enableNext: 1,
      enablePrev: 1,
      onPanelChange() {},
      onValueChange() {},
    };
  },

  getInitialState() {
    this.nextMonth = goMonth.bind(this, 1);
    this.previousMonth = goMonth.bind(this, -1);
    this.nextYear = goYear.bind(this, 1);
    this.previousYear = goYear.bind(this, -1);
    const props = this.props;
    return { 
      yearPanelReferer: null,
      currentYear: props.value ? props.value.year() : moment().year(), 
    };
  },

  onMonthSelect(value) {
    this.props.onPanelChange(value, 'date');
    if (this.props.onMonthSelect) {
      this.props.onMonthSelect(value);
    } else {
      this.props.onValueChange(value);
    }
  },

  onYearSelect(year) {
    const referer = this.state.yearPanelReferer;
    this.setState({ yearPanelReferer: null });
    const value = this.props.value;
    if (value) {
      const newValue = value.clone();
      newValue.year(year);
      newValue.month(value.month());
      this.props.onValueChange(newValue);
    } 
    this.props.onPanelChange(null, referer);
    this.setState({ currentYear: year })
  },

  onDecadeSelect(value) {
    this.props.onPanelChange(value, 'year');
    this.props.onValueChange(value);
  },
/* 
  monthYearElement(showTimePicker) {
    const props = this.props;
    const prefixCls = props.prefixCls;
    const locale = props.locale;
    const value = props.value;
    const localeData = value.localeData();
    const monthBeforeYear = locale.monthBeforeYear;
    const selectClassName = `${prefixCls}-my-select`;
    const year = (<a
      className={`${prefixCls}-year-select`}
      role="button"
      onClick={showTimePicker ? null : () => this.showYearPanel('date')}
      title={locale.yearSelect}
    >
      {value.format(locale.yearFormat).replace('年', '')}
    </a>);
    const month = (<a
      className={`${prefixCls}-month-select`}
      role="button"
      onClick={showTimePicker ? null : this.showMonthPanel}
      title={locale.monthSelect}
    >
      {localeData.monthsShort(value).replace('月', '')}
    </a>);
    return (
      <span className={selectClassName}>
        {month}
        <span className={`${prefixCls}-ym-select-split`}>{`/`}</span>
        {year}
      </span>
    );
  }, */

  showMonthPanel() {
    // null means that users' interaction doesn't change value
    this.props.onPanelChange(null, 'month');
  },

  showYearPanel(referer) {
    this.setState({ yearPanelReferer: referer });
    this.props.onPanelChange(null, 'year');
  },

  showDecadePanel() {
    this.props.onPanelChange(null, 'decade');
  },

  render() {
    const { props } = this;
    const {
      prefixCls,
      locale,
      mode,
      value,
      showTimePicker,
      enableNext,
      enablePrev,
      disabledMonth,
    } = props;
    let panel = null;
    if (mode === 'month') {
      panel = (
        <MonthPanel
          locale={locale}
          defaultValue={value}
          rootPrefixCls={prefixCls}
          onSelect={this.onMonthSelect}
          onChange={this.onMonthSelect}
          onYearPanelShow={() => this.showYearPanel('month')}
          disabledDate={disabledMonth}
          cellRender={props.monthCellRender}
          contentRender={props.monthCellContentRender}
          value={props.value}
          currentYear={this.state.currentYear}
          onCurrentYearchange={year => this.setState({ currentYear: year })}
        />
      );
    }
    if (mode === 'year') {
      panel = (
        <YearPanel
          locale={locale}
          defaultValue={value}
          rootPrefixCls={prefixCls}
          onSelect={this.onYearSelect}
          onDecadePanelShow={this.showDecadePanel}
        />
      );
    }
    if (mode === 'decade') {
      panel = (
        <DecadePanel
          locale={locale}
          defaultValue={value}
          rootPrefixCls={prefixCls}
          onSelect={this.onDecadeSelect}
        />
      );
    }

    return (<div className={`${prefixCls}-header`}>
      <div style={{ position: 'relative' }}>
        {showIf(enablePrev && !showTimePicker,
          <DotButton
            iconType="left"
            onClick={this.previousMonth}
            title={locale.previousMonth}
            className={`${prefixCls}-prev-month-btn`}
          />)
        }
        {/* this.monthYearElement(showTimePicker) */}
        {showIf(enableNext && !showTimePicker,
          <DotButton
            iconType="right"
            onClick={this.nextMonth}
            title={locale.nextMonth}
            className={`${prefixCls}-next-month-btn`}
          />)}
      </div>
      {panel}
    </div>);
  },
});

export default CalendarHeader;
