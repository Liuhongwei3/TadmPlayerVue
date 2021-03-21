<template>
  <div>
    <audio id="audio" ref="audio" :src="urls" muted crossorigin="anonymous" />
    <!-- <canvas id="canvas"></canvas> -->

    <Drawer :drawer.sync="drawer" />

    <transition-group name="fade-trans" tag="p">
      <div
        class="active-lyric"
        :key="activeLyric"
        v-show="useActiveLyric && !showMore"
      >
        {{ activeLyric }}
      </div>
    </transition-group>

    <transition name="up">
      <div class="more" :style="backImage" v-show="showMore">
        <div class="more-play-info">
          <div class="left">
            <img
              v-lazy="imgs"
              v-viewer
              :onerror="defaultImgs"
              alt="网易云音乐"
            />
            <div>
              <div class="songName">
                <span>{{ songName }}</span>
              </div>
              <div class="otherName">
                <span>歌手：</span>
                <span
                  class="content-username"
                  v-for="art in artists"
                  :key="art.id"
                  @click="toSinger(art.id)"
                >
                  {{ art.name }} /
                </span>
              </div>
              <div class="otherName">
                专辑：<span class="content-username" @click="toAlbum(album.id)"
                  >{{ album.name }}
                </span>
              </div>
            </div>
          </div>

          <r-lyric class="right" :songId="id" :cTime="cTime" />
        </div>
      </div>
    </transition>

    <div class="simply-play-info">
      <div class="simply" v-if="isPc">
        <div class="control-start">
          <div>
            <el-tooltip content="点击查看或隐藏详情界面" placement="top">
              <img
                class="cover"
                width="60"
                height="60"
                v-lazy="imgs"
                @click="showMore = !showMore"
              />
            </el-tooltip>
          </div>

          <div>
            <div class="song-name">{{ this.songName }}</div>

            <div class="song-info">
              <span
                class="song-info-name"
                v-for="art in artists"
                :key="art.id"
                @click="toSinger(art.id)"
              >
                {{ art.name }} /
              </span>
            </div>
          </div>
        </div>

        <div class="control-center">
          <div class="control">
            <el-tooltip content="去看 MV" placement="top" v-if="this.mv !== 0">
              <el-tag
                style="margin: 0"
                type="warning"
                size="small"
                v-show="this.mv !== 0"
                @click="toMv"
                >MV</el-tag
              >
            </el-tooltip>
            <el-tooltip content="随机播放" placement="top" v-if="!order">
              <i
                class="fa fa-random fa-2x"
                aria-hidden="true"
                v-if="!order"
                @click="changeList"
              ></i>
            </el-tooltip>
            <el-tooltip content="顺序播放" placement="top" v-if="order">
              <i
                class="fa fa-bars fa-2x"
                aria-hidden="true"
                v-if="order"
                @click="changeList"
              ></i>
            </el-tooltip>
            <i
              class="fa fa-step-backward fa-2x"
              aria-hidden="true"
              @click="prev"
            ></i>
            <i
              class="fa fa-play fa-2x"
              aria-hidden="true"
              v-if="!status"
              @click="play"
            ></i>
            <i
              class="fa fa-pause fa-2x"
              aria-hidden="true"
              @click="play"
              v-if="status"
            ></i>
            <i
              class="fa fa-step-forward fa-2x"
              aria-hidden="true"
              @click="next"
            ></i>
            <el-tooltip content="下载" placement="top">
              <i
                class="fa fa-download fa-2x"
                aria-hidden="true"
                @click="downloadMusic"
              ></i>
            </el-tooltip>
          </div>
          <div class="timeProgress">
            <el-tooltip content="当前播放时间" placement="bottom">
              <div class="leftTime">{{ this.cTime | timeFormat }}</div>
            </el-tooltip>
            <!-- @input="updateTime" -->
            <el-slider
              class="myProgress"
              v-model="percent"
              :format-tooltip="formatTime"
              @change="offsetX"
            ></el-slider>
            <el-tooltip content="歌曲时长" placement="top">
              <div class="rightTime">{{ this.currDuration | timeFormat }}</div>
            </el-tooltip>
          </div>
        </div>

        <div class="control-end">
          <div class="volume">
            <i class="fa fa-2x fa-volume-up" aria-hidden="true"></i>
            <el-slider
              class="control-end-volume"
              v-model="volume"
              :min="0"
              :max="1"
              :step="0.1"
              @change="changeVolume"
              @input="changeVolume"
            ></el-slider>
          </div>

          <el-tooltip id="controlPc" content="站点选项配置" placement="bottom">
            <i
              class="fa fa-cog fa-2x"
              aria-hidden="true"
              @click="drawer = true"
            ></i>
          </el-tooltip>
        </div>
      </div>

      <div v-else>
        <div class="control-start">
          <div>
            <el-tooltip content="点击查看或隐藏详情界面" placement="top">
              <img
                class="cover"
                width="40"
                height="40"
                v-lazy="imgs"
                @click="showMore = !showMore"
              />
            </el-tooltip>
          </div>

          <div>
            <div class="song-name">{{ this.songName }}</div>

            <div class="song-info">
              <span
                class="song-info-name"
                v-for="art in artists"
                :key="art.id"
                @click="toSinger(art.id)"
              >
                {{ art.name }} /
              </span>
            </div>
          </div>
        </div>

        <div class="control-center">
          <div class="control">
            <el-tooltip content="去看 MV" placement="top" v-if="this.mv !== 0">
              <el-tag
                style="margin: 0"
                type="warning"
                size="small"
                v-if="this.mv !== 0"
                @click="toMv"
                >MV</el-tag
              >
            </el-tooltip>
            <el-tooltip content="随机播放" placement="top">
              <i
                class="fa fa-random fa-2x"
                aria-hidden="true"
                v-if="!order"
                @click="changeList"
              ></i>
            </el-tooltip>
            <el-tooltip content="顺序播放" placement="top">
              <i
                class="fa fa-bars fa-2x"
                aria-hidden="true"
                v-if="order"
                @click="changeList"
              ></i>
            </el-tooltip>
            <i
              class="fa fa-step-backward fa-2x"
              aria-hidden="true"
              @click="prev"
            ></i>
            <i
              class="fa fa-play fa-2x"
              aria-hidden="true"
              v-if="!status"
              @click="play"
            ></i>
            <i
              class="fa fa-pause fa-2x"
              aria-hidden="true"
              @click="play"
              v-if="status"
            ></i>
            <i
              class="fa fa-step-forward fa-2x"
              aria-hidden="true"
              @click="next"
            ></i>
            <el-tooltip content="下载" placement="top">
              <i
                class="fa fa-download fa-2x"
                aria-hidden="true"
                @click="downloadMusic"
              ></i>
            </el-tooltip>
            <el-tooltip
              id="controlPc"
              content="站点选项配置"
              placement="bottom"
            >
              <i
                class="fa fa-cog fa-2x"
                aria-hidden="true"
                @click="drawer = true"
              ></i>
            </el-tooltip>
          </div>
        </div>

        <div class="timeProgress">
          <el-tooltip content="当前播放时间" placement="bottom">
            <div class="leftTime">{{ this.cTime | timeFormat }}</div>
          </el-tooltip>
          <el-slider
            class="myProgress"
            v-model="percent"
            :format-tooltip="formatTime"
            @change="offsetX"
            @input="updateTime"
          ></el-slider>
          <el-tooltip content="歌曲时长" placement="top">
            <div class="rightTime">
              {{ this.currDuration | timeFormat }}
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

import RLyric from "@/components/content/RLyric";
import Drawer from "@/components/content/Drawer";

import req from "@/network/req";
import { shuffle, timeFormat } from "../utils";
import { createDownload, onLoadAudio } from "../features";

export default {
  name: "Play",
  components: { RLyric, Drawer },
  data() {
    return {
      songName: "",
      album: {},
      artists: [],
      imgs: "",
      defaultImgs: 'this.src="' + require("@/assets/404.jpg") + '"',
      urls: "",
      mv: 0,
      publishTime: 0,
      currentIndex: 0,
      currDuration: 0,
      order: true,
      cTime: 0,
      percent: 0,
      oWidth: 0,
      status: false,
      drawer: false,
      showMore: false,
      historyList: [],
      volume: 0.85,
    };
  },
  computed: {
    ...mapState([
      "isPc",
      "source",
      "songInfo",
      "activeLyric",
      "useActiveLyric",
    ]),
    backImage() {
      return {
        backgroundImage: "url(" + this.imgs + ")",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      };
    },
    id: {
      get() {
        return this.$store.state.songId;
      },
      set(val) {
        this.updateSongId(val);
      },
    },
    playlistIds() {
      let lists = [...this.$store.state.playlistIds];
      return this.order ? lists : shuffle([...lists]);
    },
  },
  created() {
    this.requestMusicUrl(this.id);
  },
  mounted() {
    let audio = this.$refs.audio;
    this.currDuration = parseInt(audio.duration) ? parseInt(audio.duration) : 0;

    audio.addEventListener("play", () => {
      this.status = true;
      // onLoadAudio();
    });
    audio.addEventListener("pause", () => {
      this.status = false;
    });
    audio.addEventListener("timeupdate", () => {
      this.cTime = parseInt(audio.currentTime);
      this.currDuration = audio.duration;
      this.percent = Math.floor((this.cTime / audio.duration) * 100);
    });
    audio.addEventListener("ended", () => {
      this.cTime = 0;
      this.percent = 0;
      this.currDuration = 0;
      this.next();
    });

    // 监听键盘
    document.onkeyup = ({ keyCode, ctrlKey }) => {
      if (!ctrlKey) return;
      switch (keyCode) {
        //  space
        case 32: {
          this.play();
          break;
        }
        // left
        case 37: {
          this.prev();
          break;
        }
        // top
        // case 38: {
        //   this.volume += 0.1;
        //   break;
        // }
        // right
        case 39: {
          this.next();
          break;
        }
        // down
        // case 40: {
        //   this.volume -= 0.1;
        //   break;
        // }
      }
    };
  },
  watch: {
    $route(newValue) {
      this.showMore = false;
    },
    async id(newValue) {
      if (!newValue) return;
      if (this.source === "netease") {
        this.requestMusicUrl(newValue);
      } else if (this.source === "qq") {
        let [{ data }, url] = await Promise.all([
          req.qq.getMusicDetailByQq(newValue),
          req.qq.getMusicUrlByQq(newValue),
        ]);

        this.songName = data.name;
        this.artists = data.artists;
        this.imgs = data.album.cover;
        this.album = data.album;

        if (url) {
          this.urls = url;
          this.play();
        } else {
          this.showAlert();
        }

        this.updateImgs(this.imgs);
      }
    },
    currentIndex() {
      this.id = this.playlistIds[this.currentIndex];
    },
  },
  methods: {
    ...mapMutations([
      "updateSongId",
      "updateImgs",
      "updateSingerId",
      "updateDetailId",
      "updateHistoryLists",
      "updateAlbumId",
      "updatePlaylistIds",
      "updateSongInfo",
    ]),
    async requestCover(newValue) {
      this.imgs = "";
      this.songName = "";
      this.artists = [];
      this.album = {};
      this.percent = 0;
      this.currDuration = 0;
      this.mv = 0;
      this.publishTime = 0;

      let data = await req.netease.musicCover(newValue);

      if (data.length >= 1) {
        data = data[0];

        this.songName = data.name;
        this.artists = data.artists;
        this.imgs = data.album.picUrl;
        this.album = data.album;
        this.mv = data.mv;
        this.currDuration = data.dt;
        this.publishTime = data.publishTime;

        this.updateImgs(this.imgs);
        this.updateSongInfo(data);
      }
    },
    async requestMusicUrl(id) {
      let { success, message } = await req.netease.checkMusic(id);

      if (!success) {
        this.showAlert(message);
        this.deleteId(id);
      } else {
        this.urls = "";

        let url = await req.netease.musicUrl(id);

        if (url && url.length !== 0) {
          await this.requestCover(id);
          this.urls = url;
          this.play();

          this.updateHistoryLists([
            {
              id: this.id,
              name: this.songName,
              artists: this.artists,
              album: this.album,
              dt: this.currDuration,
              publishTime: this.publishTime,
            },
          ]);
        } else {
          this.showAlert();
          this.deleteId(id);
        }
      }
    },
    deleteId(id) {
      // let index = this.playlistIds.findIndex((id) => {
      //   return id === this.id;
      // });
      // console.log(index);
      // this.playlistIds.splice(index, 1);
      // this.updatePlaylistIds(this.playlistIds);
    },
    jumpIndex() {
      if (this.id !== this.playlistIds[this.currentIndex]) {
        this.currentIndex = this.playlistIds.findIndex((id) => {
          return id === this.id;
        });
      }
    },
    play() {
      this.status = true;
      let audio = this.$refs.audio;
      if (audio.paused) {
        this.$nextTick(() => audio.play());
      } else {
        audio.pause();
      }
    },
    prev() {
      this.status = false;
      if (this.playlistIds.length === 1) {
        this.currentIndex = 0;
        return;
      }
      this.jumpIndex();
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.playlistIds.length - 1;
      }
    },
    next() {
      if (this.playlistIds.length === 1) {
        this.currentIndex = 0;
        this.play();
        return;
      }
      this.jumpIndex();
      this.currentIndex++;
      if (this.currentIndex >= this.playlistIds.length) {
        this.currentIndex = 0;
      }
    },
    changeList() {
      this.order = !this.order;
    },
    toSinger(sid) {
      this.updateSingerId(sid);
      if (this.$route.path !== "/singer") {
        this.$router.push("/singer");
      }
    },
    toAlbum(id) {
      this.updateAlbumId(id);
      if (this.$route.path !== "/album" && this.source === "netease") {
        this.$router.push("/album");
      }
    },
    toMv() {
      if (this.$route.path !== "/showMv" && this.source === "netease") {
        this.$router.push({
          path: "/showMv",
          query: { mvId: this.mv, name: this.songName, artists: this.artists },
        });
      }
    },
    formatTime() {
      return timeFormat(this.cTime);
    },
    offsetX(percent) {
      const audio = this.$refs.audio;

      this.updateTime(percent);

      audio.currentTime = this.cTime;
      audio.play();
    },
    updateTime(percent) {
      this.percent = percent;
      this.cTime = parseInt((percent / 100) * this.currDuration);
    },
    changeVolume(val) {
      this.$refs.audio && (this.$refs.audio.volume = val);
    },
    downloadMusic() {
      req.netease
        .download(this.urls)
        .then((res) => {
          createDownload(this.songName, this.artists[0].name, res.data);
          this.$notify({
            title: "成功",
            message: "歌曲下载完成！",
            type: "success",
          });
        })
        .catch((err) => {
          this.$notify({
            title: "错误",
            message: "好像出错误了！请稍候重试 ~",
            type: "error",
          });
        });
    },
    showAlert(message = "好像出错误了！尝试自动切换到下一首 ~") {
      this.$notify({
        title: "错误",
        message,
        type: "error",
      });
      this.next();
    },
  },
};
</script>

<style scoped>
#canvas {
  position: absolute;
  width: 90%;
  height: 32vh;
  left: 5%;
  opacity: 0.75;
  z-index: 1;
}

.active-lyric {
  max-width: 25vw;
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 666;
  color: aquamarine;
}

.left,
.right {
  width: 50%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.left img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 30px solid rgb(56, 53, 53);
  animation: imgRotate 20s linear infinite normal;
  position: relative;
  z-index: 2;
}

.songName {
  color: #f6506e;
  font-size: 24px;
  font-weight: 700;
}

.otherName {
  margin: 10px;
}

.song-info {
  max-width: 20vw;
  margin: 0;
}

.cover {
  border-radius: 5px;
}

.song-name {
  font-size: 18px;
  max-width: 20vw;
}

.active-lyric,
.song-name,
.song-info,
.song-info-name {
  text-align: left;
  margin: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-info-name {
  color: #5aacc8;
}

.song-info-name:hover {
  color: rgb(16, 228, 104);
  border-bottom: 1px solid rgb(16, 228, 104);
  cursor: pointer;
  transition: all 0.5s;
}

.control-start {
  width: 25vw;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
}

.control-center {
  width: 40vw;
  margin: 0 2vw;
}

.control-end {
  width: 20vw;
  display: flex;
  justify-content: flex-end;
}

.volume {
  display: flex;
}

.control-end-volume {
  width: 80px;
}

.simply-play-info {
  width: 100%;
  background-color: rgb(105 105 105);
  position: fixed;
  bottom: 0;
  z-index: 99;
  border-radius: 15px 15px 0 0;
  margin-left: -10vw;
}

.more-play-info,
.simply {
  display: flex;
  flex-wrap: wrap;
}

.simply {
  padding: 6px 3vw;
}

.more-play-info {
  background-color: rgba(0, 0, 0, 0.6);
  height: 70vh;
  padding: 2vw;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
}

.more {
  width: 88%;
  position: fixed;
  bottom: 10%;
  z-index: 9;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
}

.up-enter-active,
.up-leave-active {
  transition: top 0.5s ease-in-out;
}

.up-enter,
.up-leave-to {
  top: 85vh;
}

.up-enter-to,
.up-leave {
  top: 14vh;
}

@keyframes imgRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.fa-2x {
  color: #fefefe;
  margin: 6px 24px;
  font-size: 1.3em;
}

.fa-2x:hover {
  cursor: pointer;
}

.timeProgress {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.leftTime,
.rightTime {
  flex: 1;
  color: #ebebeb;
}

.myProgress {
  flex: 5;
}
@media screen and (max-width: 768px) {
  .fa-2x {
    margin: 5px 2.5vh;
  }

  .simply {
    padding: 0;
  }

  .control-start,
  .control-center {
    justify-content: center;
    width: 100vw;
    margin: 0;
  }

  .song-name,
  .song-info {
    max-width: 85vw;
  }

  .active-lyric {
    max-width: 90vw;
    bottom: 18vh;
  }

  .more {
    width: 80%;
    bottom: 18vh;
  }

  .simply-play-info {
    margin-left: -20vw;
  }

  .more-play-info {
    flex-direction: column;
  }

  .up-enter-to,
  .up-leave {
    top: 15vh;
  }

  .left,
  .right {
    width: 100%;
  }

  .left img {
    width: 70px;
    height: 70px;
    border: 10px solid rgb(56, 53, 53);
  }

  .songName {
    font-size: 20px;
  }

  #canvas {
    width: 100%;
    height: 20vh;
    left: 0;
    top: 0;
  }
}
</style>
