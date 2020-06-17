/*
 * https://liuhongwei3.github.io Inc.
 * Name: index.js
 * Date: 2020/1/30 上午9:46
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import axios from 'axios'
import NProgress from 'nprogress'

export function request(config) {
    const instance = axios.create({
        baseURL: 'http://localhost:3000/',
        // baseURL: 'http://api.mtnhao.com/',
        timeout: 5000
    });

    instance.interceptors.request.use(config => {
        NProgress.start();
        return config
    },error => {
        console.log(error)
    });

    instance.interceptors.response.use(response => {
        NProgress.done();
        return response
    },error => {
        console.log(error)
    });

    return instance(config) //  Promise
}
