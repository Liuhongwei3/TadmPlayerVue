<template>
  <el-drawer
    title="站点选项配置"
    :visible="drawer"
    @close="$emit('update:drawer', false)"
    direction="rtl"
    :append-to-body="true"
  >
    <div class="switch-item">
      <span>显示 MV</span>
      <el-switch
        :value="showMv"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-value="true"
        :inactive-value="false"
        @change="$emit('update:showMv', $event)"
      >
      </el-switch>
      <span v-if="showMv">开</span>
      <span v-else>关</span>
    </div>
    <div class="switch-item">
      <el-checkbox v-model="doSingle">
        单曲循环（歌曲列表变化时需要重新设置方可生效~）
      </el-checkbox>
    </div>
    <el-divider></el-divider>
    <div class="switch-item">关于我</div>
    <div>Tadm：前端爱好者 · 喜爱音乐与文学</div>
  </el-drawer>
</template>

<script>
export default {
  name: "Drawer",
  data() {
    return {
      doSingle: false,
    };
  },
  props: {
    drawer: {
      type: Boolean,
      default: false,
    },
    showMv: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    doSingle(newValue) {
      if (newValue) {
        this.$store.commit("updatePlaylistIds", [this.$store.state.songId]);
      }
    },
  },
};
</script>
