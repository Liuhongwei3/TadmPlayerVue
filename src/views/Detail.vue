<template>
  <div
    v-loading.lock="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="user-info">
      <el-avatar size="medium" :src="detailInfo.coverImgUrl" v-viewer.static />
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

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="歌曲列表" name="first">
        <div
          v-if="isPc && filterList.length !== 0"
          v-loading.lock="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-tag v-for="(item, index) in detailInfo.tags" :key="index">{{
            item
          }}</el-tag>
          <el-divider></el-divider>
          <el-row class="row-header" type="flex" justify="center" :gutter="20">
            <el-col :span="2">
              <div class="detail-item">封面</div>
            </el-col>
            <el-col :span="6">
              <div class="detail-item">音乐标题</div>
            </el-col>
            <el-col :span="4">
              <div class="detail-item">歌手</div>
            </el-col>
            <el-col :span="5">
              <div class="detail-item">专辑</div>
            </el-col>
            <el-col :span="2">
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
            v-for="item in filterList"
            :key="item.id"
            @click.native="updateSId(item.id)"
          >
            <el-col :span="2">
              <el-avatar class="detail-item" :src="item.al.picUrl"></el-avatar>
            </el-col>
            <el-col :span="6">
              <div class="detail-item">{{ item.name }}</div>
            </el-col>
            <el-col :span="4">
              <div
                class="detail-item search-singer"
                v-for="items in item.ar"
                :key="items.id"
                @click="updateSinger(items.id)"
              >
                <span>{{ items.name }}</span>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="detail-item">{{ item.al.name }}</div>
            </el-col>
            <el-col :span="2">
              <div class="detail-item">
                <!-- <i class="el-icon-time"></i> -->
                <span style="margin-left: 10px">
                  {{ Math.floor(item.dt / 1000) | timeFormat }}
                </span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="detail-item">{{ item.publishTime | dateFormat }}</div>
            </el-col>
          </el-row>
        </div>
        <no-result v-else-if="isPc && filterList.length === 0"></no-result>

        <Items v-else-if="!isPc" :lists="filterFormatList" @newId="updateId" />

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
        <div v-if="comments.length !== 0">
          <CommContent :comments="comments">
            <el-tag type="success">最新评论</el-tag>
          </CommContent>
          <div v-if="commentsLoading">
            <el-divider></el-divider>
            <el-button type="primary">
              <i class="el-icon-loading"></i>加载中...
            </el-button>
          </div>
          <div v-if="noMore">
            <el-divider></el-divider>
            <el-button type="warning">没有更多了</el-button>
          </div>
        </div>
        <no-result v-else>
          <el-tag type="warning">还没有评论哟 ~ 抢个沙发！</el-tag>
        </no-result>
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
    </el-tabs>
  </div>
</template>

<script>
import req from "@/network/req";
import Items from "@/components/common/items/Items";
import HorizontalScroll from "@/components/common/scroll/HorizontalScroll";
import NoResult from "@/components/common/noResult/NoResult";
import CommContent from "@/components/content/CommContent";
import { mapMutations, mapState } from "vuex";
import { to } from "@/utils";

export default {
  name: "Detail",
  components: {
    Items,
    HorizontalScroll,
    NoResult,
    CommContent,
  },
  data() {
    return {
      detailInfo: {},
      tempDetailId: 0,
      songs: [],
      formatSongs: [],
      ids: [],
      pageSize: 15,
      curPage: 1,
      loading: false,
      commentsLoading: false,
      subLoading: false,
      activeName: "first",
      comments: [],
      limit: 20,
      subscribers: [],
      subLimit: 20,
      noMore: false,
    };
  },
  created() {
    this.requestPlaylistDetail(this.detailId);
  },
  mounted() {
    this.$bus.$on("loadMoreDetail", () => {
      if (this.source === "netease") {
        if (this.activeName === "second") {
          this.limit += 20;
          this.requesDetailComments(this.detailInfo.id, this.limit);
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
    filterFormatList() {
      return this.formatSongs[this.curPage]
        ? this.formatSongs[this.curPage]
        : [];
    },
  },
  watch: {
    detailId(newValue) {
      this.songs = [];
      this.formatSongs = [];
      this.ids = [];
      this.comments = [];
      this.subscribers = [];
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
      }
    },
  },
  methods: {
    ...mapMutations([
      "updateSongId",
      "updateCurDetailId",
      "updatePlaylistIds",
      "updateUserId",
      "updateSingerId",
    ]),
    handleClick(tab, event) {
      this.$nextTick(() => {
        this.$bus.$emit("refresh");
      });
    },
    async requestPlaylistDetail(pdlId) {
      if (pdlId) {
        this.songs = [];
        this.formatSongs = [];
        this.ids = [];

        this.loading = true;
        this.$notify({
          title: "信息提示",
          message: "加载歌单数据中！",
          type: "info",
          offset: 50,
          duration: 1500,
        });
        let [err, data] = await to(req.netease.playlistdetail(pdlId));
        if (err) {
          this.$notify({
            title: "加载错误",
            message: err.response.statusText,
            type: "error",
            offset: 50,
            duration: 2000,
          });
          this.loading = false;
          return;
        }
        let {
          data: { playlist },
        } = data;
        this.detailInfo = playlist;

        if (playlist.trackIds.length === 0) {
          this.loading = false;
          return;
        }

        for (let i = 0; i < playlist.trackIds.length; i++) {
          this.ids[i] = playlist.trackIds[i].id;
        }

        // 按照页码请求数据，默认进入加载第一页
        // 一方面，可以减少不必要的请求；另一方面，也解决了可能歌单歌曲数太多导致请求失败和时间过长
        this.reqIds(
          this.ids.slice(
            (this.curPage - 1) * this.pageSize,
            this.pageSize * this.curPage
          )
        );
      }
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
      let [err, data] = await to(req.netease.musicCover(songIds.slice(0, -1)));
      if (err) {
        this.$notify({
          title: "加载错误",
          message: err.response.statusText,
          type: "error",
          offset: 50,
          duration: 2000,
        });
        return;
      }
      let {
        data: { songs },
      } = data;
      // 因为直接赋值数组指定索引不响应
      this.$set(this.songs, this.curPage, songs);

      let formatList = [];
      for (let v of songs) {
        let obj = {};

        obj.id = v.id;
        obj.name = v.name;
        obj.nickname = v.ar[0].name;
        obj.imgUrl = v.al.picUrl;

        formatList.push(obj);
      }
      this.$set(this.formatSongs, this.curPage, formatList);

      this.loading = false;
      this.$nextTick(() => {
        this.$bus.$emit("refresh");
        this.$refs.page && this.$refs.page.refresh();
      });
    },
    async requesDetailComments(id, limit) {
      if (this.comments.length === this.detailInfo.commentCount) {
        this.loadAll();
        return;
      }
      this.commentsLoading = true;
      let {
        data: { comments },
      } = await req.netease.detailComment(id, limit);
      this.comments = comments;
      this.commentsLoading = false;
      this.$nextTick(() => {
        this.$bus.$emit("refresh");
      });
    },
    async requestDetailSubscribe(id, limit) {
      if (this.subscribers.length === this.detailInfo.subscribedCount) {
        this.loadAll();
        return;
      }
      this.subLoading = true;
      let {
        data: { subscribers },
      } = await req.netease.detailSubscribe(id, limit);

      for (let v of subscribers) {
        let obj = {};

        obj.id = v.userId;
        obj.name = v.nickname;
        obj.signature = v.signature;
        obj.gender = v.gender;
        obj.imgUrl = v.avatarUrl;

        this.subscribers.push(obj);
      }

      this.subLoading = false;
      this.$nextTick(() => {
        this.$bus.$emit("refresh");
      });
    },
    loadAll() {
      this.noMore = true;
    },
    updateSId(sid) {
      this.updateSongId(sid);
      if (this.tempDetailId !== this.detailId) {
        this.updateCurDetailId(this.detailId);
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

      this.$nextTick(() => {
        this.$bus.$emit("refresh");
        this.$refs.page && this.$refs.page.refresh();
        this.$emit("toTop");
      });
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
  beforeDestroy() {
    this.$bus.$off("refresh");
  },
};
</script>
