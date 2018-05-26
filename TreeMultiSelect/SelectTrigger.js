import Trigger from 'rc-trigger'
import React from 'react'
import ReactDOM from 'react-dom'
import { saveRef, BUILT_IN_PLACEMENTS } from './util'
import classnames from 'classnames'
import SearchInput from '../_SearchInput'
import { Tree } from 'antd'

const TreeNode = Tree.TreeNode

const dropdownPrefixCls = 'Dropdown'

export default class SelectTrigger extends React.Component {

  state = {
    dropdownWidth: null,
  }

  componentDidMount() {
    this.setDropdownWidth()
  }

  componentDidUpdate(prevProps) {
    this.setDropdownWidth()
    if (this.inputRef && !prevProps.visible && this.props.visible) {
      setTimeout(() => {
        this.inputRef.getInputInstance().focus()
      }, 100)
    }
  }

  setDropdownWidth = () => {
    const width = ReactDOM.findDOMNode(this).offsetWidth
    if (width !== this.state.dropdownWidth) {
      this.setState({ dropdownWidth: width })
    }
  }

  onSelect = (selectedKeys) => {
    const { dict, onMenuSelect, onMenuDeselect, menuSelectedKeys } = this.props
    if (selectedKeys.length > menuSelectedKeys.length) {
      const val = selectedKeys.find(k => !menuSelectedKeys.some(mk => mk === k))
      const text = dict.find(d => d.val === val).text
      onMenuSelect(val, text)
    } else {
      const val = menuSelectedKeys.find(k => !selectedKeys.some(mk => mk === k))
      const text = dict.find(d => d.val === val).text
      onMenuDeselect(val, text)
    }
  }

  getStructruedTreeData = (allData, data, parentVal) => {
    if (!data || data.length === 0) {
      return []
    }
    let treeData = []
    data.forEach(da => {
      if (da.parentVal === parentVal) {
        const childrenData = allData.filter(d => {
          return d.parentVal === da.val
        })
        treeData.push({ val: da.val, text: da.text, isLeaf: da.isLeaf, children: this.getStructruedTreeData(allData, childrenData, da.val)})
      }
    })
    return treeData
  }

  getTreeNode = data => {
    const { onLoadChildren } = this.props
    const { val, text, children, isLeaf: isLeafProp, disabled } = data
    const isLeaf = onLoadChildren ? isLeafProp : (!children || children.length === 0)
    const title = (
      <span>
        {text}
      </span>
    )
    let nodeProps = {
      key: val,
      title,
      disableCheckbox: disabled,
    }
    if (onLoadChildren) {
      nodeProps = {
        ...nodeProps,
        isLeaf,
        dataRef: data,
      }
    }
    if (isLeaf) {
      return <TreeNode {...nodeProps} />
    } else {
      return (
        <TreeNode {...nodeProps}>
          {children && children.length > 0 && children.map(d => this.getTreeNode(d))}
        </TreeNode>
      )
    }
  }

  getDropdownElement = () => {
    const props = this.props
    const noDataTips = props.treeData.length === 0 ? (props.inputValue ? props.searchNotFoundTips : props.noOptionTips) : null
    return (
      <div style={{ width: '100%' }}>
        {props.showSearch &&
        <div className={`${dropdownPrefixCls}-search-field-wrap`}>
          <SearchInput
            autoComplete="off"
            onChange={props.onInputChange}
            onKeyDown={props.onInputKeyDown}
            value={props.inputValue}
            className={`${dropdownPrefixCls}-search-field`}
            placeholder={props.searchPlaceholder}
            ref={saveRef(this, 'inputRef')}
          />
        </div>
        }
        {noDataTips ?
          <div className={`${props.prefixCls}-dropdown-noDataTips`}>
            {noDataTips}
          </div>
          :
          <div className={`${dropdownPrefixCls}-menu`}>
            <Tree
              checkable
              checkStrictly
              selectedKeys={props.menuSelectedKeys}
              onSelect={this.onSelect}
              expandedKeys={props.expandedKeys}
              onExpand={props.onExpandChange}
              loadData={props.onLoadChildren}
              autoExpandParent={false}
              multiple
              checkedKeys={props.menuSelectedKeys}
              onCheck={detail => this.onSelect(detail.checked)}
            >
              {this.getStructruedTreeData(props.treeData, props.treeData, null).map(d => this.getTreeNode(d))}
            </Tree>
          </div>
        }
      </div>
    )
  }

  render() {
    const props = this.props
    const popupStyle = { minWidth: this.state.dropdownWidth, ...(props.dropdownStyle || {}) }
    const popupCls = {
      [`${props.prefixCls}-dropdown`]: 1,
      [props.dropdownClassName]: !!props.dropdownClassName,
      [`${props.prefixCls}-dropdown-${props.size}`]: !!props.size,
    }

    return (
      <Trigger
        showAction={['click']}
        hideAction={['click']}
        popupPlacement="bottomLeft"
        builtinPlacements={BUILT_IN_PLACEMENTS}
        prefixCls={dropdownPrefixCls}
        popupTransitionName={`${dropdownPrefixCls}-slide-up`}
        onPopupVisibleChange={props.onDropdownVisibleChange}
        popup={this.getDropdownElement()}
        popupVisible={props.visible}
        getPopupContainer={props.getPopupContainer}
        popupStyle={popupStyle}
        popupClassName={classnames(popupCls)}
        ref={saveRef(this, 'triggerRef')}
      >
        {props.children}
      </Trigger>
    )
  }
}
