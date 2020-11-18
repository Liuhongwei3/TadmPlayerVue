<template>
  <div class="home">
    <el-carousel
      height="250px"
      trigger="click"
      type="card"
      :interval="4000"
      arrow="always"
      v-if="isPc"
    >
      <el-carousel-item :key="banner.scm" v-for="banner in banners">
        <div class="banner-item">
          <img
            class="banner-img"
            :src="banner.imageUrl"
            @click="updateSId({ id: banner.encodeId })"
          />
          <el-tag
            :type="banner.titleColor === 'blue' ? 'primary' : 'danger'"
            effect="dark"
            class="banner-type"
            >{{ banner.typeTitle }}</el-tag
          >
        </div>
      </el-carousel-item>
    </el-carousel>

    <el-carousel
      trigger="click"
      height="200px"
      :interval="4000"
      arrow="always"
      indicator-position="outside"
      v-else
    >
      <el-carousel-item :key="banner.scm" v-for="banner in banners">
        <div class="banner-item">
          <img
            class="mobile-banner-img"
            style="margin: 5px; border-radius: 10px"
            :src="banner.imageUrl"
            @click="updateSId({ id: banner.encodeId })"
          />
          <el-tag
            :type="banner.titleColor === 'blue' ? 'primary' : 'danger'"
            effect="dark"
            class="banner-type"
            >{{ banner.typeTitle }}</el-tag
          >
        </div>
      </el-carousel-item>
    </el-carousel>

    <div class="item-title">推荐歌单 ></div>
    <Items :lists="recomDetails" @newId="updateDId">
      <template v-slot:playCount="home">
        <i class="fa fa-headphones" aria-hidden="true"></i>
        <span>{{ home.item.playCount | roundW }}</span>
      </template>
      <template v-slot:nickname="home">
        <span>{{ home.item.copywriter }}</span>
      </template>
    </Items>

    <div class="item-title">独家放送 ></div>
    <el-divider></el-divider>
    <mv-content :mvs="perPushs"></mv-content>

    <div class="item-title">最新音乐 ></div>
    <Items :lists="newSongs" @newId="updateSId">
      <template v-slot:nickname="home">
        <span v-if="home.item.song.artists">
          <span>By </span>
          <span v-for="art in home.item.song.artists" :key="art.id">
            {{ art.name }} /</span
          >
        </span>
      </template>
    </Items>

    <div class="item-title">推荐 MV ></div>
    <el-divider></el-divider>
    <mv-content :mvs="newMvs"></mv-content>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

import req from "@/network/req";

import Items from "@/components/common/items/Items";
import MvContent from "@/components/content/MvContent";

export default {
  name: "Home",
  components: { Items, MvContent },
  data() {
    return {
      banners: [],
      recomDetails: [],
      perPushs: [],
      newSongs: [],
      newMvs: [],
    };
  },
  computed: {
    ...mapState(["isPc"]),
    detailLimit() {
      return this.isPc ? 14 : 6;
    },
    songLimit() {
      return this.isPc ? 14 : 6;
    },
  },
  async created() {
    await this.getBanners();
    await this.getPerPush();
    await this.getRecomDetails(this.detailLimit);
    await this.getNewSongs(this.songLimit);
    await this.getNewMvs();
    this.$nextTick(() => {
      this.$emit("refresh");
    });
  },
  methods: {
    ...mapMutations(["updateSongId"]),
    async getBanners() {
      this.banners = await req.netease.getBanner();
    },
    async getRecomDetails(limit) {
      this.recomDetails = await req.netease.getRecomDetails(limit);
    },
    async getPerPush() {
      this.perPushs = await req.netease.getPerPush();
    },
    async getNewSongs(limit) {
      this.newSongs = await req.netease.getNewSongs(limit);
    },
    async getNewMvs() {
      this.newMvs = await req.netease.getNewMvs();
    },
    updateSId({ id }) {
      if (id) {
        this.updateSongId(+id);
      }
    },
    updateDId({ id }) {
      if (id) {
        this.$store.commit("updateDetailId", id);
        this.$router.push("/detail");
      }
    },
  },
};
</script>

<style scoped>
.home {
  margin: 0 30px;
}

.banner-img {
  width: 100%;
  height: 250px;
}

.mobile-banner-img {
  width: 77vw;
  height: 28.5vh;
}

.banner-item {
  position: relative;
}

.banner-type {
  position: absolute;
  right: 0;
  bottom: 0;
}

.item-title {
  text-align: left;
  font-size: 20px;
  font-weight: 600;
  margin-left: 10px;
}

@media screen and (max-width: 768px) {
  .home {
    margin: 0;
  }
}
</style>
