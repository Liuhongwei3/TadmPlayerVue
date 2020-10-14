<template>
  <div>
    <el-tag type="danger">热门歌单</el-tag>
    <el-tag type="info">放松心情</el-tag>
    <el-tag type="success">动感节奏</el-tag>
    <el-tag type="primary">轻松纯音乐</el-tag>
    <div
      class="main"
      v-loading.lock="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div
        class="items"
        v-for="item in hotDetailLists"
        :key="item.id"
        @click="updateDetailId(item.id)"
      >
        <el-tooltip
          placement="right"
          :content="`${item.name}---${item.creator.nickname}`"
        >
          <el-badge :value="item.playCount | roundW">
            <div class="bottom">
              <span>By&nbsp;&nbsp;{{ item.creator.nickname }}</span>
            </div>
            <img v-lazy="item.coverImgUrl" :key="item.coverImgUrl" />
            <p class="name">{{ item.name }}</p>
          </el-badge>
        </el-tooltip>
      </div>
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
import req from "@/network/req";
import { debounce, to } from "@/utils";

export default {
  name: "hotDetail",
  data() {
    return {
      hotDetailLists: [],
      limit: 24,
      loading: false,
      noMore: false,
    };
  },
  created() {
    this.requestHotDetails(this.limit);
  },
  mounted() {
    this.$bus.$on("loadMoreHotDetails", () => {
      if (this.limit <= 100) {
        this.limit += 24;
        this.loading = true;
        this.requestHotDetails(this.limit);
      } else {
        this.noMore = true;
        this.$notify({
          title: "信息警告",
          message: "已经加载了全部歌单啦！",
          type: "warning",
          offset: 50,
          duration: 1500,
        });
      }
    });
  },
  methods: {
    notify() {
      return debounce(
        this.$notify({
          title: "信息提示",
          message: "加载更多热门歌单数据中！",
          type: "info",
          offset: 50,
          duration: 1500,
        }),
        500
      );
    },
    async requestHotDetails(limit) {
      this.loading = true;
      this.notify();
      let [
        err,
        {
          data: { playlists },
        },
      ] = await to(req.netease.hotDetails(limit));
      if (err) {
        this.$notify({
          title: "加载错误",
          message: err.response.statusText,
          type: "error",
          offset: 50,
          duration: 1500,
        });
        return;
      }
      this.hotDetailLists = playlists;
      this.loading = false;
      this.$nextTick(() => this.$bus.$emit("refresh"));
    },
    updateDetailId(id) {
      this.$store.commit("updateDetailId", id);
      this.$router.push("/detail");
    },
  },
  beforeDestroy() {
    //当这个组件销毁的时候bus也跟着一起销毁
    this.$bus.$off("loadMoreHotDetails");
  },
};
</script>

<style scoped>
.items {
  position: relative;
}

.bottom {
  bottom: 32px;
  left: 10px;
}

@media screen and (max-width: 768px) {
  .bottom {
    bottom: 25px;
  }
}
</style>
