import Vue from "vue";

Vue.filter("roundW", function (value) {
  if (value < 10000) {
    return value
  } else if (value > 1000 && value < 10000) {
    return Math.round(value / 1000) + ' K+'
  } else if (value > 10000 && value < 1000000) {
    return Math.round(value / 10000) + ' W+'
  } else {
    return Math.round(value / 1000000) + ' MW+'
  }
});
Vue.filter("timeFormat", (timeIn = 0) => {
  const time = timeIn ? new Date(timeIn * 1000) : 0;
  if (time) {
    let minute = time.getMinutes();
    let second = time.getSeconds();
    if (second / 10 < 1) {
      return `${minute} : 0${second}`;
    } else {
      return `${minute} : ${second}`;
    }
  } else {
    return "0 : 00";
  }
})