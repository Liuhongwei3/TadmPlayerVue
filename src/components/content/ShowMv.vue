<template>
  <div>
    <el-page-header @back="goBack" content="MV详情"> </el-page-header>
    <el-tag type="warning">{{ name }}</el-tag>
    <span v-for="art in artists" :key="art.id" @click="toSinger(art.id)">
      <el-tooltip content="点击查看歌手详情" placement="top">
        <el-tag type="success">
          {{ art.name }}
        </el-tag>
      </el-tooltip>
    </span>
    <el-divider></el-divider>
    <video
      controls
      crossorigin="anonymous"
      :src="videos"
      v-if="videos.length !== 0"
    ></video>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="精彩评论" name="first">
        <comm-content :comments="hotComments"> </comm-content>
      </el-tab-pane>
      <el-tab-pane label="最新评论" name="second">
        <comm-content :comments="comments"> </comm-content>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import req from "@/network/req";
import CommContent from "@/components/content/CommContent";
import { mapMutations } from "vuex";

export default {
  name: "ShowMv",
  data() {
    return {
      mvId: 0,
      name: "",
      artists: [],
      artName: "",
      videos: "",
      hotComments: [],
      comments: [],
      activeName: "first",
    };
  },
  components: { CommContent },
  activated() {
    let audio = document.getElementById("audio");
    audio && audio.pause();

    this.$emit("toTop");
    this.setData(this.$route.query);
  },
  methods: {
    ...mapMutations(["updateSingerId"]),
    goBack() {
      this.$router.go(-1);
    },
    setData({ mvId, name, artists }) {
      this.mvId = mvId;
      this.name = name;
      this.artists = artists;
      this.requestMv(this.mvId);
    },
    async requestMv(mvId) {
      if (!mvId) return;

      [this.videos, [this.hotComments, this.comments]] = await Promise.all([
        req.netease.getMvUrl(mvId),
        req.netease.getMvComment(mvId),
      ]);

      this.$nextTick(() => this.$bus.$emit("refresh"));
    },
    toSinger(sid) {
      this.updateSingerId(sid);
      this.$router.push("/singer");
    },
    handleClick() {
      this.$nextTick(() => this.$bus.$emit("refresh"));
    },
  },
};
</script>