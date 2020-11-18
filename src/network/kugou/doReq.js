import { request } from "./index";
import { to, notify } from "@/utils";

const doReq = async (url) => {
  // notify("info", "信息提示", "加载数据中！");
  let [err, data] = await to(request({ url }));
  if (err) {
    notify("error", "加载错误", err.response.statusText);
    return false;
  } else {
    return data;
  }
};

export default doReq;
