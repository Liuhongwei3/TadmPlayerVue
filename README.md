# Tadm-Player-Vue

<div style="display: inline-flex;">
<img alt="" src="https://img.shields.io/badge/Author-Tadm-pink.svg?style=flat-square"/>
<img alt="" src="https://img.shields.io/badge/Program-Vue-orange"/>
</div>

## Preview

建议 PC 端体验：https://tadm.gitee.io/tadmplayer

## Explanation

> A simple player by Tadm with vue-Family-bucket like NetEase's cloud music~

- 前台 --- vue 全家桶
- 后端 --- [NetEaseApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

## Usage

```
git clone https://github.com/Liuhongwei3/TadmPlayerVue.git

npm install

npm run serve

npm run build
```

## Announcement

本项目仅供学习使用，不提供任何资源存储，歌曲等数据来自互联网，请自觉遵守相应规则 ~ 否则后果将由您自己个人承担！！！

## 项目技能树

`Vue` + `Vue-cli` + `Vue-Router` +`Vue-lazyload` + `Vuex` + `ES6` + `Axios` + `Webpack`+ `Fontawesome` + `Better-scroll` + `Element-UI` + `async-await` + `...`

## Features

- Play music
- Visit comments
- Enjoy Top Song list
- Visit your NetEaseCloudMusic Song list & Followers
- Search more music & Users
- Visit Top Singers and listen them
- Enjoy The CloudHotComments
- Maybe more ~

## Shortcut

> preview online webs~

## 项目文件目录树

<details>
  <summary><b>点击查看</b></summary>
<pre><code>
tadm-player-vue
├── babel.config.js
├── dist
│   ├── css
│   │   ├── 1.d68742f7.css
│   │   ├── 2.852b4ae6.css
│   │   └── app.98fc377d.css
│   ├── favicon.ico
│   ├── img
│   │   └── 404.aef8654a.jpg
│   ├── index.html
│   └── js
│       ├── 1.cd1331bc.js
│       ├── 2.80d83ad5.js
│       ├── app.d14f8de4.js
│       └── chunk-vendors.bbf1707d.js
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── README.md
├── src
│   ├── App.vue
│   ├── assets
│   │   ├── 404.jpg
│   │   └── play_icon.png
│   ├── components
│   │   ├── common
│   │   │   ├── backTop
│   │   │   │   └── BackTop.vue
│   │   │   ├── items
│   │   │   │   └── Items.vue
│   │   │   ├── Nav-bar
│   │   │   │   └── NavBar.vue
│   │   │   ├── noResult
│   │   │   │   └── NoResult.vue
│   │   │   └── scroll
│   │   │       ├── HorizontalScroll.vue
│   │   │       └── VerticalScroll.vue
│   │   └── content
│   │       ├── Drawer.vue
│   │       ├── LogContent.vue
│   │       ├── RLyric.vue
│   │       └── UserContent.vue
│   ├── css
│   │   └── App.css
│   ├── features.js
│   ├── filters.js
│   ├── main.js
│   ├── network
│   │   ├── index.js
│   │   └── Request.js
│   ├── router
│   │   └── index.js
│   ├── store
│   │   └── index.js
│   ├── utils.js
│   ├── views
│   │   ├── About.vue
│   │   ├── Comment.vue
│   │   ├── Detail.vue
│   │   ├── HotDetail.vue
│   │   ├── Play.vue
│   │   ├── Search.vue
│   │   ├── Singer.vue
│   │   ├── Top.vue
│   │   └── User.vue
│   └── vue.config.js
└── vue.config.js
</code></pre>
</details>

## 细节处理

### 歌词部分

- 歌词解析

```js
export function parseLyric(lrc) {
  let lyrics = lrc.split("\n");
  let lrcObj = [];
  let lrcMap = new Map();
  let lrcTime = new Map();
  let j = 0;
  for (let i = 0; i < lyrics.length; i++) {
    let lyric = decodeURIComponent(lyrics[i]);
    let timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
    let timeRegExpArr = lyric.match(timeReg);
    if (!timeRegExpArr) continue;
    let clause = lyric.replace(timeReg, "");
    for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
      let t = timeRegExpArr[k];
      let min = Number(String(t.match(/\[\d*/i)).slice(1)),
        sec = Number(String(t.match(/\:\d*/i)).slice(1));
      let time = min * 60 + sec;
      if (clause) {
        lrcTime.set(time, j++);
        lrcMap.set(time, clause);
        lrcObj.push({ time: time, text: clause });
      }
    }
  }

  return [lrcObj, lrcMap, lrcTime];
}
```

- 歌词滚动

```html
<div :style="lyricTop">
  <div class="lyrics" v-for="(item, index) in lyrics" :key="index">
    <div
      class="lyric"
      :class="{ active: lyricIndex === index || lyrics.length === 1 }"
    >
      {{ item.text }}
    </div>
  </div>
</div>
```

```js
computed: {
  lyricTop() {
    const line = document.getElementsByClassName("lyric")[0];
    const lineH = (line && line.getBoundingClientRect().height) || 25;
    return `transform :translate3d(0, ${-lineH *
      (this.lyricIndex - this.top)}px, 0)`;
  },
},
methods: {
  calcTop() {
    const dom = this.$refs.musicLyric;
    const line = document.getElementsByClassName("lyric")[0];
    const { display = "" } = window.getComputedStyle(dom);
    if (display === "none") {
      return;
    }
    const height = dom.offsetHeight;
    const lineH = (line && line.getBoundingClientRect().height) || 25;
    this.top = Math.floor(height / lineH / 2);
  },
}
```

- 当前歌词高亮

```js
audio.addEventListener("timeupdate", () => {
  let curTime = Math.floor(audio.currentTime);

  // 使用 map 代替之前的 for 循环比较，避免不必要的性能消耗
  if (this.lyricsMap.has(curTime)) {
    this.activeLyric = this.lyricsMap.get(curTime);
  }
  if (this.lyricsTime.has(curTime)) {
    this.lyricIndex = this.lyricsTime.get(curTime);
  }
});
```

### 音乐下载部分

```js
downloadMusic() {
  //	Phone
  let name = this.name + '-' + this.player + '.mp3';
  let dtask = plus.downloader.createDownload(this.urls, {
    method: 'post',
    filename: `_downloads/${this.name}`,
    retry: 3
  }, function(d, status){
    if(status === 200){
      alert("下载成功: " + d.filename);
      // _this.showPluginAuto();
      plus.runtime.openFile(d.filename);
    } else {
      alert("下载失败: " + status);
    }
  });
  //dtask.addEventListener("statechanged", onStateChanged, false);
  dtask.start();
  //	PC
  download(this.urls).then((res) => {
    let blob = new Blob([res.data], { type: "audio/mpeg;charset=utf-8" });
    let downloadElement = document.createElement("a");
    let href = window.URL.createObjectURL(blob);
    downloadElement.href = href;
    downloadElement.download = this.name + "-" + this.player + ".mp3";
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    window.URL.revokeObjectURL(href);
  });
},
```

### Better-scroll 部分

- 公共组件（Vertical）

```js
// https://better-scroll.github.io/docs/zh-CN/
import BScroll from "better-scroll";

export default {
  name: "VerticalScroll",
  data() {
    return {
      scroll: null,
    };
  },
  props: {
    probeType: {
      type: Number,
      default: 3,
    },
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    pullUpLoad: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    setTimeout(this.__initScroll, 100);
    window.addEventListener("resize", this.refresh);
  },
  methods: {
    __initScroll() {
      // 1.初始化BScroll对象
      if (!this.$refs.wrapper) return;
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: true,
        mouseWheel: true,
        pullUpLoad: this.pullUpLoad,
      });

      // 2.将监听事件回调
      this.scroll.on("scroll", (position) => {
        this.$emit("scroll", position);
      });

      // 3.监听上拉到底部
      this.scroll.on("pullingUp", () => {
        this.$emit("pullingUp");
      });
    },
    refresh() {
      //  重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
      this.scroll && this.scroll.refresh && this.scroll.refresh();
    },
    finishPullUp() {
      // finishPullUp: 这个类似控制一个开关，比如在触发 pullingUp 事件的时候，插件肯定会把一个开关给关掉，防止用户重复上拉
      // 在数据加载完成以后，需要执行 finishPullUp() 把开关打开，以便下次可以继续执行上拉刷新
      this.scroll && this.scroll.finishPullUp && this.scroll.finishPullUp();
    },
    scrollTo(x, y, time) {
      this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time);
    },
  },
  beforeDestroy() {
    this.scroll.destroy();
  },
};
```

### async-await 统一错误处理

```js
export function to(promise) {
  return promise
    .then((data) => {
      return [null, data];
    })
    .catch((err) => {
      return [err];
    });
}
```

### 懒加载

> 由于本站图片较多，因此使用了**懒加载以及分页**的策略来避免性能消耗过大

### 其他封装

> 详见 `components` 文件夹

## About

> If you like it,Thanks to star and talk more~

## Thanks

> NetEaseCloudMusic & NetEaseMusic & All tools producer ~

Github Repo: https://github.com/Liuhongwei3/TadmPlayerVue

Gitee Repo: https://gitee.com/tadm/TadmPlayer