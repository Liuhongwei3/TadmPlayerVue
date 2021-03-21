import { request } from "./index";
import { to, notify } from "@/utils";

const doReq = async (url, method = "GET", headers = {}) => {
  // notify("info", "信息提示", "加载数据中！");

  // url =
  //   method.toLowerCase() === "get"
  //     ? `https://bird.ioliu.cn/v2?url=${url}`
  //     : url;
  headers = Object.assign(headers, {
    Accept: "application/json, text/plain, */*",
  });

  let [err, data] = await to(request({ url, method, headers }));

  if (err) {
    notify("error", "加载错误", err.response.statusText);
    return false;
  } else {
    return data;
  }
};

export default doReq;
