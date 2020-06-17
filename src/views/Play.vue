<!--
  - https://liuhongwei3.github.io Inc.
  - Name: Play.vue
  - Date: 2020/1/30 下午12:01
  - Author: Tadm
  - Copyright (c) 2020 All Rights Reserved.
  -->

<template>
  <div id="play" :style="backImage">
	<div class="left">
	  <img :src="imgs" alt="image"/>
	  <div id="name">
        <span>
          {{ name }} ---
          <a title="点击查看歌手详情" @click.prevent="searchPlayer()">{{ player }}</a>
        </span>
	  </div>
	  <!--	  crossOrigin="anonymous"-->
	  <audio id="audio" ref="audio" :src="urls" autoplay muted crossorigin="anonymous"></audio>
	</div>
	<canvas id="canvas"></canvas>
	<div class="rightS">
	  <div class="song_name">{{ name }}</div>
	  <div class="singer">
		歌手:
		<a title="点击查看歌手详情" @click.prevent="searchPlayer()">{{ player }}</a>
	  </div>
	</div>
	<r-lyric class="right" :songId="id" :cTime="cTime"></r-lyric>
	<alert :flag="alertFlag" @closeAlert="hiddenAlert" class="alert-warning">
	  <p>{{errorInfo}}</p>
	</alert>
	<div class="playControl">
	  <div class="control">
		<i
				class="fa fa-random fa-2x"
				aria-hidden="true"
				title="随机播放"
				v-if="random"
				@click="changeList"
		></i>
		<i
				class="fa fa-bars fa-2x"
				aria-hidden="true"
				title="顺序播放"
				v-if="order"
				@click="changeList"
		></i>
		<i class="fa fa-step-backward fa-2x" aria-hidden="true" title="上一曲" @click="prev"></i>
		<i class="fa fa-play fa-2x" aria-hidden="true" @click="play" title="继续播放" v-if="!status"></i>
		<i class="fa fa-pause fa-2x" aria-hidden="true" @click="play" title="暂停播放" v-if="status"></i>
		<i class="fa fa-step-forward fa-2x" aria-hidden="true" title="下一曲" @click="next"></i>
		<i class="fa fa-commenting fa-2x" aria-hidden="true" title="查看热评" @click="enjoyComment"></i>
		<i class="fa fa-download fa-2x" aria-hidden="true" title="下载" @click="downloadMusic"></i>
	  </div>
	  <div class="timeProgress">
		<div class="leftTime">{{ this.cTime | timeFormat }}</div>
		<div class="progress" @click="offsetX">
		  <hr id="ori" ref="ori"/>
		  <hr id="cPro" :style="csty"/>
		</div>
		<div class="rightTime">{{ this.currDuration | timeFormat }}</div>
	  </div>
	</div>
  </div>
</template>

<script>
  import {checkMusic, download, musicCover, musicUrl} from "../network/Top";
  import RLyric from "../components/common/lyric/RLyric";
  import Alert from "../components/common/alert/Alert";

  export default {
    name: "Play",
    components: {Alert, RLyric},
    data() {
      return {
        id: 0,
        name: "",
        player: "",
        imgs: "",
        urls: "",
        playlistIds: [],
        randomListIds: [],
        currentIndex: 0,
        time: 0,
        currDuration: 0,
        order: true,
        random: false,
        single: false,
        playMode: "order",
        cTime: 0,
        percent: 0,
        oWidth: 0,
        status: false,
        errorInfo: "此歌曲暂时无法播放,自动切换到下一首",
        alertFlag: false
      };
    },
    props: {
      cSongId: {
        type: Number,
        default: 0
      },
      cplaylistIds: {
        type: Array,
        default: []
      }
    },
    created() {
      this.id = this.$store.state.songId;
      this.requestCover(this.id);
      musicUrl(this.id).then(res => {
        this.urls = res.data.data[0].url;
      });
    },
    mounted() {
      let audio = this.$refs.audio;
      let ori = this.$refs.ori;
      this.oWidth = ori.clientWidth;
      this.playlistIds = this.$store.state.playlistIds;
      this.currDuration = parseInt(audio.duration) ? parseInt(audio.duration) : 0;
      audio.addEventListener("play", () => {
        this.status = true;
        this.currDuration = parseInt(audio.duration);
        this.onLoadAudio();
      });
      audio.addEventListener("pause", () => {
        this.status = false;
        this.currDuration = parseInt(audio.duration);
      });
      audio.addEventListener("timeupdate", () => {
        this.currDuration = parseInt(audio.duration);
        this.cTime = parseInt(audio.currentTime);
        this.percent = (this.cTime / audio.duration).toFixed(2);
      });
      audio.addEventListener("ended", () => {
        this.status = false;
        this.cTime = 0;
        this.percent = 0;
        this.currDuration = 0;
        this.currentIndex++;
      });
      audio.addEventListener("error", () => {
        this.showAlert();
      });
    },
    computed: {
      backImage() {
        return {
          backgroundImage: "url(" + this.imgs + ")",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed"
        };
      },
      csty() {
        return `width: ${this.percent * this.oWidth}px`;
      },
      updateId() {
        return this.$store.state.songId;
      }
    },
    watch: {
      updateId() {
        this.id = this.cSongId;
      },
      id(newValue) {
        if (newValue) {
          this.id = newValue;
          this.playlistIds = this.order ? this.cplaylistIds : this.randomListIds;
          this.$store.commit("updateSongId", newValue);
          musicUrl(newValue).then(res => {
            this.urls = res.data.data[0].url;
            if (!this.urls) {
              this.showAlert();
            } else {
              this.requestCover(newValue);
              this.play();
            }
          });
        } else {
          console.log("some errors~");
          this.showAlert();
        }
      },
      currentIndex() {
        this.id = this.playlistIds[this.currentIndex];
      },
      order() {
        if (this.order) {
          this.playlistIds = this.cplaylistIds;
        } else {
          this.doRandom();
        }
      },
      random() {
        if (this.random) {
          this.doRandom();
        } else {
          this.playlistIds = this.cplaylistIds;
        }
      }
    },
    filters: {
      timeFormat(timeIn = 0) {
        const time = new Date(timeIn * 1000);
        let minute = time.getMinutes();
        let second = time.getSeconds();
        if (second / 10 < 1) {
          return `${minute} : 0${second}`;
        } else {
          return `${minute} : ${second}`;
        }
      }
    },
    methods: {
      requestCover(newValue) {
        musicCover(newValue).then(res => {
          if (res.data.code === 200) {
            let database = res.data.songs[0];
            this.imgs = database.al.picUrl;
            this.$store.state.imgUrl = this.imgs;
            this.name = database.name;
            this.player = database.ar[0].name;
          }
        });
      },
      doRandom() {
        this.randomListIds = [...this.playlistIds];
        let arr = this.randomListIds;
        let i = arr.length;
        while (i) {
          let j = Math.floor(Math.random() * i--);
          [arr[j], arr[i]] = [arr[i], arr[j]];
        }
        this.playlistIds = this.randomListIds;
      },
      jumpIndex() {
        if (this.id !== this.playlistIds[this.currentIndex]) {
          this.currentIndex = this.playlistIds.findIndex(id => {
            return id === this.id;
          });
        }
      },
      play() {
        this.status = true;
        let audio = this.$refs.audio;
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
        this.$store.commit("updateSingerName", this.player);
      },
      prev() {
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
        this.jumpIndex();
        this.currentIndex++;
        if (this.currentIndex >= this.playlistIds.length) {
          this.currentIndex = 0;
        }
      },
      updateUserId(uid) {
        this.$store.commit("updateUserId", uid);
        if (this.$route.path === "/user") {
          this.$router.push("/home");
          setTimeout(() => {
            this.$router.push("/user").then(err => {
              console.log(err);
            });
          }, 350);
        } else {
          this.$router.push("/user").then(err => {
            console.log(err);
          });
        }
      },
      changeList() {
        this.random = !this.random;
        this.order = !this.order;
      },
      searchPlayer() {
        this.$store.commit("updateSingerName", this.player);
        this.$router.push("/singer");
      },
      offsetX(event) {
        let audio = this.$refs.audio;
        this.percent = (event.offsetX / this.oWidth).toFixed(2);
        this.cTime = parseInt(this.percent * this.currDuration);
        audio.currentTime = this.cTime;
        audio.play();
      },
      enjoyComment() {
        this.$router.push("/comment");
      },
      downloadMusic() {
        //	Phone
        // let name = this.name + '-' + this.player + '.mp3';
        // let dtask = plus.downloader.createDownload(this.urls, {
        //   method: 'post',
        //   filename: `_downloads/${this.name}`,
        //   retry: 3
        // }, function(d, status){
        //   if(status === 200){
        //     alert("下载成功: " + d.filename);
        //     // _this.showPluginAuto();
        //     plus.runtime.openFile(d.filename);
        //   } else {
        //     alert("下载失败: " + status);
        //   }
        // });
        // //dtask.addEventListener("statechanged", onStateChanged, false);
        // dtask.start();

        //	PC
        download(this.urls).then(res => {
          // application/vnd.ms-excel
          let blob = new Blob([res.data], {type: "audio/mpeg;charset=utf-8"}); //指定格式为vnd.ms-excel
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = this.name + "-" + this.player + ".mp3"; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        });
      },
      // test() {
      //   plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function(fs){
      //     // fs.root是根目录操作对象DirectoryEntry
      //     // 创建读取目录信息对象
      //     let directoryReader = fs.root.createReader();
      //     directoryReader.readEntries( function( entries ){
      //       for(let i=0; i < entries.length; i++) {
      //         console.log(entries[i].fullPath)
      //         alert( entries[i].name );
      //       }
      //     }, function ( e ) {
      //       alert( "Read entries failed: " + e.message );
      //     } );
      //   } );
      // }
      showAlert() {
        this.alertFlag = true;
        this.next();
      },
      hiddenAlert() {
        this.alertFlag = false;
      },
      onLoadAudio() {
        let context = new (window.AudioContext || window.webkitAudioContext)();
        let analyser = context.createAnalyser();
        analyser.fftSize = 512;
        let source = context.createMediaElementSource(audio);

        source.connect(analyser);
        analyser.connect(context.destination);

        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);

        let canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let ctx = canvas.getContext("2d");
        let WIDTH = canvas.width;
        let HEIGHT = canvas.height;

        let barWidth = (WIDTH / bufferLength) * 1.5;
        let barHeight;

        function renderFrame() {
          requestAnimationFrame(renderFrame);

          analyser.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, WIDTH, HEIGHT);

          for (let i = 0, x = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            let r = barHeight + 25 * (i / bufferLength);
            // let r = Math.round(Math.random()*255);

            let g = 250 * (i / bufferLength);
            // let g = Math.round(Math.random()*255);

            let b = 50;
            // let b = Math.round(Math.random()*255);

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            x += barWidth + 2;
          }
        }

        renderFrame();
        // setInterval(renderFrame, 44);
      }
    }
  };
</script>

<style scoped>
#canvas {
  position: absolute;
  left: 5%;
  bottom: 80px;
  width: 90%;
  height: 200%;
  opacity: 0.75;
}

img {
  width: 200px;
  height: 200px;
}

#play {
  width: 100%;
  display: flex;
}

.left,
.right,
.rightS {
  background: rgba(0, 0, 0, 0.5);
}

#name {
  color: #9786d9;
  font-size: 22px;
  font-family: "Times New Roman", Times, serif;
  font-weight: 600;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  z-index: 2;
}

.left {
  display: block;
  flex: 1;
  margin: 0 auto;
  overflow: hidden;
}

.left img {
  opacity: 0.7;
  border-radius: 50%;
  animation: imgRotate 6s linear infinite normal;
  position: relative;
  z-index: 2;
}

@keyframes imgRotate {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.right {
  flex: 1;
}

.rightS {
  display: none;
}

a:hover {
  cursor: pointer;
}

i {
  color: #6cc1b9;
  /*color: #4e89becc;*/
  margin: 10px 18px;
}

.fa-2x {
  font-size: 1.5em;
}

.playControl {
  width: 96%;
  height: 60px;
  margin: 0 2vw;
  padding: 10px;
  position: absolute;
  bottom: 10px;
  display: flex;
  justify-content: center;
  background-color: #efeaea85;
  border-radius: 10px;
  transition: all 0.5s;
}

.timeProgress {
  display: flex;
  flex: 1;
  justify-content: space-around;
}

.progress {
  flex: 1;
  height: 0;
  margin: 0 1vw;
}

.leftTime,
.rightTime {
  width: 5vw;
  color: #595959;
  line-height: 39px;
}

hr {
  height: 5px;
  background-color: #e3dddd;
  border: none;
  border-radius: 20px;
}

#ori {
  width: 60vw;
  position: absolute;
  z-index: 1;
}

#cPro {
  position: absolute;
  z-index: 2;
  background-color: #a8a5a5;
}

@media screen and (max-width: 768px) {
  .fa-2x {
    font-size: 1.3em;
    margin: 5px 2.5vh;
  }

  .left {
    display: none;
  }

  .right {
    flex: 0;
  }

  .rightS {
    display: inline;
    width: 100vw;
    height: 24vh;
    color: #f25e0c;
    font-size: 16px;
    font-weight: 500;
    padding: 0 10px;
    margin: 0 auto;
  }

  .playControl {
    height: 11vh;
    margin: 0 2vw;
    float: left;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    bottom: 1vh;
    padding: 5px;
  }

  .control {
    width: 100vw;
  }

  .leftTime,
  .rightTime {
    width: 15vw;
  }

  .name {
    margin-top: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #canvas {
    width: 100%;
    height: 35vh;
    position: fixed;
    left: 0;
    top: 0;
  }
}
</style>
