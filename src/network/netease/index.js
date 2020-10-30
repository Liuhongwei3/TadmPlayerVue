/*
 * https://liuhongwei3.github.io Inc.
 * Name: index.js
 * Date: 2020/1/30 上午9:46
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import axios from "axios";
import NProgress from "nprogress";

export function request(config) {
  const baseURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/"
      : "https://api.mtnhao.com/";
  const instance = axios.create({
    baseURL,
    timeout: 5000,
  });

  instance.interceptors.request.use(
    (config) => {
      NProgress.start();
      return config;
    },
    (error) => {
      const { response } = error;
      if (!response) {
        error = { response: { statusText: "网络错误，请检查您的网络连接！" } };
      }
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      NProgress.done();
      return response;
    },
    (error) => {
      const { response } = error;
      if (!response) {
        error = { response: { statusText: "网络错误，请检查您的网络连接！" } };
      }
      return Promise.reject(error);
    }
  );

  return instance(config); //  Promise
}
