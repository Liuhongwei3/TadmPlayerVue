<template>
  <div id="comments">
    <el-tag type="warning" @click="changeshowCloudCommentsFlag"
      >云村热评</el-tag
    >
    <div
      class="commentItems"
      v-for="item in cloudHotComments"
      :key="item.id"
      v-show="showCloudCommentsFlag"
    >
      <el-avatar size="medium" :src="item.simpleUserInfo.avatar" />
      <span
        class="commentUser"
        @click="updateUserId(item.simpleUserInfo.userId)"
      >
        {{ item.simpleUserInfo.nickname }}:
      </span>
      <span>{{ item.content }}</span>
      <span class="count">
        <i class="fa fa-heart like" aria-hidden="true"></i>
        {{ item.likedCount | roundW }}
      </span>
      <span class="comment-time">({{ item.time | dateFormat("more") }})</span>
    </div>
    <el-divider></el-divider>
    <div
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <CommContent :comments="hotComments">
        <el-tag type="success">精彩评论</el-tag>
      </CommContent>
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
      limit: 20,
      hotComments: [],
      showCloudCommentsFlag: false,
      comments: [],
      cloudHotComments: [],
      loading: false,
      noMore: false,
    };
  },
  components: { CommContent },
  created() {
    this.songId = this.$store.state.songId;
    this.limit = 20;
    this.requestHComments(this.songId);
    this.requestCloudHotComments();
  },
  mounted() {
    this.$bus.$on("loadMoreSongComments", () => {
      if (this.source === "netease") {
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
  watch: {
    songId(newValue) {
      this.hotComments = [];
      this.noMore = false;
      this.requestHComments(newValue);
    },
    hotComments(newValue, oldValue) {
      if (newValue.length === oldValue.length) {
        this.noMore = true;
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$emit("toTop");
    });
  },
  methods: {
    requestComments(sid) {
      req.netease.songComment(sid).then((res) => {
        this.comments = res.data.comments;
      });
    },
    async requestCloudHotComments() {
      let {
        data: { data },
      } = await req.netease.cloudHotComments();
      this.cloudHotComments = data;
    },
    async requestHComments(sid, limit = 20) {
      if (sid) {
        if (this.noMore) {
          return;
        }
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
                  user: { userId: 0, avatarUrl: v.avatarurl, nickname: v.nick },
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
        this.loading = false;
        this.$nextTick(() => {
          this.$bus.$emit("refresh");
        });
      }
    },
    changeshowCloudCommentsFlag() {
      this.showCloudCommentsFlag = !this.showCloudCommentsFlag;
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

<style scoped>
#hotComments,
#comments {
  margin: 30px;
}

.commentUser {
  color: #5aacc8;
  font-size: 18px;
}

.commentUser:hover {
  cursor: pointer;
}

.commentItems {
  text-align: left;
  margin: 5px 0;
  line-height: 36px;
}

.like {
  color: #ed959f;
}

.count {
  margin-left: 10px;
  color: #ef5476;
}

.comment-time {
  font-size: 14px;
  margin: 0 5px;
  color: rgb(214, 170, 117);
}

@media screen and (max-width: 768px) {
  #hotComments,
  #comments {
    margin: 5px;
    padding: 5px;
  }

  .commentUser {
    color: #5aacc8;
    font-size: 16px;
  }

  .commentItems {
    font-size: 14px;
    line-height: 36px;
  }
}
</style>
