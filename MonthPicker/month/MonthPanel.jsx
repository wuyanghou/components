import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import MonthTable from './MonthTable';
import DotButton from '../../DotButton';
import moment from 'moment';

function goYear(direction) {
  this.props.onCurrentYearchange(parseInt(this.props.currentYear) + direction);
}

function noop() {

}

const MonthPanel = createReactClass({
  propTypes: {
    onChange: PropTypes.func,
    disabledDate: PropTypes.func,
    onSelect: PropTypes.func,
  },

  getDefaultProps() {
    return {
      onChange: noop,
      onSelect: noop,
    };
  },

  getInitialState() {
    const props = this.props;
    // bind methods
    this.nextYear = goYear.bind(this, 1);
    this.previousYear = goYear.bind(this, -1);
    this.prefixCls = `${props.rootPrefixCls}-month-panel`;
    return {
      value: props.value,
    };
  },

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value,
      });
    }
  },

  setAndChangeValue(value) {
    this.setValue(value);
    this.props.onChange(value);
  },

  setAndSelectValue(value) {
    this.setValue(value);
    this.props.onSelect(value);
  },

  setValue(value) {
    if (!('value' in this.props)) {
      this.setState({
        value,
      });
    }
  },

  render() {
    const props = this.props;
    const { value } = this.state;
    const cellRender = props.cellRender;
    const contentRender = props.contentRender;
    const locale = props.locale;
    const prefixCls = this.prefixCls;
    return (
      <div className={prefixCls} style={props.style}>
        <div>
          <div className={`${prefixCls}-header`}>
            <DotButton
              iconType="left"
              className={`${prefixCls}-prev-year-btn`}
              onClick={this.previousYear}
              title={locale.previousYear}
            />

            <a
              className={`${prefixCls}-year-select`}
              role="button"
              onClick={props.onYearPanelShow}
              title={locale.yearSelect}
            >
              <span className={`${prefixCls}-year-select-content`}>{props.currentYear}</span>
              <span className={`${prefixCls}-year-select-arrow`}>x</span>
            </a>

            <DotButton
              iconType="right"
              className={`${prefixCls}-next-year-btn`}
              onClick={this.nextYear}
              title={locale.nextYear}
            />
          </div>
          <div className={`${prefixCls}-body`}>
            <MonthTable
              disabledDate={props.disabledDate}
              onSelect={this.setAndSelectValue}
              locale={locale}
              value={value}
              cellRender={cellRender}
              contentRender={contentRender}
              prefixCls={prefixCls}
              year={props.currentYear}
            />
          </div>
        </div>
      </div>);
  },
});

export default MonthPanel;
