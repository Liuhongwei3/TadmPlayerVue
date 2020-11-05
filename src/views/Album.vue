<template>
  <div
    v-loading.lock="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="user-info" v-if="Object.keys(albumInfo).length !== 0">
      <el-avatar size="medium" :src="albumInfo.picUrl" v-viewer.static />
      <el-tag type="primary">{{ this.albumInfo.name }}</el-tag>
      <el-tag type="success" v-if="albumInfo.info.shareCount"
        >分享：{{ albumInfo.info.shareCount | roundW }}</el-tag
      >
      <!-- <el-tag type="warning" v-if=" albumInfo.subsCount"
        >收藏：{{ albumInfo.subsCount | roundW }}</el-tag
      > -->

      <el-tooltip
        placement="right"
        content="点击查看歌手详情"
        v-if="albumInfo.artist"
      >
        <el-tag type="success" @click="updateSinger(albumInfo.artist.id)">
          {{ this.albumInfo.artist.name }}
        </el-tag>
      </el-tooltip>
    </div>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="歌曲列表" name="first">
        <div
          v-if="isPc && songs.length !== 0"
          v-loading.lock="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-row class="row-header" type="flex" justify="center" :gutter="20">
            <el-col :span="2"></el-col>
            <el-col :span="2">
              <div class="detail-item">封面</div>
            </el-col>
            <el-col :span="6">
              <div class="detail-item">音乐标题</div>
            </el-col>
            <el-col :span="6">
              <div class="detail-item">歌手</div>
            </el-col>
            <el-col :span="6">
              <div class="detail-item">专辑</div>
            </el-col>
            <el-col :span="4">
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
            :key="item.id"
            @click.native="updateSId(item.id)"
          >
            <el-col :span="2">{{ index + 1 }}</el-col>
            <el-col :span="2">
              <el-avatar class="detail-item" :src="item.al.picUrl"></el-avatar>
            </el-col>
            <el-col :span="6">
              <div class="detail-item">{{ item.name }}</div>
            </el-col>
            <el-col :span="6">
              <div
                class="detail-item search-singer"
                v-for="items in item.ar"
                :key="items.id"
                @click="updateSinger(items.id)"
              >
                <span>{{ items.name }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="detail-item">{{ item.al.name }}</div>
            </el-col>
            <el-col :span="4">
              <div class="detail-item">
                <span style="margin-left: 10px">
                  {{ Math.floor(item.dt / 1000) | timeFormat }}
                </span>
              </div>
            </el-col>
          </el-row>
        </div>
        <no-result v-else-if="isPc && songs.length === 0"></no-result>

        <Items v-else-if="!isPc" :lists="formatSongs" @newId="updateId" />
      </el-tab-pane>

      <el-tab-pane
        name="second"
        v-loading.lock="commentsLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <div slot="label">
          <span>评论 </span>
          <span v-if="albumInfo.info"
            >({{ albumInfo.info.commentCount | roundW }})</span
          >
        </div>

        <el-tabs v-model="commActiveName" @tab-click="handleClick">
          <el-tab-pane label="精彩评论" name="comm-first">
            <comm-content v-if="hotComments.length" :comments="hotComments">
            </comm-content>
            <no-result v-else>
              <el-tag type="warning">还没有评论哟 ~ 抢个沙发！</el-tag>
            </no-result>
          </el-tab-pane>
          <el-tab-pane label="最新评论" name="comm-second">
            <comm-content v-if="comments.length" :comments="comments">
            </comm-content>
            <no-result v-else>
              <el-tag type="warning">还没有评论哟 ~ 抢个沙发！</el-tag>
            </no-result>
            <load-more-foot
              :loading="commentsLoading"
              :noMore="noMore"
            ></load-more-foot>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>

      <el-tab-pane name="third">
        <span slot="label">专辑详情</span>
        <div class="album-desc" v-if="albumInfo.description">
          <h3>专辑介绍</h3>
          <div v-html="albumInfo.description"></div>
        </div>
        <no-result v-else>
          <el-tag type="warning">暂无介绍！-_-</el-tag>
        </no-result>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

import Items from "@/components/common/items/Items";
import CommContent from "@/components/content/CommContent";
import LoadMoreFoot from "../components/content/LoadMoreFoot";
import NoResult from "@/components/common/noResult/NoResult";
import req from "@/network/req";

export default {
  name: "Album",
  components: { Items, CommContent, LoadMoreFoot, NoResult },
  data() {
    return {
      albumInfo: {},
      songs: [],
      formatSongs: [],
      hotComments: [],
      comments: [],
      loading: false,
      commentsLoading: false,
      noMore: false,
      activeName: "first",
      limit: 20,
      commActiveName: "comm-first",
    };
  },
  computed: {
    ...mapState(["isPc", "albumId"]),
  },
  created() {
    if (this.albumId) {
      this.requestAlbumDetail(this.albumId);
    }
  },
  watch: {
    albumId(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.albumInfo = {};
        this.songs = [];
        this.formatSongs = [];
        this.comments = [];
        this.hotComments = [];
        this.loading = false;
        this.requestAlbumDetail(newVal);
      }
    },
    activeName(newVal) {
      if (newVal === "second" && this.comments.length === 0) {
        this.requestAlbumComments(this.albumId, this.limit);
      }
    },
  },
  methods: {
    ...mapMutations(["updateSongId", "updateSingerId"]),
    async requestAlbumDetail(id) {
      this.loading = true;

      [this.albumInfo, this.songs] = await req.netease.getAlbumDetail(id);

      for (let v of this.songs) {
        let obj = {};
        obj.id = v.id;
        obj.name = v.name;
        obj.nickname = v.ar[0].name;
        obj.imgUrl = v.al.picUrl;
        this.formatSongs.push(obj);
      }

      this.finishReq();
    },
    async requestAlbumComments(id, limit) {
      this.loading = true;

      [this.comments, this.hotComments] = await req.netease.getAlbumComments(
        id,
        limit
      );

      this.finishReq();
    },
    finishReq() {
      this.loading = false;
      this.$nextTick(() => {
        this.$emit("refresh");
        this.$emit("toTop");
      });
    },
    handleClick() {
      this.finishReq();
    },
    updateSId(sid) {
      this.updateSongId(sid);
    },
    updateSinger(sid) {
      this.updateSingerId(sid);
      this.$router.push("/singer");
    },
    updateId({ id }) {
      if (this.activeName === "first") {
        this.updateSongId(id);
        // if (this.tempDetailId !== this.detailId) {
        //   this.updateCurDetailId(this.detailId);
        //   this.updatePlaylistIds(this.ids);
        //   this.tempDetailId = this.detailId;
        // }
      }
    },
  },
};
</script>