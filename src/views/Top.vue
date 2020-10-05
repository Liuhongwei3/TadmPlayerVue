<template>
  <div>
    <el-tag type="danger">热门排行榜</el-tag>
    <el-tag type="danger">网易云音乐</el-tag>
    <div class="main">
      <div v-for="(item, index) in toplists" :key="index">
        <el-tooltip placement="top" :content="item.name">
          <div>
            <img @click="updateDetail(item.id)" :src="item.coverImgUrl" />
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { toplist } from "@/network/Request";
import { to } from "@/utils";

export default {
  name: "Top",
  created() {
    this.toplists.length === 0 && this.requestTopList();
  },
  computed: {
    toplists: {
      get() {
        return this.$store.state.toplists;
      },
    },
  },
  methods: {
    async requestTopList() {
      this.$notify({
        title: "信息提示",
        message: "加载排行榜榜单数据中！",
        type: "info",
        offset: 50,
        duration: 1500,
      });
      let [
        err,
        {
          data: { list },
        },
      ] = await to(toplist());
      if (err) {
        this.$notify({
          title: "加载失败",
          message: "获取排行榜榜单数据失败！",
          type: "error",
          offset: 50,
          duration: 2000,
        });
        return;
      }
      this.$store.dispatch("updateTopLists", { list });
      this.$nextTick(() => this.$bus.$emit("refresh"));
    },
    updateDetail(id) {
      this.$store.commit("updateDetailId", id);
      this.$router.push("/detail");
    },
  },
};
</script>
