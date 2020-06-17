/*
 * https://liuhongwei3.github.io Inc.
 * Name: utils.js
 * Date: 2020/2/12 下午7:08
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

export default function debounce(func,delay) {
  let timer = null
  return function (...args) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, ...args)
    }, delay)
  }
}
