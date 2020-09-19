<template>
  <div>
    <el-tag type="danger">热门排行榜</el-tag>
    <el-tag type="danger">网易云音乐</el-tag>
    <div id="top" class="main">
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
import { toplist } from "../network/Request";

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
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$emit("toTop");
    });
  },
  methods: {
    async requestTopList() {
      let res = await toplist();
      let { data } = res;
      if (data.code === 200) {
        this.$store.dispatch("updateTopLists", { list: data.list });
      } else {
        this.$notify({
          title: "失败",
          message: "获取排行榜单数据失败！",
          type: "error",
        });
      }
    },
    updateDetail(id) {
      this.$store.commit("updateDetailId", id);
      this.$router.push("/detail");
    },
  },
};
</script>
