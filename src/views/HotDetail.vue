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
import { mapState } from "vuex";

export default {
  name: "hotDetail",
  components: { Items },
  data() {
    return {
      hotDetailLists: [],
      limit: 24,
      loading: false,
      noMore: false,
    };
  },
  computed: {
    ...mapState(["source"]),
  },
  created() {
    this.requestHotDetails(this.limit);
  },
  watch: {
    source(val) {
      switch (val) {
        case "netease": {
          this.requestHotDetails(true);
        }
        case "kugou": {
          this.requestHotDetails(false);
        }
      }
    },
  },
  mounted() {
    this.$bus.$on("loadMoreHotDetails", () => {
      if (this.limit <= 100 && this.source === "netease") {
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
    async requestHotDetails(flag) {
      this.loading = true;

      if (flag) {
        this.hotDetailLists = await req[this.source].hotDetails(this.limit);
      } else {
        this.hotDetailLists = await req[this.source].hotDetails();
      }

      this.loading = false;
      this.$nextTick(() => this.$emit("refresh"));
    },
    updateId({ id }) {
      switch (this.source) {
        case "netease": {
          this.$store.commit("updateDetailId", id);
          this.$router.push("/detail");
        }
        case "kugou": {
          this.$store.commit("updateDetailId", id);
          this.$router.push("/kugou/detail");
        }
      }
    },
  },
  beforeDestroy() {
    //当这个组件销毁的时候bus也跟着一起销毁
    this.$bus.$off("loadMoreHotDetails");
  },
};
</script>
