import axios from 'axios'
import NProgress from 'nprogress'

export function request(config) {
    const instance = axios.create({
        // baseURL: 'http://localhost:3002/',
        baseURL: "http://www.tadm.top:3002/",
        timeout: 5000,
    });

    instance.interceptors.request.use(config => {
        NProgress.start();
        return config;
    }, error => {
        const { response } = error;
        if (!response) {
            error = { response: { statusText: "网络错误，请检查您的网络连接！" } };
        }
        return Promise.reject(error);
    });

    instance.interceptors.response.use(response => {
        NProgress.done();
        return response;
    }, error => {
        const { response } = error;
        if (!response) {
            error = { response: { statusText: "网络错误，请检查您的网络连接！" } };
        }
        return Promise.reject(error);
    });

    return instance(config) //  Promise
}