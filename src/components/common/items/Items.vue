<template>
  <div>
    <no-result v-if="lists.length === 0" />

    <div class="main" v-else>
      <el-divider></el-divider>
      <div
        class="items"
        v-for="item in lists"
        :key="item.id"
        @click="updateId(item.id, item.name, item.artists)"
      >
        <div class="items-img">
          <div class="abso-img"></div>
          <img v-lazy="item.imgUrl" :key="item.imgUrl" />
          <div class="play-count">
            <slot name="playCount" :item="item"></slot>
          </div>
          <div class="bottom">
            <slot name="updateTime" :item="item"></slot>
            <slot name="nickname" :item="item">
              <span v-if="item.artists">
                <span>By </span>
                <span v-for="art in item.artists" :key="art.id">
                  {{ art.name }} /</span
                >
              </span>
            </slot>
          </div>
        </div>
        <div class="items-name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import NoResult from "@/components/common/noResult/NoResult";

export default {
  name: "Items",
  components: { NoResult },
  props: {
    lists: {
      type: Array,
      default: [],
    },
  },
  methods: {
    updateId(id, name, artists) {
      this.$emit("newId", { id, name, artists });
    },
  },
};
</script>
