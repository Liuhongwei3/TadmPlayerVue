<template>
  <el-drawer
    title="站点选项配置"
    :visible="drawer"
    @close="$emit('update:drawer', false)"
    direction="rtl"
    :append-to-body="true"
  >
    <div class="switch-item">
      <span class="start">数据源</span>
      <el-select
        class="source-select"
        v-model="source"
        placeholder="请选择歌曲源"
      >
        <el-option label="网易云" value="netease">
          <el-tooltip content="网易云" placement="left">
            <img
              width="25"
              height="25"
              src="https://s1.music.126.net/style/favicon.ico?v20180823"
              alt="网易云"
            />
          </el-tooltip>
        </el-option>
        <el-option label="QQ" value="qq">
          <el-tooltip content="QQ" placement="left">
            <img
              width="25"
              height="25"
              src="https://y.qq.com/favicon.ico"
              alt="QQ"
            />
          </el-tooltip>
        </el-option>
        <el-option label="酷狗" value="kugou" disabled>
          <el-tooltip content="酷狗（敬请期待）" placement="left">
            <img
              width="25"
              height="25"
              src="https://www.kugou.com/root/favicon.ico"
              alt="酷狗"
            />
          </el-tooltip>
        </el-option>
        <!-- <el-option label="酷我音乐" value="kuwo"></el-option>
      <el-option label="虾米音乐" value="xiami"></el-option> -->
      </el-select>
    </div>
    <div class="switch-item">
      <el-checkbox v-model="doSingle">
        单曲循环（歌曲列表变化时需要重新设置方可生效~）
      </el-checkbox>
    </div>
    <el-divider></el-divider>
    <div class="switch-item">
      <div class="start">关于我</div>
      <div class="second">Tadm：前端爱好者 · 喜爱音乐与文学</div>
    </div>
    <el-divider></el-divider>
    <div class="switch-item">
      <div class="start">帮助与反馈</div>
      <div class="second">
        使用过程中如果您有任何疑问或者建议，您可以选择任何能联系到我的方式进行交流沟通！
      </div>
      <div class="second">Email: 2873126657@qq.com</div>
    </div>
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
  },
  computed: {
    source: {
      get() {
        return this.$store.state.source;
      },
      set(val) {
        this.$store.commit("updateSource", val);
      },
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

<style scoped>
.switch-item div {
  margin: 6px;
}

.switch-item span {
  margin-right: 10px;
}

.source-select {
  width: 100px;
}

.start {
  font-size: 16px;
  font-weight: 600;
}

.second {
  color: rgb(66 66 66);
}
</style>
