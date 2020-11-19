<template>
  <div class="main">
    <div
      class="all-mv-items"
      v-for="item in mvs"
      :key="item.id"
      @click="toMv(item.id)"
    >
      <div class="items-mv-img">
        <div class="abso-img"></div>
        <img
          class="mv-img"
          v-if="item.picUrl"
          v-lazy="item.picUrl"
          :alt="item.name"
        />
        <img
          class="mv-img"
          v-if="item.imgUrl"
          v-lazy="item.imgUrl"
          :alt="item.name"
        />
        <img
          class="mv-img"
          v-if="item.cover"
          v-lazy="item.cover"
          :alt="item.name"
        />
      </div>
      <div class="mv-name">{{ item.name }}</div>
      <span class="art-name" v-for="arts in item.artists" :key="arts.id">
        <span>{{ arts.name }} / </span>
      </span>
      <div class="mv-play-count" v-if="item.playCount">
        <i class="fa fa-video-camera" aria-hidden="true"></i>
        <span> {{ item.playCount | roundW }}</span>
      </div>
      <div class="mv-brief" v-if="item.copywriter">
        <span>{{ item.copywriter }}</span>
      </div>
      <div class="mv-brief" v-if="item.briefDesc">
        <span>{{ item.briefDesc }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MvContent",
  props: {
    mvs: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    toMv(id) {
      if (this.$route.path !== "/showMv") {
        this.$router.push({
          path: "/showMv",
          query: { mvId: id },
        });
      } else {
        this.$emit("newId", {
          mvId: id,
        });
      }
    },
  },
};
</script>

<style scoped>
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
  bottom: 45px;
  left: 0;
  color: #ccc;
  background-color: rgba(0, 0, 0, 0.4);
}

.mv-brief span {
  padding-left: 5px;
}

@media screen and (max-width: 768px) {
  .all-mv-items {
    width: 76vw;
    position: relative;
    margin: 5px;
  }

  .mv-img {
    width: 76vw;
    height: 150px;
  }
}
</style>
