<template>
  <div id="mv">
    <div class="top">
      <div>
        <h3 class="top-type">MV 排行榜</h3>
        <span
          class="top-type"
          v-for="item in topTypes"
          :key="item.id"
          :class="{ active: topType === item.value }"
          @click="topType = item.value"
          >{{ item.value }}</span
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
          @click="toMv(item.id, item.name, item.artists[0].name)"
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
      <h3>全部 MV</h3>
      <el-tag>地区</el-tag>
      <span
        class="top-type"
        v-for="item in areas"
        :key="item.id"
        :class="{ active: area === item.value }"
        @click="area = item.value"
        >{{ item.value }}</span
      >
      <br />
      <el-tag type="warning">类型</el-tag>
      <span
        class="top-type"
        v-for="item in types"
        :key="item.value"
        :class="{ active: type === item.value }"
        @click="type = item.value"
        >{{ item.value }}</span
      >
      <br />
      <el-tag type="danger">排序</el-tag>
      <span
        class="top-type"
        v-for="item in orders"
        :key="item.value"
        :class="{ active: order === item.value }"
        @click="order = item.value"
        >{{ item.value }}</span
      >
      <el-divider></el-divider>
      <div
        class="main"
        v-loading.lock="allLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <div
          class="all-mv-items"
          v-for="item in mvLists"
          :key="item.id"
          @click="toMv(item.id, item.name, item.artists[0].name)"
        >
          <img :src="item.cover" alt="" />
          <div class="mv-name">{{ item.name }}</div>
          <span class="art-name" v-for="arts in item.artists" :key="arts.id">
            <span>{{ arts.name }}</span>
            <span v-if="item.artists.length > 1">
              &nbsp;&nbsp;/&nbsp;&nbsp;
            </span>
          </span>
          <div class="mv-play-count">
            <i class="fa fa-video-camera" aria-hidden="true"></i>
            <span> {{ item.playCount | roundW }}</span>
          </div>
          <div class="mv-brief" v-if="item.briefDesc">
            {{ item.briefDesc }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import req from "@/network/req";

export default {
  name: "Mv",
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
      let {
        data: { data },
      } = await req.netease.topMv(type);
      this.topMvLists = data;
      this.topLoading = false;
    },
    async requestAllMv(area = "全部", type = "全部", order = "最热") {
      this.allLoading = true;
      let {
        data: { data },
      } = await req.netease.allMv(area, type, order);
      this.mvLists = data;
      this.allLoading = false;
    },
    toMv(id, name, artName) {
      this.$router.push({
        path: "/showMv",
        query: { mvId: id, name, artName },
      });
    },
  },
};
</script>

<style scoped>
#mv {
  text-align: left;
  margin-left: 20px;
}

.top-type {
  display: inline-block;
  margin-right: 10px;
  line-height: 25px;
  cursor: pointer;
}

.el-select {
  width: 150px !important;
}

.active {
  border: 1px solid #fff;
  font-size: 17px;
  font-weight: 400;
  border-radius: 5px;
  background-color: #7e7e7e;
  padding: 2px;
}

.top-mv {
  display: flex;
  flex-wrap: wrap;
}

.top-mv-items:hover,
.all-mv-items:hover {
  color: #fff;
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

.all-mv-items {
  width: 400px;
  margin: 10px;
  position: relative;
}

.top img {
  width: 200px;
  height: 150px;
}

.all img {
  width: 400px;
  height: 200px;
  border-radius: 0%;
  margin: 0;
}

.mv-name {
  width: 100%;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
}

.art-name {
  color: #bebebe;
}

.mv-play-count {
  position: absolute;
  top: 10px;
  right: 10px;
}

.mv-brief {
  width: 100%;
  line-height: 30px;
  position: absolute;
  bottom: 50px;
  left: 0;
  color: #dfdfdf;
  background-color: rgba(0, 0, 0, 0.2);
}

@media screen and (max-width: 768px) {
  #mv {
    margin-left: 10px;
    font-size: 14px;
  }

  .active {
    font-size: 14px;
  }

  .top img {
    width: 80px;
    height: 80px;
  }

  .all img {
    width: 76vw;
    height: 150px;
  }

  .top-mv-items {
    width: 95%;
  }

  .top-mv-items {
    margin: 5px 0;
  }

  .top-mv-right {
    margin: 0;
  }

  .top-mv-right-item {
    margin: 0 0 5px 5px;
  }

  .all-mv-items {
    width: 76vw;
    position: relative;
  }
}
</style>
