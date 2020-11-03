<template>
  <div>
    <el-page-header @back="goBack" content="MV详情"> </el-page-header>
    <el-tag type="warning">{{ name }}</el-tag>
    <el-tag type="success">{{ artName }}</el-tag>
    <el-divider></el-divider>
    <video
      controls
      crossorigin="anonymous"
      :src="videos"
      v-if="videos.length !== 0"
    ></video>

    <CommContent :comments="hotComments"
      ><el-divider></el-divider>
      <el-tag type="danger">精彩评论</el-tag>
    </CommContent>

    <CommContent :comments="hotComments"
      ><el-divider></el-divider>
      <el-tag type="success">最新评论</el-tag>
    </CommContent>
  </div>
</template>

<script>
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
  activated() {
    let audio = document.getElementById("audio");
    audio && audio.pause();

    this.$emit("toTop");
    this.setData(this.$route.query);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
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
      this.$nextTick(() => this.$bus.$emit("refresh"));
    },
  },
};
</script>