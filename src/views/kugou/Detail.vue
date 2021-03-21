<template>
  <div v-if="Object.keys(info).length">
    <div class="user-info">
      <el-avatar
        size="medium"
        :src="info.imgurl.replace('{size}', '400')"
        v-viewer
      />
      <el-tag type="primary">{{ info.specialname }}</el-tag>
      <el-tag type="info">歌曲：{{ info.songcount | roundW }}</el-tag>
      <el-tag type="danger">播放：{{ info.playcount | roundW }}</el-tag>
      <el-tag type="success"
        >创建日期：{{ info.publishtime | dateFormat }}</el-tag
      >
      <el-tag type="warning">收藏：{{ info.collectcount | roundW }}</el-tag>
      <el-tooltip placement="bottom" content="点击查看用户详情">
        <el-tag type="success">{{ info.nickname }}</el-tag>
      </el-tooltip>
    </div>

    <el-collapse class="box-card" v-if="info.intro">
      <el-collapse-item class="desc" title="歌单简介">
        {{ info.intro }}
      </el-collapse-item>
    </el-collapse>

    <el-tag v-for="tag in info.tags" :key="tag.tagid">{{ tag.tagname }}</el-tag>

    <el-divider></el-divider>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        label="歌曲列表"
        name="first"
        v-loading.lock="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-row class="row-header" type="flex" justify="center" :gutter="20">
          <el-col :span="1"></el-col>
          <el-col :span="10">
            <div class="detail-item">音乐标题</div>
          </el-col>
          <el-col :span="6">
            <div class="detail-item">专辑</div>
          </el-col>
          <el-col :span="3">
            <div class="detail-item">时长</div>
          </el-col>
        </el-row>
        <el-row
          class="detail-row-items"
          type="flex"
          justify="center"
          align="middle"
          :gutter="20"
          v-for="(item, index) in songs"
          :key="item.hash"
          @click.native="updateSong(item.hash, item.album_id)"
        >
          <el-col :span="1">
            <div>{{ index + 1 }}</div>
          </el-col>
          <el-col :span="10">
            <div class="detail-item">{{ item.filename }}</div>
          </el-col>
          <el-col :span="6">
            <div class="detail-item" @click="toAlbum(item.album.id)">
              {{ item.remark }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="detail-item">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">
                {{ item.duration | timeFormat }}
              </span>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane
        name="second"
        v-loading.lock="commLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <span slot="label">评论 ({{ info.commentcount | roundW }})</span>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";

import req from "@/network/req";

export default {
  name: "KugouDetail",
  data() {
    return {
      info: {},
      songs: [],
      activeName: "first",
      loading: false,
      commLoading: false,
    };
  },
  created() {
    this.requestDetails(this.detailId);
  },
  watch: {
    detailId(newValue) {
      this.info = {};
      this.songs = [];
      this.requestDetails(newValue);
    },
  },
  computed: {
    ...mapState(["isPc", "detailId", "source"]),
  },
  methods: {
    handleClick() {
      this.$nextTick(() => {
        this.$emit("refresh");
      });
    },
    async updateSong(hash, album_id) {
      let data = await req.kugou.getSongDetail(hash, album_id);
    },
    async requestDetails(id) {
      this.loading = true;

      [this.info, this.songs] = await req.kugou.getDetailSongs(id);

      this.loading = false;
      this.handleClick();
    },
  },
};
</script>

<style scoped>
.kugou-detail {
  text-align: left;
}

li {
  display: block;
  margin: 10px 0;
}
</style>
