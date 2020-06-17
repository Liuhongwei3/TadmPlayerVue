/*
 * https://liuhongwei3.github.io Inc.
 * Name: back.js
 * Date: 2020/2/15 上午9:48
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

document.addEventListener('plusready', function () {
  var webview = plus.webview.currentWebview()
  plus.key.addEventListener('backbutton', function () {
    webview.canBack(function (e) {
      if (e.canBack) {
        webview.back()
      } else {
        // webview.close() //hide,quit
        // plus.runtime.quit()
        // 首页返回键处理
        // 处理逻辑：1秒内，连续两次按返回键，则退出应用；
        var first = null
        plus.key.addEventListener('backbutton', function () {
            // 首次按键，提示‘再按一次退出应用’
            if (!first) {
              first = new Date().getTime()
              alert('再按一次退出应用') // 此处可以用自定义提示
              // setTimeout(function () {
              //   first = null
              // }, 1000)
            } else {
              if (new Date().getTime() - first < 1500) {
                first = null
                plus.runtime.quit()
              }
            }
          },
          false
        )
      }
    })
  })
})
