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

    <div v-if="Object.keys(videoDetail).length">
      <el-divider></el-divider>
      <div class="mv-detail">
        <div>
          <el-avatar :src="videoDetail.creator.avatarUrl" v-viewer></el-avatar>
          <span
            class="content-username"
            @click="toUser(videoDetail.creator.userId)"
            >{{ this.videoDetail.creator.nickname }}</span
          >
        </div>

        <h3>{{ this.videoDetail.title }}</h3>

        <div class="mv-detail-item" style="color: #b1b1b1">
          <span v-if="videoDetail.publishTime"
            >发布：{{ videoDetail.publishTime | dateFormat }}</span
          >
          <span style="margin-left: 20px" v-if="videoDetail.playTime"
            >播放：{{ videoDetail.playTime | roundW }}</span
          >
        </div>

        <el-collapse class="box-card" v-if="videoDetail.description">
          <el-collapse-item class="desc" title="视频简介">
            {{ videoDetail.description }}
          </el-collapse-item>
        </el-collapse>

        <div class="mv-detail-item">
          <span>标签：</span>
          <el-tag
            style="background: transparent"
            type="danger"
            effect="plain"
            v-for="item in videoDetail.videoGroup"
            :key="item.id"
            >{{ item.name }}</el-tag
          >
        </div>

        <div class="mv-detail-item">
          <i class="fa fa-2x fa-thumbs-o-up like-icon" aria-hidden="true"></i>
          <span>赞({{ videoDetail.praisedCount | roundW }})</span>
          <i
            class="fa fa-2x fa-share-square-o share-icon"
            aria-hidden="true"
          ></i>
          <span>分享({{ videoDetail.shareCount | roundW }})</span>
          <i
            class="fa fa-2x fa-commenting-o comment-icon"
            aria-hidden="true"
          ></i>
          <span>评论({{ videoDetail.commentCount | roundW }})</span>
        </div>

        <el-divider></el-divider>
      </div>
    </div>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="精彩评论" name="first">
        <comm-content :comments="hotComments"> </comm-content>
      </el-tab-pane>

      <el-tab-pane label="最新评论" name="second">
        <comm-content :comments="comments"> </comm-content>
      </el-tab-pane>

      <el-tab-pane label="相关推荐" name="third">
        <video-content
          :videos="relatedVideos"
          @newId="updateId"
        ></video-content>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import req from "@/network/req";
import CommContent from "@/components/content/CommContent";
import VideoContent from "@/components/content/VideoContent";

export default {
  name: "ShowVideo",
  components: { CommContent, VideoContent },
  data() {
    return {
      vid: 0,
      videoDetail: {},
      videos: "",
      comments: [],
      hotComments: [],
      relatedVideos: [],
      limit: 20,
      loading: false,
      noMore: false,
      activeName: "first",
    };
  },
  watch: {
    vid(newVal) {
      this.activeName = "first";
      this.relatedVideos = [];
      let audio = document.getElementById("audio");
      audio && audio.pause();
      this.$emit("toTop");
    },
    activeName(newVal) {
      if (newVal === "third") {
        this.relatedVideos.length === 0 && this.getRelatedV(this.vid);
      }
    },
  },
  activated() {
    let audio = document.getElementById("audio");
    audio && audio.pause();

    this.$emit("toTop");
    Object.keys(this.$route.query).length && this.setData(this.$route.query);
  },
  methods: {
    setData({ vid }) {
      this.vid = vid;
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
    async getRelatedV(id) {
      this.relatedVideos = await req.netease.getRelatedVideos(id);
      this.$nextTick(() => this.$bus.$emit("refresh"));
    },
    goBack() {
      this.$router.go(-1);
    },
    updateId({ id }) {
      this.setData({ vid: id });
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
