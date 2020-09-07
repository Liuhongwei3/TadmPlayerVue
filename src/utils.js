/*
 * https://liuhongwei3.github.io Inc.
 * Name: utils.js
 * Date: 2020/2/12 下午7:08
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

export function debounce(func, delay = 500, immediate = false) {
    let timer;
    return function(...args) {
        let context = this
        timer && clearTimeout(timer)
        if (immediate) {
            let callNow = !timer
            timer = setTimeout(() => timer = null, delay)
            if (callNow) {
                func.apply(context, args)
            }
        } else {
            timer = setTimeout(() => func.apply(context, ...args), delay)
        }
    }
}

export function throttle(func, delay = 500, immediate = false) {
    let prev = Date.now();
    return function(...args) {
        let now = Date.now(),
            context = this;
        if (now - prev >= delay) {
            func.apply(context, args);
            prev = Date.now();
        }
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