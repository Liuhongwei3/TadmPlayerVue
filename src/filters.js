import Vue from "vue";

Vue.filter("roundW", function(valueIn = 0) {
  const value = valueIn ? valueIn : 0;
  if (value < 1000) {
    return value;
  } else if (value > 1000 && value < 10000) {
    return Math.round(value / 1000) + " K+";
  } else if (value > 10000 && value < 1000000) {
    return Math.round(value / 10000) + " W+";
  } else if (value > 1000000 && value < 10000000) {
    return Math.round(value / 1000000) + " 百W+";
  } else if (value > 10000000 && value < 100000000) {
    return Math.round(value / 10000000) + " 千W+";
  } else {
    return Math.round(value / 100000000) + " 亿+";
  }
});

Vue.filter("timeFormat", (timeIn = 0) => {
  const time = timeIn ? new Date(timeIn * 1000) : 0;
  if (time) {
    let minute = time.getMinutes();
    let second = time.getSeconds();
    second = second.toString().padStart(2, "0");
    return `${minute} : ${second}`;
  } else {
    return "0 : 00";
  }
});

Vue.filter("dateFormat", (dateIn = 0, type = "less") => {
  const date = dateIn ? new Date(dateIn) : 0;
  if (date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    month = month.toString().padStart(2, "0");
    day = day.toString().padStart(2, "0");
    hour = hour.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    seconds = seconds.toString().padStart(2, "0");

    let curYear = new Date().getFullYear();

    let res = "";
    res =
      curYear === year ? `${month}月${day}日` : `${year}年${month}月${day}日`;
    res += type === "more" ? ` ${hour}:${minutes}:${seconds}` : "";

    return res;
  } else {
    return "Private";
  }
});

Vue.filter("getEventType", (str = "") => {
  // 18 分享单曲
  // 19 分享专辑
  // 17、28 分享电台节目
  // 22 转发
  // 39 发布视频
  // 13 分享歌单
  // 24 分享专栏文章
  // 41、21 分享视频
  // 35 发布动态
  if (str.length === 0) return;
  switch (+str) {
    case 18: {
      str = "分享单曲";
      break;
    }
    case 19: {
      str = "分享专辑";
      break;
    }
    case 17:
    case 28: {
      str = "分享电台节目";
      break;
    }
    case 22: {
      str = "转发";
      break;
    }
    case 39: {
      str = "发布视频";
      break;
    }
    case 35: {
      str = "发布动态";
      break;
    }
    case 13: {
      str = "分享歌单";
      break;
    }
    case 24: {
      str = "分享专栏文章";
      break;
    }
    case 21: {
      str = "分享MV";
      break;
    }
    case 41: {
      str = "分享视频";
      break;
    }
  }
  return str;
});
