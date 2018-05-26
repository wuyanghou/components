const vars = require('./variables/index.js')
module.exports = (parameter) => {
  let _var = parameter || vars;
  const antdStyleVariables= {
    'primary-color': _var.primaryColor,
    'info-color': _var.infoColor,
    'success-color': _var.successColor,
    'error-color': _var.highlightColor,
    'highlight-color': _var.highlightColor,
    'warning-color': _var.warningColor,
    'normal-color': _var.fontColorTips,

    'primary-1': _var.primaryColorBg,
    'primary-2': _var.primaryColorBg,
    'primary-5': _var.primaryColor,
    'primary-6': _var.primaryColor,
    'primary-7': _var.primaryColorActive,

    'font-family-no-number': _var.fontFamilyChinese,
    'font-family': _var.fontFamily,
    'heading-color': _var.fontColorPrimary,
    'text-color': _var.fontColor,
    'text-color-secondary': _var.fontColorSecondary,
    'font-size-base': _var.fontSize,
    'font-size-lg': _var.fontSizeHeading,

    'border-radius-base': _var.borderRadius,
    'border-radius-sm': _var.borderRadiusSm,

    'item-active-bg': _var.primaryColorBg,
    'item-hover-bg': _var.basicColorActive,

    'link-hover-color': _var.primaryColor,
    'link-active-color': _var.primaryColor,
    'link-hover-decoration': 'underline',

    'border-color-base': _var.inputBorderColor,
    'border-color-split': _var.basicColorBorder,

    'outline-width': 0,

    'background-color-base': _var.basicColor,
    'background-color-active': _var.basicColorActive,

    'disabled-color': _var.fontColorTips,

    'shadow-1-down': _var.shadowDropdown,
    'shadow-2': _var.shadowPopup,

    'btn-font-weight': 'normal',
    'btn-default-color': _var.primaryColor,
    'btn-disable-bg': '#fff',
//    'btn-padding-base': '0 15px',
    'btn-font-size-lg': _var.fontSize,
    'btn-padding-lg': '0 21px',
//    'btn-padding-sm': '0 7px',
//    'btn-height-base': _var.yyy,
    'btn-height-lg': _var.inputHeight,
    'btn-height-sm': _var.inputHeightXs,

    'input-height-lg': _var.inputHeight,
    'input-height-sm': _var.inputHeightXs,
    'input-padding-horizontal': '10px',
//    'input-padding-vertical-base': '4px',
//    'input-padding-vertical-sm': '1px',
//    'input-padding-vertical-lg': '6px',
    'input-placeholder-color': _var.fontColorTips,
    'input-addon-bg': '#fff',

    'tooltip-bg': _var.fontColorPrimary,

    'table-row-hover-bg': _var.basicColorActive,
//    'table-selected-row-bg': '#fff',
    'table-padding-vertical': '15px',
    'table-padding-horizontal': '12px',
    'tag-default-bg': _var.basicColorActive,
    'tag-font-size': _var.fontSizeSm,

    'time-picker-panel-column-width': '61px',
    'time-picker-selected-bg': _var.primaryColorBg,

    'badge-height':'17px',
    'badge-font-size': _var.fontSizeSm,

    'tabs-card-head-background': _var.basicColor,
    'tabs-title-font-size': _var.fontSize,

    'avatar-size-lg': '98px',
    'avatar-font-size-lg': '28px',
    'avatar-bg': _var.basicColor,
    'avatar-color': _var.fontColorSecondary,

    'layout-header-background': '#2C3441',
    'menu-dark-submenu-bg': '#2C3441',
  }
  return Object.assign({}, antdStyleVariables, _var);
}
