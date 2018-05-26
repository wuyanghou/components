const colors = require('./colors.js')
const fontFamilyChinese = '"PingFangSC-Regular", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
const fontSize = '14px'
const fontSizeSm = '12px'

module.exports = {
  /**
   * 主色
   */
  primaryColor: colors.purple6,
  primaryColorDisabled: colors.purple4,
  primaryColorBg: colors.purple1,
  primaryColorActive: colors.purple7,

  /**
   * 辅助色（危险红、警告黄、信息蓝、成功绿）
   */
  highlightColor: colors.red6,
  highlightColorDisabled: colors.red4,
  highlightColorBg: colors.red1,
  highlightColorActive: colors.red7,

  warningColor: colors.yellow6,
  warningColorDisabled: colors.yellow4,
  warningColorBg: colors.yellow1,
  warningColorActive: colors.yellow7,

  infoColor: colors.blue6,
  infoColorDisabled: colors.blue4,
  infoColorBg: colors.blue1,
  infoColorActive: colors.blue7,

  successColor: colors.green6,
  successColorDisabled: colors.green4,
  successColorBg: colors.green1,
  successColorActive: colors.green7,

  /**
   * 基础色
   */
  basicColor: colors.gray1,
  basicColorActive: colors.gray2,
  basicColorBorder: colors.gray3,

  /**
   * 字体颜色
   */
  fontColor: colors.gray7,
  fontColorSecondary: colors.gray6,
  fontColorTips: colors.gray5,
  fontColorPrimary: colors.gray9,

  /**
   * 字体大小
   */
  fontSize,
  fontSizeSm,

  fontSizeHeading: '18px',
  fontSizeHeadingSm: '16px',
  fontSizeHeadingLg: '20px',

  /**
   * 字体类型
   */
  fontFamilyChinese,
  fontFamily: '"Helvetica Neue", ' + fontFamilyChinese,

  /**
   * 圆角
   */
  borderRadius: '4px',
  borderRadiusSm: '2px',
  borderRadiusLg: '6px',

  /**
   * 阴影
   */
  shadowDropdown: '0 4px 6px 0 rgba(0,0,0,0.10), 0 0 10px 0 rgba(0,0,0,0.04)',
  shadowPopup: '0 0 9px 0 rgba(0,0,0,0.08)',
  shadowPanel: '0 2px 9px 0 rgba(0,0,0,0.03)',

  /**
   * 输入控件
   */
  inputHeight: '36px',
  inputHeightSm: '28px',
  inputHeightXs: '24px',

  inputFontSize: fontSize,
  inputFontSizeSm: fontSizeSm,
  inputFontSizeXs: fontSizeSm,

  inputBorderColor: colors.gray4,
}
