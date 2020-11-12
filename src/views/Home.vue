<template>
  <div class="home">
    <el-carousel
      height="200px"
      trigger="click"
      type="card"
      :interval="5000"
      arrow="always"
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

    <div class="item-title">最新MV ></div>
    <div class="main">
      <div
        class="all-mv-items"
        v-for="item in newMvs"
        :key="item.id"
        @click="toMv(item.id, item.name, item.artists)"
      >
        <img class="mv-img" :src="item.picUrl" alt="" />
        <div class="mv-name">{{ item.name }}</div>
        <span class="art-name" v-for="arts in item.artists" :key="arts.id">
          <span>{{ arts.name }} / </span>
        </span>
        <div class="mv-play-count">
          <i class="fa fa-video-camera" aria-hidden="true"></i>
          <span> {{ item.playCount | roundW }}</span>
        </div>
        <div class="mv-brief" v-if="item.copywriter">
          {{ item.copywriter }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

import req from "@/network/req";

import Items from "@/components/common/items/Items";

export default {
  name: "Home",
  components: { Items },
  data() {
    return {
      banners: [],
      recomDetails: [],
      newSongs: [],
      newMvs: [],
      detailLimit: 14,
      songLimit: 14,
    };
  },
  async created() {
    await this.getBanners();
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
.home {
  margin: 30px;
}

.banner-img {
  height: 200px;
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

.all-mv-items {
  width: 300px;
  margin: 10px;
  position: relative;
  text-align: left;
}

.mv-img {
  width: 300px;
  height: 180px;
  border-radius: 10px;
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
  .home {
    margin: 0;
  }
}
</style>