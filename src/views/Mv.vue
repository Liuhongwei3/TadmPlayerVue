<template>
  <div id="mv">
    <div class="top">
      <div>
        <h3 class="top-type">MV 排行榜</h3>
        <el-tag
          class="top-type"
          effect="dark"
          type="danger"
          v-for="item in topTypes"
          :key="item.id"
          :class="{ active: topType === item.value }"
          @click="topType = item.value"
          >{{ item.value }}</el-tag
        >
      </div>

      <div
        class="top-mv"
        v-loading.lock="topLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <div
          class="top-mv-items"
          v-for="item in topMvLists"
          :key="item.id"
          @click="toMv(item.id, item.name, item.artists)"
        >
          <img :src="item.cover" alt="" />
          <div class="top-mv-right">
            <div class="top-mv-right-item">
              <span>{{ item.name }}</span>
            </div>
            <div class="top-mv-right-item">
              <span
                class="art-name"
                v-for="arts in item.artists"
                :key="arts.id"
              >
                <span>{{ arts.name }}</span>
                <span v-if="item.artists.length > 1">
                  &nbsp;&nbsp;/&nbsp;&nbsp;
                </span>
              </span>
            </div>
            <div class="top-mv-right-item">
              播放量：{{ item.playCount | roundW }}
            </div>
            <div class="top-mv-right-item">热度：{{ item.score }}</div>
          </div>
        </div>
      </div>
    </div>

    <el-divider></el-divider>
    <div class="all">
      <div class="top">
        <h3>全部 MV</h3>
        <el-tag>地区</el-tag>
        <el-tag
          class="top-type"
          effect="dark"
          v-for="item in areas"
          :key="item.id"
          :class="{ active: area === item.value }"
          @click="area = item.value"
          >{{ item.value }}</el-tag
        >
        <br />
        <el-tag type="warning">类型</el-tag>
        <el-tag
          class="top-type"
          type="warning"
          effect="dark"
          v-for="item in types"
          :key="item.value"
          :class="{ active: type === item.value }"
          @click="type = item.value"
          >{{ item.value }}</el-tag
        >
        <br />
        <el-tag type="danger">排序</el-tag>
        <el-tag
          class="top-type"
          type="danger"
          effect="dark"
          v-for="item in orders"
          :key="item.value"
          :class="{ active: order === item.value }"
          @click="order = item.value"
          >{{ item.value }}</el-tag
        >
      </div>

      <div
        v-loading.lock="allLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <mv-content :mvs="mvLists"></mv-content>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import req from "@/network/req";

import MvContent from "@/components/content/MvContent";

export default {
  name: "Mv",
  components: { MvContent },
  data() {
    return {
      topTypes: [
        { id: 61, value: "内地" },
        { id: 62, value: "港台" },
        { id: 63, value: "欧美" },
        { id: 64, value: "韩国" },
        { id: 65, value: "日本" },
      ],
      topType: "内地",
      areas: [
        { id: 11, value: "全部" },
        { id: 12, value: "内地" },
        { id: 13, value: "港台" },
        { id: 14, value: "欧美" },
        { id: 15, value: "韩国" },
        { id: 16, value: "日本" },
      ],
      area: "全部",
      types: [
        { id: 21, value: "全部" },
        { id: 22, value: "官方版" },
        { id: 23, value: "原声" },
        { id: 24, value: "现场版" },
        { id: 25, value: "网易出品" },
      ],
      type: "全部",
      orders: [
        { id: 32, value: "最热" },
        { id: 33, value: "最新" },
        { id: 31, value: "上升最快" },
      ],
      order: "最热",
      topMvLists: [],
      mvLists: [],
      topLoading: false,
      allLoading: false,
    };
  },
  computed: {
    ...mapState(["songId"]),
  },
  created() {
    this.requestTopMv();
    this.requestAllMv();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$emit("toTop");
    });
  },
  watch: {
    topType(newValue) {
      this.requestTopMv(newValue);
    },
    area(newValue) {
      this.requestAllMv(newValue, this.type, this.order);
    },
    type(newValue) {
      this.requestAllMv(this.area, newValue, this.order);
    },
    order(newValue) {
      this.requestAllMv(this.area, this.type, newValue);
    },
  },
  methods: {
    async requestTopMv(type) {
      this.topLoading = true;

      this.topMvLists = await req.netease.topMv(type);

      this.topLoading = false;
      this.$nextTick(() => this.$emit("refresh"));
    },
    async requestAllMv(area = "全部", type = "全部", order = "最热") {
      this.allLoading = true;

      this.mvLists = await req.netease.allMv(area, type, order);

      this.allLoading = false;
      this.$nextTick(() => this.$emit("refresh"));
    },
    toMv(id, name, artists) {
      this.$router.push({
        path: "/showMv",
        query: { mvId: id, name, artists },
      });
    },
  },
};
</script>

<style scoped>
#mv {
  text-align: left;
}

.top {
  margin-left: 10px;
}

.top-type {
  display: inline-block;
  margin: 5px;
  background-color: transparent;
}

.active {
  background-color: #7e7e7e;
}

.top-mv {
  display: flex;
  flex-wrap: wrap;
}

.top-mv-items {
  width: 45%;
  display: inline-flex;
  margin: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-mv-right {
  margin: 10px;
}

.top-mv-right-item {
  margin: 10px;
  max-width: 50vw;
  overflow: hidden;
}

.top img {
  width: 200px;
  height: 150px;
}

.art-name {
  color: #bebebe;
}

@media screen and (max-width: 768px) {
  .top {
    font-size: 14px;
  }

  .top img {
    width: 80px;
    height: 80px;
  }

  .top-mv-items {
    width: 95%;
    margin: 5px 0;
  }

  .top-mv-right {
    margin: 0;
  }

  .top-mv-right-item {
    margin: 0 0 5px 5px;
  }
}
</style>
