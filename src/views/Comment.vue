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
        <div v-if="loading">
          <el-divider></el-divider>
          <el-button type="primary">
            <i class="el-icon-loading"></i>加载中...
          </el-button>
        </div>
        <div v-if="noMore">
          <el-divider></el-divider>
          <el-button type="warning">没有更多了</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";

import req from "@/network/req";
import { to } from "@/utils";
import CommContent from "@/components/content/CommContent";

export default {
  name: "Comment",
  data() {
    return {
      tempSid: -1,
      limit: 20,
      hotComments: [],
      comments: [],
      cloudHotComments: [],
      loading: false,
      noMore: false,
      activeName: "second",
    };
  },
  components: {
    CommContent,
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
    // requestComments(sid) {
    //   req.netease.songComment(sid).then((res) => {
    //     this.comments = res.data.comments;
    //   });
    // },
    async requestCloudHotComments() {
      let {
        data: { data },
      } = await req.netease.cloudHotComments();

      for (let v of data) {
        let obj = {};
        obj.userId = v.simpleUserInfo.userId;
        obj.avatarUrl = v.simpleUserInfo.avatar;
        obj.nickname = v.simpleUserInfo.nickname;

        v.user = obj;
      }

      this.cloudHotComments = data;
      this.$nextTick(() => {
        this.$bus.$emit("refresh");
      });
    },
    async requestHComments(sid, limit) {
      if (sid) {
        this.loading = true;
        if (this.$route.path === "/comment") {
          this.$notify({
            title: "信息提示",
            message: "加载歌曲热评数据中！",
            type: "info",
            offset: 50,
            duration: 1500,
          });
        }
        let [err, hotComments] = [null, []];
        switch (this.source) {
          case "netease": {
            [
              err,
              {
                data: { hotComments },
              },
            ] = await to(req.netease.songHotComment(sid, limit));
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
              hotComments = temp;
            }
            break;
          }
        }

        if (err) {
          this.$notify({
            title: "加载错误",
            message: err.response.statusText,
            type: "error",
            offset: 50,
            duration: 2000,
          });
          return;
        }
        this.hotComments = hotComments;
        this.tempSid = this.songId;
        this.loading = false;
        this.$nextTick(() => {
          this.$bus.$emit("refresh");
        });
      }
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
