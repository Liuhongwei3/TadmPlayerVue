<template>
  <div>
    <el-page-header @back="goBack" content="MV详情"> </el-page-header>
    <el-divider></el-divider>
    <video
      controls
      crossorigin="anonymous"
      :src="videos"
      v-if="videos.length !== 0"
    ></video>

    <div v-if="Object.keys(mvDetail).length">
      <el-divider></el-divider>
      <div class="mv-detail">
        <h3>{{ mvDetail.name }}</h3>
        <div>
          <el-avatar :src="mvDetail.cover" v-viewer></el-avatar>
          <span
            class="content-username"
            v-for="art in mvDetail.artists"
            :key="art.id"
            @click="toSinger(art.id)"
          >
            {{ art.name }} /
          </span>
        </div>

        <div class="mv-detail-item" style="color: #b1b1b1;">
          <span>发布：{{ mvDetail.publishTime }}</span>
          <span style="margin-left: 20px"
            >播放：{{ mvDetail.playCount | roundW }}</span
          >
        </div>

        <el-collapse class="box-card" v-if="mvDetail.desc">
          <el-collapse-item class="desc" title="MV 简介">
            {{ mvDetail.desc }}
          </el-collapse-item>
        </el-collapse>

        <div class="mv-detail-item">
          <i class="fa fa-2x fa-thumbs-o-up like-icon" aria-hidden="true"></i>
          <span>赞({{ mvCount.likedCount | roundW }})</span>

          <i class="fa fa-2x fa-star-o sub-icon" aria-hidden="true"></i>
          <span>收藏({{ mvDetail.subCount | roundW }})</span>

          <i
            class="fa fa-2x fa-share-square-o share-icon"
            aria-hidden="true"
          ></i>
          <span>分享({{ mvCount.shareCount | roundW }})</span>

          <i
            class="fa fa-2x fa-commenting-o comment-icon"
            aria-hidden="true"
          ></i>
          <span>评论({{ mvCount.commentCount | roundW }})</span>
        </div>

        <div class="mv-detail-item" v-if="mvDetail.videoGroup">
          <span>标签：</span>
          <el-tag
            style="background: transparent"
            type="danger"
            effect="plain"
            v-for="item in mvDetail.videoGroup"
            :key="item.id"
            >{{ item.name }}</el-tag
          >
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

      <el-tab-pane label="相似MV" name="third">
        <mv-content :mvs="simiMvs" @newId="updateId"></mv-content>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import req from "@/network/req";
import CommContent from "@/components/content/CommContent";
import MvContent from "@/components/content/MvContent";
import { mapMutations } from "vuex";

export default {
  name: "ShowMv",
  components: { CommContent, MvContent },
  data() {
    return {
      mvId: 0,
      mvDetail: {},
      mvCount: {},
      videos: "",
      hotComments: [],
      comments: [],
      simiMvs: [],
      activeName: "first",
    };
  },
  activated() {
    let audio = document.getElementById("audio");
    audio && audio.pause();

    this.$emit("toTop");
    this.setData(this.$route.query);
  },
  watch: {
    mvId(newVal) {
      this.activeName = "first";
      this.simiMvs = [];
      let audio = document.getElementById("audio");
      audio && audio.pause();
      this.$bus.$emit("toTop");
      this.requestMvDetail(newVal);
    },
    activeName(newVal) {
      if (newVal === "third") {
        this.simiMvs.length === 0 && this.requestSimiMvs(this.mvId);
      }
    },
  },
  methods: {
    ...mapMutations(["updateSingerId"]),
    goBack() {
      this.$router.go(-1);
    },
    updateId({ mvId }) {
      this.setData({ mvId });
    },
    setData({ mvId }) {
      this.mvId = mvId;
    },
    async requestMvDetail(id) {
      this.mvDetail = await req.netease.getMvDetail(id);
      this.mvCount = await req.netease.getMvCount(id);
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
    async requestSimiMvs(id) {
      if (!id) return;

      this.simiMvs = await req.netease.getSimiMvs(id);

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
