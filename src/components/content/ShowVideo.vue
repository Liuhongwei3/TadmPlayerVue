<template>
  <div
    v-loading.lock="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-page-header @back="goBack" content="视频详情"> </el-page-header>
    <video
      controls
      crossorigin="anonymous"
      :src="videos"
      v-if="videos.length !== 0"
    ></video>

    <el-divider v-if="videoDetail.title"></el-divider>
    <div style="text-align: left; margin-left: 10px">
      <div v-if="videoDetail.creator">
        <el-avatar
          :src="videoDetail.creator.avatarUrl"
          v-viewer.static
        ></el-avatar>
        <span
          class="content-username"
          @click="toUser(videoDetail.creator.userId)"
          >{{ this.videoDetail.creator.nickname }}</span
        >
      </div>

      <h3 v-if="videoDetail.title">{{ this.videoDetail.title }}</h3>

      <div style="color: #b1b1b1; margin-bottom: 10px">
        <span v-if="videoDetail.publishTime"
          >发布：{{ videoDetail.publishTime | dateFormat }}</span
        >
        <span style="margin-left: 20px" v-if="videoDetail.playTime"
          >播放：{{ videoDetail.playTime | roundW }}</span
        >
      </div>

      <div style="margin-bottom: 10px" v-if="videoDetail.videoGroup">
        <el-tag v-for="item in videoDetail.videoGroup" :key="item.id">{{
          item.name
        }}</el-tag>
      </div>

      <div v-if="videoDetail.title" style="margin-bottom: 10px">
        <i class="fa fa-2x fa-thumbs-o-up like-icon" aria-hidden="true"></i>
        <span>赞({{ videoDetail.praisedCount | roundW }})</span>
        <i class="fa fa-2x fa-share-square-o share-icon" aria-hidden="true"></i>
        <span>分享({{ videoDetail.shareCount | roundW }})</span>
        <i class="fa fa-2x fa-commenting-o comment-icon" aria-hidden="true"></i>
        <span>评论({{ videoDetail.commentCount | roundW }})</span>
      </div>

      <el-divider v-if="videoDetail.title"></el-divider>
    </div>

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

export default {
  name: "ShowVideo",
  components: { CommContent },
  data() {
    return {
      videoDetail: {},
      videos: "",
      comments: [],
      hotComments: [],
      limit: 20,
      loading: false,
      noMore: false,
      activeName: "first",
    };
  },
  activated() {
    let audio = document.getElementById("audio");
    audio && audio.pause();

    this.$emit("toTop");
    Object.keys(this.$route.query).length !== 0 &&
      this.setData(this.$route.query);
  },
  methods: {
    setData({ vid }) {
      this.requestVideoDetail(vid);
      this.reqVideoUrl(vid);
      this.getVideoComments(vid, this.limit);
    },
    async requestVideoDetail(vid) {
      this.loading = true;

      this.videoDetail = await req.netease.getVideoDetailById(vid);

      this.$nextTick(() => this.$bus.$emit("refresh"));
    },
    async reqVideoUrl(vid) {
      let { urls } = await req.netease.getVideoUrlById(vid);
      this.videos = urls[0].url;
      this.$nextTick(() => this.$bus.$emit("refresh"));
    },
    async getVideoComments(vid, limit = 20) {
      [this.hotComments, this.comments] = await req.netease.getVideoComments(
        vid,
        limit
      );

      this.loading = false;
      this.$nextTick(() => this.$bus.$emit("refresh"));
    },
    goBack() {
      this.$router.go(-1);
    },
    toUser(uid) {
      if (!uid) return;
      this.$store.commit("updateUserId", uid);
      this.$router.push("/user").then((err) => {});
    },
    handleClick() {
      this.$nextTick(() => this.$bus.$emit("refresh"));
    },
  },
};
</script>