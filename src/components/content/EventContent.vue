<template>
  <div>
    <div v-if="content.msg.length !== 0" class="content-msg">
      {{ content.msg }}
    </div>

    <!-- 歌曲  -->
    <div
      class="event-song-playlist"
      v-if="content.song"
      @click="updateSongId(content.song.id)"
    >
      <el-avatar
        class="song-item"
        shape="square"
        size="medium"
        :src="content.song.img80x80"
      ></el-avatar>
      <div class="event-song-item">
        <div>{{ content.song.name }}</div>
        <span
          class="art-name"
          v-for="arts in content.song.artists"
          :key="arts.id"
        >
          <span>{{ arts.name }}</span>
          <span v-if="content.song.artists.length > 1">
            &nbsp;&nbsp;/&nbsp;&nbsp;
          </span>
        </span>
      </div>
    </div>

    <!-- 歌单 -->
    <div
      class="event-song-playlist"
      v-if="content.playlist"
      @click="updateDetail(content.playlist.id)"
    >
      <el-avatar
        shape="square"
        size="medium"
        :src="content.playlist.coverImgUrl"
      ></el-avatar>
      <div class="event-song-item">
        <div>{{ content.playlist.name }}</div>
        <div class="art-name">by {{ content.playlist.creator.nickname }}</div>
      </div>
    </div>

    <!-- 专辑 -->
    <div
      class="event-song-playlist"
      v-if="content.album"
      @click="toAlbum(content.album.id)"
    >
      <el-avatar
        shape="square"
        size="medium"
        :src="content.album.img80x80"
      ></el-avatar>
      <div class="event-song-item">
        <div>{{ content.album.name }}</div>
        <span
          class="art-name"
          v-for="arts in content.album.artists"
          :key="arts.id"
        >
          <span>{{ arts.name }}</span>
          <span v-if="content.album.artists.length > 1">
            &nbsp;&nbsp;/&nbsp;&nbsp;
          </span>
        </span>
      </div>
    </div>

    <!-- 电台 -->
    <div class="event-song-playlist" v-if="content.djRadio">
      <el-avatar
        shape="square"
        size="medium"
        :src="content.djRadio.img80x80"
      ></el-avatar>
      <div class="event-song-item">
        <div>
          <el-tag
            style="background-color: transparent"
            type="danger"
            effect="plain"
            >{{ content.djRadio.category }}</el-tag
          >
          <span>{{ content.djRadio.name }}</span>
        </div>
        <div class="art-name">by {{ content.djRadio.dj.nickname }}</div>
      </div>
    </div>

    <!-- MV -->
    <div
      class="event-song-playlist"
      v-if="content.mv"
      @click="toMv(content.mv.id, content.mv.name, content.mv.artists)"
    >
      <el-avatar
        shape="square"
        size="large"
        :src="content.mv.imgurl"
      ></el-avatar>
      <div class="event-song-item">
        <div>{{ content.mv.name }}</div>
        <span
          class="art-name"
          v-for="arts in content.mv.artists"
          :key="arts.id"
        >
          <span>{{ arts.name }}</span>
          <span v-if="content.mv.artists.length > 1">
            &nbsp;&nbsp;/&nbsp;&nbsp;
          </span>
        </span>
      </div>
    </div>

    <!-- 视频 -->
    <div
      class="event-song-playlist"
      v-if="content.video"
      @click="toVideo(content.video.videoId)"
    >
      <el-avatar
        shape="square"
        size="large"
        :src="content.video.coverUrl"
      ></el-avatar>
      <div class="event-song-item">
        <div>{{ content.video.title }}</div>
        <div class="art-name">by {{ content.video.creator.nickname }}</div>
      </div>
    </div>

    <!-- 转发 -->
    <div class="event-song-playlist event-forward" v-if="content.forward">
      <span class="content-username">@{{ content.forward.user.nickname }}</span>
      <span class="event-type">{{ content.forward.type | getEventType }}</span>
      <!-- 递归组件 -->
      <event-content :json="content.forward.json" />
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "EventContent",
  props: {
    json: {
      type: String,
      default: "",
    },
  },
  computed: {
    content() {
      let obj = {};
      let temp = JSON.parse(this.json);
      obj.msg = temp.msg;
      obj.song = temp.song;
      obj.playlist = temp.playlist;
      obj.album = temp.album;
      obj.mv = temp.mv;
      obj.video = temp.video;
      obj.djRadio = temp.djRadio;
      if (temp.event) {
        obj.forward = temp.event;
      }
      return obj;
    },
  },
  methods: {
    ...mapMutations(["updateSongId", "updateDetailId", "updateAlbumId"]),
    updateDetail(id) {
      this.updateDetailId(id);
      this.$router.push("/detail");
    },
    toVideo(vid) {
      this.$router.push({
        path: "/showVideo",
        query: { vid },
      });
    },
    toMv(id, name, artists) {
      this.$router.push({
        path: "/showMv",
        query: { mvId: id, name, artists },
      });
    },
    toAlbum(id) {
      this.updateAlbumId(id);
      this.$router.push("/album");
    },
  },
};
</script>

<style scoped>
.event-song-playlist {
  margin: 10px 0;
  padding: 10px;
  background-color: #6564646b;
  border-radius: 5px;
}

.event-song-item {
  display: inline-block;
  max-width: 50vw;
  margin-left: 10px;
}

.art-name {
  color: #b1b1b1;
  display: inline-block;
  margin-top: 5px;
}

.event-forward .content-msg,
.event-type {
  color: #b1b1b1;
}
</style>