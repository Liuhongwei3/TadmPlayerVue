<template>
  <div>
    <audio
      id="audio"
      ref="audio"
      :src="urls"
      autoplay
      muted
      crossorigin="anonymous"
    />
    <!-- <canvas id="canvas"></canvas> -->
    <Drawer :drawer.sync="drawer" />

    <transition name="up">
      <div class="more" :style="backImage" v-show="showMore">
        <div class="more-play-info">
          <div class="left">
            <img :src="imgs" :onerror="defaultImgs" alt="网易云音乐" />
            <div>
              <div class="songName">
                <span>{{ songName }}</span>
              </div>
              <div class="otherName">
                <span>歌手:</span>
                <span
                  v-for="art in artists"
                  :key="art.id"
                  @click="toSinger(art.id)"
                >
                  {{ art.name }} /
                </span>
              </div>
              <div class="otherName">
                专辑:<span>{{ albumName }} </span>
              </div>
            </div>
          </div>
          <r-lyric class="right" :songId="id" :cTime="cTime" />
        </div>
      </div>
    </transition>

    <div class="simply-play-info">
      <div class="simply">
        <el-tooltip content="点击查看或隐藏详情界面" placement="top">
          <div @click="showMore = !showMore">
            <el-avatar shape="square" :src="imgs" />
          </div>
        </el-tooltip>
        <el-tooltip content="歌曲名" placement="top">
          <el-tag>{{ this.songName }}</el-tag>
        </el-tooltip>

        <span v-for="art in artists" :key="art.id" @click="toSinger(art.id)">
          <el-tooltip content="点击查看歌手详情" placement="top">
            <el-tag type="success">
              {{ art.name }}
            </el-tag>
          </el-tooltip>
        </span>

        <el-tooltip content="去看 MV" placement="top" v-if="this.mv !== 0">
          <el-tag type="warning" v-if="this.mv !== 0" @click="toMv">MV</el-tag>
        </el-tooltip>
      </div>

      <div class="playControl">
        <div class="control">
          <el-tooltip content="随机播放" placement="bottom">
            <i
              class="fa fa-random fa-2x"
              aria-hidden="true"
              v-if="!order"
              @click="changeList"
            ></i>
          </el-tooltip>
          <el-tooltip content="顺序播放" placement="bottom">
            <i
              class="fa fa-bars fa-2x"
              aria-hidden="true"
              v-if="order"
              @click="changeList"
            ></i>
          </el-tooltip>
          <el-tooltip content="播放列表" placement="bottom">
            <i
              class="fa fa-history fa-2x"
              aria-hidden="true"
              @click="toCurDetail"
            ></i>
          </el-tooltip>
          <el-tooltip content="上一曲" placement="top">
            <i
              class="fa fa-step-backward fa-2x"
              aria-hidden="true"
              @click="prev"
            ></i>
          </el-tooltip>
          <el-tooltip content="继续播放" placement="bottom" v-if="!status">
            <i
              class="fa fa-play fa-2x"
              aria-hidden="true"
              v-if="!status"
              @click="play"
            ></i>
          </el-tooltip>
          <el-tooltip content="暂停播放" placement="bottom" v-if="status">
            <i
              class="fa fa-pause fa-2x"
              aria-hidden="true"
              @click="play"
              v-if="status"
            ></i>
          </el-tooltip>
          <el-tooltip content="下一曲" placement="top">
            <i
              class="fa fa-step-forward fa-2x"
              aria-hidden="true"
              @click="next"
            ></i>
          </el-tooltip>
          <el-tooltip content="下载" placement="top">
            <i
              class="fa fa-download fa-2x"
              aria-hidden="true"
              @click="downloadMusic"
            ></i>
          </el-tooltip>
          <el-tooltip id="controlPc" content="站点选项配置" placement="bottom">
            <i
              class="fa fa-cog fa-2x"
              aria-hidden="true"
              @click="drawer = true"
            ></i>
          </el-tooltip>
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
            <div class="rightTime">{{ this.currDuration | timeFormat }}</div>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import req from "@/network/req";
import RLyric from "@/components/content/RLyric";
import Drawer from "@/components/content/Drawer";
import { shuffle, timeFormat } from "../utils";
import { createDownload, onLoadAudio } from "../features";
import { mapMutations, mapState } from "vuex";

export default {
  name: "Play",
  components: { RLyric, Drawer },
  data() {
    return {
      songName: "",
      albumName: "",
      artists: [],
      player: "",
      imgs: "",
      defaultImgs: 'this.src="' + require("@/assets/404.jpg") + '"',
      urls: "",
      mv: 0,
      currentIndex: 0,
      currDuration: 0,
      order: true,
      cTime: 0,
      percent: 0,
      oWidth: 0,
      status: false,
      drawer: false,
      showMore: false,
    };
  },
  computed: {
    ...mapState(["isPc", "source", "curDetailId"]),
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
    this.requestCover(this.id);
    this.requestMusicUrl(this.id);
  },
  mounted() {
    let audio = this.$refs.audio;
    this.currDuration = parseInt(audio.duration) ? parseInt(audio.duration) : 0;

    audio.addEventListener("play", () => {
      this.status = true;
      this.currDuration = parseInt(audio.duration);
      // onLoadAudio();
    });
    audio.addEventListener("pause", () => {
      this.status = false;
    });
    audio.addEventListener("timeupdate", () => {
      this.currDuration = parseInt(audio.duration);
      this.cTime = parseInt(audio.currentTime);
      this.percent = Math.floor((this.cTime / audio.duration) * 100);
    });
    audio.addEventListener("ended", () => {
      this.cTime = 0;
      this.percent = 0;
      this.currDuration = 0;
      this.next();
    });
  },
  watch: {
    $route(newValue) {
      this.showMore = false;
    },
    async id(newValue) {
      if (newValue) {
        if (this.source === "netease") {
          this.requestCover(newValue);
          this.requestMusicUrl(newValue);
        } else if (this.source === "qq") {
          let [
            {
              data: { data },
            },
            {
              data: { data: urlData },
            },
          ] = await Promise.all([
            req.qq.getMusicDetailByQq(newValue),
            req.qq.getMusicUrlByQq(newValue),
          ]);
          this.songName = data.name;
          this.player = data.artists[0].name;
          this.imgs = data.album.cover;
          this.albumName = data.album.name;

          if (urlData.url) {
            this.urls = urlData.url;
            this.play();
          } else {
            this.showAlert();
          }

          this.updateImgs(this.imgs);
        }
      } else {
        this.showAlert();
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
    ]),
    async requestCover(newValue) {
      this.imgs = "";
      this.songName = "";
      this.player = "";
      let data = await req.netease.musicCover(newValue);
      if (data.code === 200) {
        let database = data.songs[0];
        this.songName = database.name;
        this.artists = database.ar;
        this.imgs = database.al.picUrl;
        this.albumName = database.al.name;
        this.mv = database.mv;

        this.updateImgs(this.imgs);
      }
    },
    async requestMusicUrl(id) {
      this.urls = "";
      let url = await req.netease.musicUrl(id);
      if (url && url.length !== 0) {
        this.urls = url;
        this.play();
      } else {
        this.showAlert();
      }
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
    toCurDetail() {
      this.updateDetailId(this.curDetailId);
      if (this.$route.path !== "/detail") {
        this.$router.push("/detail");
      }
    },
    toMv() {
      if (this.$route.path !== "/showMv") {
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

      this.percent = percent;
      this.cTime = parseInt((percent / 100) * this.currDuration);

      audio.currentTime = this.cTime;
      audio.play();
    },
    updateTime(percent) {
      this.percent = percent;
      this.cTime = parseInt((percent / 100) * this.currDuration);
    },
    downloadMusic() {
      req.netease
        .download(this.urls)
        .then((res) => {
          createDownload(this.songName, this.player, res.data);
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
    showAlert() {
      this.$notify({
        title: "错误",
        message: "好像出错误了！尝试自动切换到下一首 ~",
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
  animation: imgRotate 10s linear infinite normal;
  position: relative;
  z-index: 2;
}

.songName {
  color: #f6506e;
  font-size: 24px;
  font-weight: 700;
}

.otherName {
  font-size: 14px;
  margin: 10px;
}

.otherName span {
  margin-left: 10px;
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

.el-tag {
  max-width: 30vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-play-info,
.simply {
  display: flex;
  justify-content: center;
}

.simply {
  padding: 10px;
}

.more-play-info {
  background-color: rgba(0, 0, 0, 0.6);
  height: 70vh;
  padding: 5vh;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
}

.more {
  width: 88%;
  position: fixed;
  bottom: 16%;
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
  top: 84vh;
}

.up-enter-to,
.up-leave {
  top: 5vh;
}

@keyframes imgRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

i {
  color: #fefefe;
  margin: 10px 18px;
}

.fa-2x {
  font-size: 1.5em;
}

.playControl {
  margin: 0 1vw 1vw 1vw;
  display: flex;
  justify-content: center;
  background-color: #efeaea85;
  border-radius: 10px;
  transition: all 0.5s;
  z-index: 9;
}

.timeProgress {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
}

.leftTime,
.rightTime {
  flex: 1;
  color: #ebebeb;
}

.myProgress {
  flex: 6;
  margin: 0 0.5vw;
}

.myProgress:hover {
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  .fa-2x {
    font-size: 1.3em;
    margin: 5px 2.5vh;
  }

  .simply {
    padding: 0;
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

  .playControl {
    flex-wrap: wrap;
  }

  .control {
    width: 100vw;
  }

  #canvas {
    width: 100%;
    height: 20vh;
    left: 0;
    top: 0;
  }
}
</style>
