import axios from "axios";
import NProgress from "nprogress";

export function request(config) {
  const baseURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3002/"
      : "http://www.tadm.top:3002/";
  const instance = axios.create({
    baseURL: "http://www.tadm.top:3002/",
    // baseURL,
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
      NProgress.done();
      if (!response) {
        error = { response: { statusText: "网络错误，请检查您的网络连接！" } };
      }
      return Promise.reject(error);
    }
  );

  return instance(config); //  Promise
}
