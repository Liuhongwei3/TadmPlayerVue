<template>
  <div>
    <el-tag type="danger">热门歌单</el-tag>
    <el-tag type="info">放松心情</el-tag>
    <el-tag type="success">动感节奏</el-tag>
    <el-tag type="primary">轻松纯音乐</el-tag>
    <div class="main">
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
  </div>
</template>

<script>
import { hotDetails } from "@/network/Request";
import { debounce } from "../utils";

export default {
  name: "hotDetail",
  data() {
    return {
      hotDetailLists: [],
      limit: 24,
    };
  },
  created() {
    this.requestHotDetails(this.limit);
  },
  mounted() {
    this.$bus.$on("loadMoreHotDetails", () => {
      if (this.limit <= 100) {
        this.limit += 24;
        this.requestHotDetails(this.limit);
      } else {
        this.$notify({
          title: "警告",
          message: "已经加载了全部歌单啦！",
          type: "warning",
        });
      }
    });
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$emit("toTop");
    });
  },
  methods: {
    requestHotDetails(limit) {
      hotDetails(limit).then((res) => {
        if (res.data.code === 200) {
          this.hotDetailLists = res.data.playlists;
        } else {
          this.$notify({
            title: "错误",
            message: "There is some errors~",
            type: "error",
          });
        }
      });
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
  margin: 10px 0;
}

.bottom {
  bottom: 32px;
  left: 15px;
}

@media screen and (max-width: 768px) {
  .bottom {
    bottom: 25px;
  }
}
</style>
