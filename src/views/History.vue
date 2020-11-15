<template>
  <div
    v-loading.lock="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="播放列表" name="first">
        <detail-content
          :lists="playlist"
          parent="playlist"
          @updateSong="updateSId1"
          @updateSinger="updateSinger"
        ></detail-content>
        <load-more-foot :loading="loading" :noMore="noMore"></load-more-foot>
      </el-tab-pane>
      <el-tab-pane label="历史记录" name="second">
        <el-button
          type="danger"
          :disabled="historyLists.length === 0"
          @click="clearHistory"
          >清空历史记录</el-button
        >
        <detail-content
          :lists="historyLists"
          parent="historyLists"
          @updateSong="updateSId2"
          @updateSinger="updateSinger"
        ></detail-content>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapMutations, mapState, Store } from "vuex";

import DetailContent from "@/components/content/DetailContent";
import LoadMoreFoot from "@/components/content/LoadMoreFoot";

import req from "@/network/req";
import { notify } from "../utils";

export default {
  name: "History",
  components: { DetailContent, LoadMoreFoot },
  data() {
    return {
      playlist: [],
      limit: 20,
      activeName: "second",
      loading: false,
      noMore: false,
    };
  },
  mounted() {
    this.$bus.$on("loadMoreHistory", () => {
      if (this.activeName === "first" && !this.noMore) {
        let start = this.limit;
        this.limit += 20;
        this.reqIds(this.playlistIds.slice(start, this.limit));
      }
    });
  },
  created() {
    if (this.historyLists.length <= 1) {
      this.updateHistoryLists(
        JSON.parse(window.localStorage.getItem("history"))
      );
    }
  },
  activated() {
    this.$emit("toTop");
    if (this.playlist.length === 0 && this.playlistIds.length !== 0) {
      this.reqIds(this.playlistIds.slice(0, this.limit));
    }
  },
  computed: {
    ...mapState(["playlistIds"]),
    historyLists: {
      get() {
        return this.$store.state.historyLists;
      },
      set(val) {
        this.updateHistoryLists(val);
      },
    },
  },
  watch: {
    playlistIds(newVal, oldVal) {
      notify("info", "信息提示", "播放列表已更新！");
      this.playlist = [];
      this.limit = 20;
      this.loading = false;
      this.reqIds(newVal.slice(0, this.limit));
    },
    historyLists: {
      deep: true,
      handler: function (newVal, oldVal) {
        if (newVal.length !== 0 && newVal.length <= 200) {
          window.localStorage.setItem("history", JSON.stringify(newVal));
        }
      },
    },
  },
  methods: {
    ...mapMutations([
      "updateHistoryLists",
      "updateSongId",
      "updateSingerId",
      "updatePlaylistIds",
    ]),
    async reqIds(ids) {
      this.loading = true;
      if (ids.length === 0) {
        this.loading = false;
        return;
      }

      let songIds = "";
      for (let id of ids) {
        songIds += id + ",";
      }
      this.playlist.push(
        ...(await req.netease.musicCover(songIds.slice(0, -1)))
      );

      if (this.playlist.length === this.playlistIds.length) {
        this.noMore = true;
      }
      this.loading = false;
      this.handleClick();
    },
    handleClick() {
      this.$nextTick(() => this.$emit("refresh"));
    },
    updateSId1(sid) {
      this.updateSongId(sid);
    },
    updateSId2(sid) {
      this.updateSongId(sid);
      let ids = [];
      for (let v of this.historyLists) {
        ids.push(v.id);
      }
      this.updatePlaylistIds(ids);
    },
    updateSinger(sid) {
      this.updateSingerId(sid);
      this.$router.push("/singer");
    },
    clearHistory() {
      this.$confirm("确定要清空所有的播放记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "清空成功!",
          });
          this.historyLists = [];
          window.localStorage.setItem("history", JSON.stringify([]));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消清空",
          });
        });
    },
  },
};
</script>

<style scoped>
</style>