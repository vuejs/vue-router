/* @flow */

import type Router from '../index'
import { assert } from './warn'
import { getStateKey, setStateKey } from './push-state'

const positionStore = Object.create(null)

export function setupScroll (scrollElement?: ?string) {
  // Fix for #1585 for Firefox
  // Fix for #2195 Add optional third attribute to workaround a bug in safari https://bugs.webkit.org/show_bug.cgi?id=182678
  // Fix for #2774 Support for apps loaded from Windows file shares not mapped to network drives: replaced location.origin with
  // window.location.protocol + '//' + window.location.host
  // location.host contains the port and location.hostname doesn't
  const protocolAndPath = window.location.protocol + '//' + window.location.host
  const absolutePath = window.location.href.replace(protocolAndPath, '')
  window.history.replaceState({ key: getStateKey() }, '', absolutePath)
  window.addEventListener('popstate', e => {
    saveScrollPosition(scrollElement)
    if (e.state && e.state.key) {
      setStateKey(e.state.key)
    }
  })
}

export function handleScroll (
  router: Router,
  to: Route,
  from: Route,
  isPop: boolean
) {
  if (!router.app) {
    return
  }

  const behavior = router.options.scrollBehavior
  if (!behavior) {
    return
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof behavior === 'function', `scrollBehavior must be a function`)
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(() => {
    const position = getScrollPosition()
    const shouldScroll = behavior.call(router, to, from, isPop ? position : null)

    if (!shouldScroll) {
      return
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll.then(shouldScroll => {
        if (!shouldScroll) {
          return
        }
        const scrollElementSelector = router.options.scrollElement || shouldScroll.scrollElement || null
        scrollToPosition((shouldScroll: any), position, scrollElementSelector)
      }).catch(err => {
        if (process.env.NODE_ENV !== 'production') {
          assert(false, err.toString())
        }
      })
    } else {
      const scrollElementSelector = router.options.scrollElement || shouldScroll.scrollElement || null
      scrollToPosition(shouldScroll, position, scrollElementSelector)
    }
  })
}

function getScrollElement (scrollElementSelector?: any): Element | WindowProxy {
  let domScrollElement = window
  if (!scrollElementSelector) {
    return window
  }

  assert(typeof scrollElementSelector === 'string' || scrollElementSelector instanceof Element, 'Scroll Element must be a css selector string or a DOM element')
  if (typeof scrollElementSelector === 'string') {
    const customScrollElement = document.querySelector(scrollElementSelector)
    if (customScrollElement) {
      domScrollElement = customScrollElement
    }
  } else if (scrollElementSelector instanceof Element) {
    return scrollElementSelector
  }

  return domScrollElement
}

export function saveScrollPosition (scrollElement?: string | Element | null) {
  const key = getStateKey()
  if (!key) {
    return
  }

  const domScrollElement = getScrollElement(scrollElement)
  let propX = 'pageXOffset'
  let propY = 'pageYOffset'
  if (domScrollElement instanceof Element) {
    propX = 'scrollLeft'
    propY = 'scrollTop'
  }

  positionStore[key] = {
    x: domScrollElement[propX],
    y: domScrollElement[propY]
  }
}

function getScrollPosition (): ?Object {
  const key = getStateKey()
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el: Element, offset: Object): Object {
  const docEl: any = document.documentElement
  const docRect = docEl.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  }
}

function isValidPosition (obj: Object): boolean {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj: Object): Object {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function normalizeOffset (obj: Object): Object {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

function isNumber (v: any): boolean {
  return typeof v === 'number'
}

function scrollToPosition (shouldScroll, position, scrollElementSelector?) {
  const isObject = typeof shouldScroll === 'object'
  if (isObject && typeof shouldScroll.selector === 'string') {
    const el = document.querySelector(shouldScroll.selector)
    if (el) {
      let offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {}
      offset = normalizeOffset(offset)
      position = getElementPosition(el, offset)
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll)
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll)
  }

  if (position) {
    const scrollElement = getScrollElement(scrollElementSelector)
    if (typeof scrollElement.scrollTo === 'function') {
      scrollElement.scrollTo(position.x, position.y)
    } else {
      scrollElement.scrollTop = position.y
      scrollElement.scrollLeft = position.x
    }
  }
}
