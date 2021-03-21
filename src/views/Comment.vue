<template>
  <div>
    <el-row class="comment-head" v-if="Object.keys(songInfo).length">
      <el-col :sm="3" :xs="7">
        <img class="comment-song-img" v-lazy="songInfo.album.picUrl" v-viewer />
      </el-col>
      <el-col :sm="16" :xs="16">
        <div class="song-name comm-h-r">{{ songInfo.name }}</div>
        <div class="comm-h-r">
          <span>歌手：</span>
          <span
            class="content-username"
            v-for="art in songInfo.artists"
            :key="art.id"
            @click="toSinger(art.id)"
          >
            {{ art.name }} /
          </span>
        </div>

        <div class="comm-h-r">
          <span>专辑：</span>
          <span class="content-username" @click="toAlbum(songInfo.album.id)">{{
            songInfo.album.name
          }}</span>
        </div>
      </el-col>
    </el-row>

    <el-tabs v-model="activeName" @tab-click="handleClick">
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
import { mapMutations, mapState } from "vuex";

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
    ...mapState(["source", "songInfo"]),
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
      if (newValue === "third" && this.comments.length === 0) {
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
    ...mapMutations(["updateSingerId", "updateAlbumId"]),
    toSinger(sid) {
      this.updateSingerId(sid);
      this.$router.push("/singer");
    },
    toAlbum(id) {
      this.updateAlbumId(id);
      this.$router.push("/album");
    },
    handleClick(tab, event) {
      this.$nextTick(() => {
        this.$emit("refresh");
      });
    },
    async requestComments(sid, limit) {
      this.commLoading = true;
      [this.comments, this.commNoMore] = await req.netease.songComment(
        sid,
        limit
      );
      this.commLoading = false;
      this.handleClick();
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
          let data = await to(req.qq.getMusicCommentsByQq(sid));
          if (!data) {
            [this.hotComments, this.comments] = data;
          }
          break;
        }
      }

      this.tempSid = this.songId;
      this.loading = false;
      this.handleClick();
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
.comment-head {
  text-align: left;
  padding: 16px;
}

.comment-song-img {
  width: 100px;
  height: 100px;
  border-radius: 6px;
}

.song-name {
  font-size: 24px;
}

.comm-h-r {
  max-width: 52vw;
  margin: 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media screen and (max-width: 768px) {
  .comment-head {
    text-align: left;
    padding: 6px;
  }

  .song-name {
    font-size: 20px;
  }

  .comment-song-img {
    width: 80px;
    height: 80px;
  }

  .comm-h-r {
    margin: 5px 0;
  }
}
</style>
