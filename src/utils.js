/*
 * https://liuhongwei3.github.io Inc.
 * Name: utils.js
 * Date: 2020/2/12 下午7:08
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

export function debounce(func, delay) {
  let timer = null
  return function (...args) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, ...args)
    }, delay)
  }
}

export function shuffle(arr) {
  let i = arr.length;
  if (i <= 0) {
    return [];
  }
  while (i) {
    let j = Math.floor(Math.random() * i--);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
