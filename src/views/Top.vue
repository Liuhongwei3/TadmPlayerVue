<template>
  <div>
    <el-tag type="danger">云音乐特色榜</el-tag>
    <Items
      :lists="toplists.slice(0, 4)"
      @newId="updateId"
      v-loading.lock="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <template v-slot:playCount="top">
        <i class="fa fa-headphones" aria-hidden="true"></i>
        <span>{{ top.item.playCount | roundW }}</span>
      </template>
      <template v-slot:updateTime="top">
        <span>{{ top.item.updateTime | dateFormat }} 更新</span>
      </template>
    </Items>
    <el-divider></el-divider>

    <el-tag type="warning">全球媒体榜</el-tag>
    <Items
      :lists="toplists.slice(4, -1)"
      @newId="updateId"
      v-loading.lock="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <template v-slot:playCount="top">
        <i class="fa fa-headphones" aria-hidden="true"></i>
        <span>{{ top.item.playCount | roundW }}</span>
      </template>
      <template v-slot:updateTime="top">
        <span>{{ top.item.updateTime | dateFormat }} 更新</span>
      </template>
    </Items>
  </div>
</template>

<script>
import Items from "@/components/common/items/Items";
import req from "@/network/req";
import { to } from "@/utils";

export default {
  name: "Top",
  data() {
    return {
      loading: false,
    };
  },
  components: { Items },
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
      this.loading = true;
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
      ] = await to(req.netease.toplist());
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
      let formatList = [];
      for (let v of list) {
        let obj = {};
        obj.id = v.id;
        obj.name = v.name;
        obj.imgUrl = v.coverImgUrl;
        obj.playCount = v.playCount;
        obj.updateTime = v.updateTime;
        formatList.push(obj);
      }
      this.$store.dispatch("updateTopLists", { list: formatList });
      this.loading = false;
      this.$nextTick(() => this.$bus.$emit("refresh"));
    },
    updateId({ id }) {
      this.$store.commit("updateDetailId", id);
      this.$router.push("/detail");
    },
  },
};
</script>
