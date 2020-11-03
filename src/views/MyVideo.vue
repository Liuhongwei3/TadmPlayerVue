<template>
  <div
    style="text-align: left; margin-left: 10px"
    v-loading.lock="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-select v-model="group" clearable placeholder="请选择">
      <el-option
        v-for="item in videoGroups"
        :key="item.id"
        :label="item.name"
        :value="item.name"
      >
      </el-option>
    </el-select>

    <el-link style="margin: 10px 0 0 10px" type="warning" disabled
      >根据分类获得视频需要登录权限！</el-link
    >
  </div>
</template>

<script>
import req from "@/network/req";

export default {
  name: "MyViedo",
  data() {
    return {
      group: "",
      videoGroups: [],
      loading: false,
      noMore: false,
    };
  },
  created() {
    this.requestVideoGroups();
  },
  activated() {
    this.$emit("toTop");
  },
  methods: {
    async requestVideoGroups() {
      this.loading = true;
      let {
        data: { data },
      } = await req.netease.videoGroups();
      this.videoGroups = data;
      this.videoGroups.unshift({ id: 999999, name: "全部视频" });

      this.group = this.videoGroups[0].name;
      this.loading = false;
    },
  },
};
</script>