<template>
  <div
    v-loading.lock="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="user-info">
      <el-avatar size="medium" :src="detailInfo.coverImgUrl" v-viewer />
      <el-tag type="primary">
        {{ this.detailInfo.name }}
      </el-tag>
      <el-tag type="info" v-if="detailInfo.trackCount"
        >歌曲：{{ detailInfo.trackCount | roundW }}</el-tag
      >
      <el-tag type="danger" v-if="detailInfo.playCount"
        >播放：{{ detailInfo.playCount | roundW }}</el-tag
      >
      <el-tag type="success" v-if="detailInfo.shareCount"
        >分享：{{ detailInfo.shareCount | roundW }}</el-tag
      >
      <el-tag type="warning" v-if="detailInfo.subscribedCount"
        >收藏：{{ detailInfo.subscribedCount | roundW }}</el-tag
      >
      <el-tooltip
        placement="bottom"
        content="点击查看用户详情"
        v-if="detailInfo.creator && detailInfo.creator.nickname"
      >
        <el-tag type="success" @click="updateUId(detailInfo.creator.userId)">
          {{ this.detailInfo.creator.nickname }}
        </el-tag>
      </el-tooltip>
    </div>

    <el-collapse class="box-card" v-if="detailInfo.description">
      <el-collapse-item class="desc" title="歌单简介">
        {{ this.detailInfo.description }}
      </el-collapse-item>
    </el-collapse>

    <el-tag v-for="(item, index) in detailInfo.tags" :key="index">{{
      item
    }}</el-tag>
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
        <detail-content
          :lists="filterList"
          parent="detail"
          @updateSong="updateSId"
          @updateSinger="updateSinger"
        ></detail-content>

        <horizontal-scroll
          class="page-wrapper"
          :probe-type="3"
          ref="page"
          v-if="filterList.length !== 0"
        >
          <div class="page-content">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next"
              :total="ids.length"
              :current-page="curPage"
              :page-size="pageSize"
              :page-sizes="[15, 25, 30, 50, 100]"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              @prev-click="handleCurrentChange"
              @next-click="handleCurrentChange"
            >
            </el-pagination>
          </div>
        </horizontal-scroll>
      </el-tab-pane>

      <el-tab-pane
        name="second"
        v-loading.lock="commentsLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <span slot="label">评论 ({{ detailInfo.commentCount | roundW }})</span>

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

      <el-tab-pane
        name="third"
        v-loading.lock="subLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <span slot="label"
          >收藏者 ({{ detailInfo.subscribedCount | roundW }})</span
        >
        <div v-if="subscribers.length !== 0">
          <Items :lists="subscribers" @newId="updateId">
            <template v-slot:playCount="detail">
              <div v-if="detail.item.gender || detail.item.gender == 0">
                <i
                  class="fa fa-2x fa-mars male"
                  aria-hidden="true"
                  v-if="detail.item.gender == 1"
                ></i>
                <i
                  class="fa fa-2x fa-venus female"
                  aria-hidden="true"
                  v-else-if="detail.item.gender == 2"
                ></i>
                <span v-else>保密</span>
              </div>
            </template>
            <template v-slot:nickname="detail">
              <span v-if="detail.item.nickname"
                >By {{ detail.item.nickname }}</span
              >
              <el-tooltip placement="top" content="个人签名">
                <div v-if="detail.item.signature">
                  <span>{{ detail.item.signature }}</span>
                </div>
              </el-tooltip>
            </template>
          </Items>
        </div>
        <no-result v-else>
          <el-tag type="warning">暂无收藏者！</el-tag>
        </no-result>
      </el-tab-pane>

      <el-tab-pane
        label="相关推荐"
        name="fourth"
        v-loading.lock="recomLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <Items :lists="recomDetails" @newId="updateId">
          <template v-slot:nickname="detail">
            <span v-if="detail.item.creator.nickname"
              >By {{ detail.item.creator.nickname }}</span
            >
          </template>
        </Items>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import req from "@/network/req";

import DetailContent from "@/components/content/DetailContent";

import Items from "@/components/common/items/Items";
import HorizontalScroll from "@/components/common/scroll/HorizontalScroll";
import NoResult from "@/components/common/noResult/NoResult";
import CommContent from "@/components/content/CommContent";
import LoadMoreFoot from "../components/content/LoadMoreFoot";
import { mapMutations, mapState } from "vuex";

export default {
  name: "Detail",
  components: {
    DetailContent,
    Items,
    HorizontalScroll,
    NoResult,
    CommContent,
    LoadMoreFoot,
  },
  data() {
    return {
      detailInfo: {},
      tempDetailId: 0,
      songs: [],
      ids: [],
      pageSize: 15,
      curPage: 1,
      loading: false,
      commentsLoading: false,
      subLoading: false,
      activeName: "first",
      hotComments: [],
      comments: [],
      limit: 20,
      subscribers: [],
      subLimit: 20,
      noMore: false,
      commActiveName: "comm-first",
      recomDetails: [],
      recomLoading: false,
    };
  },
  created() {
    this.requestPlaylistDetail(this.detailId);
  },
  mounted() {
    this.$bus.$on("loadMoreDetail", () => {
      if (this.source === "netease") {
        if (this.activeName === "second") {
          if (this.commActiveName === "comm-second") {
            this.limit += 20;
            this.requesDetailComments(this.detailInfo.id, this.limit);
          }
        }
        // else if (this.activeName === "third") {
        //   this.subLimit += 20;
        //   this.requestDetailSubscribe(this.detailInfo.id, this.subLimit);
        // }
      }
    });
  },
  computed: {
    ...mapState(["isPc", "detailId", "source"]),
    filterList() {
      return this.songs[this.curPage] ? this.songs[this.curPage] : [];
    },
  },
  watch: {
    detailId(newValue) {
      this.songs = [];
      this.ids = [];
      this.hotComments = [];
      this.comments = [];
      this.subscribers = [];
      this.recomDetails = [];
      this.curPage = 1;
      this.activeName = "first";
      this.requestPlaylistDetail(newValue);
    },
    isPc(newValue) {
      this.updatePageSize();
    },
    activeName(newValue) {
      if (newValue === "second" && this.comments.length === 0) {
        this.requesDetailComments(this.detailInfo.id, this.limit);
      } else if (newValue === "third" && this.subscribers.length === 0) {
        this.requestDetailSubscribe(this.detailInfo.id, this.subLimit);
      } else if (newValue === "fourth" && this.subscribers.length === 0) {
        this.requestRecomDetails(this.detailInfo.id);
      }
    },
  },
  methods: {
    ...mapMutations([
      "updateSongId",
      "updatePlaylistIds",
      "updateUserId",
      "updateSingerId",
      "updateDetailId",
    ]),
    handleClick(toTop = true) {
      this.$nextTick(() => {
        this.$emit("refresh");
        this.$refs.page && this.$refs.page.refresh();
        toTop && this.$emit("toTop");
      });
    },
    async requestPlaylistDetail(pdlId) {
      this.songs = [];
      this.ids = [];

      this.loading = true;
      this.detailInfo = await req.netease.playlistdetail(pdlId);

      if (this.detailInfo.trackIds.length === 0) {
        this.loading = false;
        return;
      }

      for (let i = 0; i < this.detailInfo.trackIds.length; i++) {
        this.ids[i] = this.detailInfo.trackIds[i].id;
      }

      // 按照页码请求数据，默认进入加载第一页
      // 一方面，可以减少不必要的请求；另一方面，也解决了可能歌单歌曲数太多导致请求失败和时间过长
      this.reqIds(
        this.ids.slice(
          (this.curPage - 1) * this.pageSize,
          this.pageSize * this.curPage
        )
      );
    },
    async reqIds(ids) {
      this.loading = true;
      if (ids.length === 0) {
        this.loading = false;
        return;
      }

      let songIds = "";
      for (let id of ids) {
        songIds += id + ",";
      }
      let songs = await req.netease.musicCover(songIds.slice(0, -1));
      // 因为直接赋值数组指定索引不响应
      this.$set(this.songs, this.curPage, songs);

      this.loading = false;
      this.handleClick();
    },
    async requesDetailComments(id, limit) {
      if (this.comments.length === this.detailInfo.commentCount) {
        this.loadAll();
        return;
      }
      this.commentsLoading = true;
      let data = await req.netease.detailComment(id, limit);

      this.hotComments = data.hotComments;
      this.comments = data.comments;

      this.commentsLoading = false;
      this.handleClick(false);
    },
    async requestDetailSubscribe(id, limit) {
      if (this.subscribers.length === this.detailInfo.subscribedCount) {
        this.loadAll();
        return;
      }
      this.subLoading = true;

      this.subscribers = await req.netease.detailSubscribe(id, limit);

      this.subLoading = false;
      this.handleClick();
    },
    async requestRecomDetails(id) {
      this.recomLoading = true;
      this.recomDetails = await req.netease.getSimiDetails(id);
      this.recomLoading = false;
    },
    loadAll() {
      this.noMore = true;
    },
    updateSId(sid) {
      this.updateSongId(sid);
      if (this.tempDetailId !== this.detailId) {
        this.updatePlaylistIds(this.ids);
        this.tempDetailId = this.detailId;
      }
    },
    updatePageSize() {
      this.pageSize = this.isPc ? 15 : 6;
    },
    updateId({ id }) {
      if (this.activeName === "first") {
        this.updateSId(id);
      } else if (this.activeName === "third") {
        this.updateUId(id);
      } else if (this.activeName === "fourth") {
        this.updateDetailId(+id);
      }
    },
    updateUId(id) {
      this.updateUserId(id);
      this.$router.push("/user");
    },
    updateSinger(sid) {
      this.updateSingerId(sid);
      this.$router.push("/singer");
    },
    pageChange() {
      if (!this.songs[this.curPage]) {
        this.reqIds(
          this.ids.slice(
            (this.curPage - 1) * this.pageSize,
            this.pageSize * this.curPage
          )
        );
      }

      this.handleClick();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageChange();
    },
    handleCurrentChange(val) {
      this.curPage = val;
      this.pageChange();
    },
  },
};
</script>
