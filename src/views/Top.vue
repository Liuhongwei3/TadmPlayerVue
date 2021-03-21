<template>
  <div
    v-loading.lock="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-tag type="danger">官方热门榜单</el-tag>
    <Items :lists="toplists" @newId="updateId">
      <template v-slot:playCount="top">
        <div v-if="source === 'netease'">
          <i class="fa fa-headphones" aria-hidden="true"></i>
          <span>{{ top.item.playCount | roundW }}</span>
        </div>
      </template>
      <template v-slot:updateTime="top">
        <span v-if="source === 'netease'"
          >{{ top.item.updateTime | dateFormat }} 更新
        </span>
        <span v-if="source === 'kugou'">{{ top.item.updateTime }}更新</span>
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
  components: { Items },
  data() {
    return {
      toplists: [],
      loading: false,
    };
  },
  computed: {
    ...mapState(["source"]),
  },
  created() {
    this.toplists.length === 0 && this.requestTopList();
  },
  watch: {
    source(newVal) {
      this.requestTopList();
    },
  },
  methods: {
    async requestTopList() {
      this.loading = true;

      this.toplists = await req[this.source].toplist();

      this.loading = false;
      this.$nextTick(() => {
        this.$emit("refresh");
      });
    },
    updateId({ id }) {
      if (this.source === "netease") {
        this.$store.commit("updateDetailId", id);
        this.$router.push("/detail");
      }
    },
  },
};
</script>
