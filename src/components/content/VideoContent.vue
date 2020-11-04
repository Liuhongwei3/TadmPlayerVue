<template>
  <div class="main" style="text-align: left">
    <div
      class="video-items"
      v-for="item in videos"
      :key="item.vid"
      @click="updateId(item.vid, item.title, item.creator)"
    >
      <img :src="item.coverUrl" alt="视频封面" />
      <div class="video-name">
        <el-tag
          style="background: transparent"
          type="danger"
          effect="plain"
          v-if="item.type === 0"
          >MV</el-tag
        >
        <span>{{ item.title }}</span>
      </div>
      <span class="art-name" v-for="arts in item.creator" :key="arts.id">
        <span>{{ arts.userName }}</span>
        <span v-if="item.creator.length > 1"> &nbsp;&nbsp;/&nbsp;&nbsp; </span>
      </span>
      <div class="video-play-count">
        <i class="fa fa-video-camera" aria-hidden="true"></i>
        <span> {{ item.playTime | roundW }}</span>
      </div>
      <div class="video-brief" v-if="item.briefDesc">
        {{ item.briefDesc }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VideoContent",
  props: {
    videos: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    updateId(id, name, artists) {
      for (let v of artists) {
        v.id = v.userId;
        v.name = v.userName;
      }
      this.$emit("newId", { id, name, artists });
    },
  },
};
</script>

<style scoped>
.video-items:hover {
  color: #fff;
}

.video-items {
  width: 400px;
  margin: 10px;
  position: relative;
}

img {
  width: 400px;
  height: 200px;
  border-radius: 0%;
  margin: 0;
}

.video-name {
  width: 100%;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
}

.art-name {
  color: #bebebe;
}

.video-play-count {
  position: absolute;
  top: 10px;
  right: 10px;
}

.video-brief {
  width: 100%;
  line-height: 30px;
  position: absolute;
  bottom: 50px;
  left: 0;
  color: #dfdfdf;
  background-color: rgba(0, 0, 0, 0.2);
}

@media screen and (max-width: 768px) {
  img {
    width: 76vw;
    height: 150px;
  }

  .video-items {
    width: 76vw;
    position: relative;
  }
}
</style>