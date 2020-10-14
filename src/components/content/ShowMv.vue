<template>
  <div>
    <el-tag type="warning">{{ name }}</el-tag>
    <el-tag type="success">{{ artName }}</el-tag>
    <el-divider></el-divider>
    <video
      controls
      crossorigin="anonymous"
      :src="videos"
      v-if="videos.length !== 0"
    ></video>
    <el-divider></el-divider>
    <CommContent :comments="hotComments">
      <el-tag type="danger">精彩评论</el-tag>
    </CommContent>
    <el-divider></el-divider>
    <CommContent :comments="hotComments">
      <el-tag type="success">最新评论</el-tag>
    </CommContent>
  </div>
</template>

<script>
import { mapState } from "vuex";
import req from "@/network/req";
import CommContent from "@/components/content/CommContent";

export default {
  name: "ShowMv",
  data() {
    return {
      mvId: 0,
      name: "",
      artName: "",
      videos: "",
      hotComments: [],
      comments: [],
    };
  },
  components: { CommContent },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$emit("toTop");
    });
  },
  activated() {
    this.setData(this.$route.query);
  },
  methods: {
    setData({ mvId, name, artName }) {
      this.mvId = mvId;
      this.name = name;
      this.artName = artName;
      this.requestMv(this.mvId);
    },
    async requestMv(mvId) {
      if (!mvId) return;
      let [
        {
          data: {
            data: { url },
          },
        },
        { data: commentData },
      ] = await Promise.all([
        req.netease.getMvUrl(mvId),
        req.netease.getMvComment(mvId),
      ]);
      this.videos = url;
      this.hotComments = commentData.hotComments;
      this.comments = commentData.comments;
    },
  },
};
</script>

<style scoped>
video {
  width: 80vw;
  height: 60vh;
  object-fit: cover;
  border-radius: 15px;
}
</style>
