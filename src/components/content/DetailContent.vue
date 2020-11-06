<template>
  <div>
    <div v-if="isPc && lists.length !== 0">
      <el-row class="row-header" type="flex" justify="center" :gutter="20">
        <el-col :span="1"></el-col>
        <el-col :span="2">
          <div class="detail-item">封面</div>
        </el-col>
        <el-col :span="5">
          <div class="detail-item">音乐标题</div>
        </el-col>
        <el-col :span="4">
          <div class="detail-item">歌手</div>
        </el-col>
        <el-col :span="4">
          <div class="detail-item">专辑</div>
        </el-col>
        <el-col :span="3">
          <div class="detail-item">时长</div>
        </el-col>
        <el-col :span="4">
          <div class="detail-item">发行日期</div>
        </el-col>
      </el-row>
      <el-row
        class="detail-row-items"
        type="flex"
        justify="center"
        align="middle"
        :gutter="20"
        v-for="(item, index) in lists"
        :key="parent + item.id"
        @dblclick.native="updateSong({ id: item.id })"
      >
        <el-col :span="1">
          <div>{{ index + 1 }}</div>
        </el-col>
        <el-col :span="2">
          <el-avatar
            class="detail-item"
            v-if="item.album"
            :src="item.album.picUrl"
          ></el-avatar>
        </el-col>
        <el-col :span="5">
          <div class="detail-item">{{ item.name }}</div>
        </el-col>
        <el-col :span="4">
          <div
            class="detail-item search-singer"
            v-for="art in item.artists"
            :key="art.id"
            @click="updateSinger(art.id)"
          >
            <span>{{ art.name }}</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="detail-item">{{ item.album.name }}</div>
        </el-col>
        <el-col :span="3">
          <div class="detail-item">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">
              {{ item.dt | timeFormat }}
            </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="detail-item">{{ item.publishTime | dateFormat }}</div>
        </el-col>
      </el-row>
    </div>
    <no-result v-else-if="isPc && lists.length === 0"></no-result>

    <Items v-else-if="!isPc" :lists="formatLists" @newId="updateSong" />
  </div>
</template>

<script>
import Items from "@/components/common/items/Items";
import NoResult from "@/components/common/noResult/NoResult";
import { mapState } from "vuex";

export default {
  name: "DetailContent",
  components: {
    Items,
    NoResult,
  },
  props: {
    lists: {
      type: Array,
      default: [],
    },
    parent: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapState(["isPc"]),
    formatLists() {
      let lists = Array.from(this.lists);
      for (let i = 0; i < lists.length; i++) {
        lists[i].imgUrl = this.lists[i].album.picUrl;
      }
      return lists;
    },
  },
  watch: {},
  methods: {
    updateSong({ id }) {
      this.$emit("updateSong", id);
    },
    updateSinger(id) {
      this.$emit("updateSinger", id);
    },
  },
};
</script>
