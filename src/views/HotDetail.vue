<template>
  <div>
    <el-tag type="danger">热门歌单</el-tag>
    <el-tag type="info">放松心情</el-tag>
    <el-tag type="success">动感节奏</el-tag>
    <el-tag type="primary">轻松纯音乐</el-tag>

    <Items
      :lists="hotDetailLists"
      @newId="updateId"
      v-loading.lock="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <template v-slot:playCount="hotDetail">
        <i class="fa fa-headphones" aria-hidden="true"></i>
        <span>{{ hotDetail.item.playCount | roundW }}</span>
      </template>
      <template v-slot:nickname="hotDetail">
        <span>By {{ hotDetail.item.nickname }}</span>
      </template>
    </Items>
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
import Items from "@/components/common/items/Items";
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
  components: { Items },
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

      let formatList = [];
      for (let v of playlists) {
        let obj = {};

        obj.id = v.id;
        obj.name = v.name;
        obj.nickname = v.creator.nickname;
        obj.imgUrl = v.coverImgUrl;
        obj.playCount = v.playCount;

        formatList.push(obj);
      }

      this.hotDetailLists = formatList;
      this.loading = false;
      this.$nextTick(() => this.$bus.$emit("refresh"));
    },
    updateId({ id }) {
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
