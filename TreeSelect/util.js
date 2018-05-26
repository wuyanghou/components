import React from 'react'

export function toArray(value) {
  return value ? (value instanceof Array ? value : [value]) : []
}

export function preventDefaultEvent(e) {
  e.preventDefault()
}

export const UNSELECTABLE_STYLE = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
}

export const UNSELECTABLE_ATTRIBUTE = {
  unselectable: 'unselectable',
}

export function defaultFilterFn(input, dictItem) {
  return dictItem.text.indexOf(input) >= 0
}

export function saveRef(instance, name) {
  return (node) => {
    instance[name] = node
  }
}

export const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
}

