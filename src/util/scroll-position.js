/* @flow */

export function saveScrollPosition (key: string) {
  if (!key) return
  window.sessionStorage.setItem(key, JSON.stringify({
    x: window.pageXOffset,
    y: window.pageYOffset
  }))
}

export function getScrollPosition (key: string): ?Object {
  if (!key) return
  return JSON.parse(window.sessionStorage.getItem(key))
}

export function getElementPosition (el: Element): Object {
  const docRect = document.documentElement.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  return {
    x: elRect.left - docRect.left,
    y: elRect.top - docRect.top
  }
}

export function isValidPosition (obj: Object): boolean {
  return isNumber(obj.x) || isNumber(obj.y)
}

export function normalizePosition (obj: Object): Object {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function isNumber (v: any): boolean {
  return typeof v === 'number'
}
