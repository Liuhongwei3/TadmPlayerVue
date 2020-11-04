<template>
  <div id="comments">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="云村热评" name="first">
        <comm-content :comments="cloudHotComments" />
      </el-tab-pane>

      <el-tab-pane label="精彩评论" name="second">
        <div
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <comm-content :comments="hotComments" />
        </div>
        <load-more-foot :loading="loading" :noMore="noMore"></load-more-foot>
      </el-tab-pane>
      <el-tab-pane label="最新评论" name="third">
        <div
          v-loading="commLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <comm-content :comments="comments" />
        </div>
        <load-more-foot
          :loading="commLoading"
          :noMore="commNoMore"
        ></load-more-foot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";

import req from "@/network/req";
import { to } from "@/utils";
import CommContent from "@/components/content/CommContent";
import LoadMoreFoot from "../components/content/LoadMoreFoot";

export default {
  name: "Comment",
  data() {
    return {
      tempSid: -1,
      limit: 20,
      commLimit: 20,
      hotComments: [],
      comments: [],
      cloudHotComments: [],
      loading: false,
      commLoading: false,
      noMore: false,
      commNoMore: false,
      activeName: "second",
    };
  },
  components: {
    CommContent,
    LoadMoreFoot,
  },
  mounted() {
    this.$bus.$on("loadMoreSongComments", () => {
      if (
        this.source === "netease" &&
        this.activeName === "second" &&
        !this.noMore
      ) {
        this.limit += 20;
        this.requestHComments(this.songId, this.limit);
      } else if (
        this.source === "netease" &&
        this.activeName === "third" &&
        !this.commNoMore
      ) {
        this.commLimit += 20;
        this.requestComments(this.songId, this.commLimit);
      }
    });
  },
  computed: {
    ...mapState(["source"]),
    songId: {
      get() {
        return this.$store.state.songId;
      },
      set(arg) {
        this.$store.state.songId = arg;
      },
    },
  },
  activated() {
    if (this.tempSid && this.tempSid != this.songId) {
      this.comments = [];
      this.hotComments = [];
      this.noMore = false;
      this.requestHComments(this.songId, this.limit);
    }
  },
  watch: {
    songId(newValue) {
      this.hotComments = [];
      this.tempSid = -1;
      this.limit = 20;
      this.activeName = "second";
      this.noMore = false;
      newValue &&
        this.tempSid != newValue &&
        this.$route.path === "/comment" &&
        this.requestHComments(newValue);
    },
    hotComments(newValue, oldValue) {
      if (newValue.length === oldValue.length && newValue.length !== 0) {
        this.noMore = true;
      }
    },
    activeName(newValue) {
      if (newValue === "first" && this.cloudHotComments.length === 0) {
        this.requestCloudHotComments();
      } else if (newValue === "third" && this.comments.length === 0) {
        this.requestComments(this.songId);
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$emit("toTop");
    });
  },
  methods: {
    handleClick(tab, event) {
      this.$nextTick(() => {
        this.$bus.$emit("refresh");
      });
    },
    async requestComments(sid, limit) {
      this.commLoading = true;
      [this.comments, this.commNoMore] = await req.netease.songComment(
        sid,
        limit
      );
      this.commLoading = false;
      this.$nextTick(() => {
        this.$bus.$emit("refresh");
      });
    },
    async requestCloudHotComments() {
      this.cloudHotComments = await req.netease.cloudHotComments();
      this.$nextTick(() => {
        this.$bus.$emit("refresh");
      });
    },
    async requestHComments(sid, limit) {
      this.loading = true;
      switch (this.source) {
        case "netease": {
          [this.hotComments, this.noMore] = await req.netease.songHotComment(
            sid,
            limit
          );
          break;
        }
        case "qq": {
          [
            err,
            {
              data: {
                data: { hotComments },
              },
            },
          ] = await to(req.qq.getMusicCommentsByQq(sid));
          if (!err) {
            let temp = [];
            for (let v of hotComments) {
              temp.push({
                time: v.time * 1000,
                content: v.rootcommentcontent,
                likedCount: v.praisenum,
                user: {
                  userId: 0,
                  avatarUrl: v.avatarurl,
                  nickname: v.nick,
                },
              });
            }
            this.hotComments = temp;
          }
          break;
        }
      }

      this.tempSid = this.songId;
      this.loading = false;
      this.$nextTick(() => {
        this.$bus.$emit("refresh");
      });
    },
    updateUserId(uid) {
      if (!uid) {
        return;
      }
      this.$store.commit("updateUserId", uid);
      this.showCommentsFlag = !this.showCommentsFlag;
      this.$router.push("/user").then((err) => {});
    },
  },
  beforeDestroy() {
    this.$bus.$off("loadMoreComments");
  },
};
</script>
