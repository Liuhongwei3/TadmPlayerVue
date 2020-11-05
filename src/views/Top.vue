<template>
  <div
    v-loading.lock="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-tag type="danger">云音乐特色榜</el-tag>
    <Items :lists="toplists.slice(0, 4)" @newId="updateId">
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
    <Items :lists="toplists.slice(4)" @newId="updateId">
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
import { mapState } from "vuex";

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
    ...mapState(["toplists"]),
  },
  methods: {
    async requestTopList() {
      this.loading = true;

      let list = await req.netease.toplist();
      this.$store.dispatch("updateTopLists", { list });

      this.loading = false;
      this.$nextTick(() => {
        this.$emit("refresh");
      });
    },
    updateId({ id }) {
      this.$store.commit("updateDetailId", id);
      this.$router.push("/detail");
    },
  },
};
</script>
