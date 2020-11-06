<template>
  <div
    v-loading.lock="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="user-info">
      <el-avatar :src="singerInfo.picUrl" v-viewer.static></el-avatar>
      <el-tag>{{ singerInfo.name }}</el-tag>
      <el-tag type="danger">歌曲：{{ singerInfo.musicSize | roundW }}</el-tag>
      <el-tag type="success" @click="toUser(singerInfo.accountId)"
        >去他的个人主页</el-tag
      >
    </div>
    <el-collapse class="box-card" v-if="singerInfo.briefDesc">
      <el-collapse-item class="desc" title="歌手简介">
        {{ singerInfo.briefDesc }}
      </el-collapse-item>
    </el-collapse>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="热门歌手排行榜" name="first">
        <Items :lists="hotSingers" @newId="updateId">
          <template v-slot:playCount="singer">
            <el-tooltip placement="bottom" content="专辑数">
              <div>
                <i class="fa fa-list-ol" aria-hidden="true"></i>
                <span>{{ singer.item.albumSize | roundW }}</span>
              </div>
            </el-tooltip>
          </template>
          <template v-slot:nickname="singer">
            <el-tooltip placement="top" content="歌曲数">
              <div>
                <i class="fa fa-list-ol" aria-hidden="true"></i>
                <span>{{ singer.item.musicSize | roundW }}</span>
              </div>
            </el-tooltip>
          </template>
        </Items>
      </el-tab-pane>
      <el-tab-pane label="热门歌曲" name="second">
        <Items :lists="filterList" @newId="songId" />
        <horizontal-scroll class="page-wrapper" :probe-type="3" ref="page">
          <div class="page-content">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next"
              :total="musiclist.length"
              :current-page="curPage"
              :page-size="pageSize"
              :page-sizes="[15, 25, 30, 50, 100]"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
        </horizontal-scroll>
      </el-tab-pane>
      <el-tab-pane name="third">
        <span slot="label">专辑 ({{ singerInfo.albumSize | roundW }})</span>
        <Items :lists="albums" @newId="updateId" />
      </el-tab-pane>
      <el-tab-pane name="fourth">
        <span slot="label">MV ({{ singerInfo.mvSize | roundW }})</span>
        <Items :lists="mvs" @newId="updateId">
          <template v-slot:playCount="singer">
            <div v-if="singer.item.playCount">
              <i class="fa fa-video-camera" aria-hidden="true"></i>
              <span>{{ singer.item.playCount | roundW }}</span>
            </div>
          </template>
          <template v-slot:nickname="singer">
            <div v-if="singer.item.duration">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">
                {{ Math.floor(singer.item.duration / 1000) | timeFormat }}</span
              >
            </div>
          </template>
        </Items>
        <load-more-foot :loading="loading" :noMore="mvNoMore"></load-more-foot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import req from "@/network/req";
import { to } from "@/utils";
import NoResult from "@/components/common/noResult/NoResult";
import HorizontalScroll from "@/components/common/scroll/HorizontalScroll";
import Items from "@/components/common/items/Items";
import LoadMoreFoot from "../components/content/LoadMoreFoot";
import { mapMutations, mapState } from "vuex";

export default {
  name: "Singer",
  components: { NoResult, HorizontalScroll, Items, LoadMoreFoot },
  data() {
    return {
      hotSingers: [],
      singerInfo: {},
      musiclist: [],
      albums: [],
      mvs: [],
      pageSize: 15,
      curPage: 1,
      loading: false,
      activeName: "second",
      mvLimit: 20,
      mvNoMore: false,
    };
  },
  created() {
    this.singerId && this.requestSinger(this.singerId);
  },
  mounted() {
    this.$bus.$on("loadMoreSinger", () => {
      if (
        this.source === "netease" &&
        this.activeName === "fourth" &&
        !this.mvNoMore
      ) {
        this.requestMvs(this.singerId, (this.mvLimit += 20));
      }
    });
  },
  computed: {
    ...mapState(["source"]),
    singerId: {
      get() {
        return this.$store.state.singerId;
      },
      set(val) {
        this.updateSingerId(val);
      },
    },
    filterList() {
      return this.musiclist
        ? this.musiclist.slice(
            (this.curPage - 1) * this.pageSize,
            this.pageSize * this.curPage
          )
        : [];
    },
    ids() {
      let allIds = [];
      for (let v of this.musiclist) {
        allIds.push(v.id);
      }
      return allIds;
    },
  },
  watch: {
    singerId(newValue) {
      if (newValue) {
        this.curPage = 1;
        this.activeName = "second";
        this.singerInfo = {};
        this.musiclist = [];
        this.albums = [];
        this.mvs = [];
        this.mvLimit = 20;
        this.mvNoMore = false;
        this.requestSinger(newValue);
      }
    },
    activeName(newValue) {
      if (newValue === "first" && this.hotSingers.length === 0) {
        this.reqHotSingers();
      } else if (newValue === "third" && this.albums.length === 0) {
        this.requestAlbums(this.singerId);
      } else if (newValue === "fourth" && this.mvs.length === 0) {
        this.requestMvs(this.singerId, this.mvLimit);
      }
    },
  },
  methods: {
    ...mapMutations([
      "updateSongId",
      "updateUserId",
      "updateSingerName",
      "updateSource",
      "updateSingerId",
      "updateAlbumId",
      "updatePlaylistIds",
    ]),
    async requestSinger(sid) {
      this.loading = true;
      [this.singerInfo, this.musiclist] = await req.netease.singer(sid);
      this.finishReq();
    },
    async requestMvs(sid, limit) {
      this.loading = true;
      this.mvs = await req.netease.getSingerMvs(sid, limit);
      if (this.mvs.length === this.singerInfo.mvSize) {
        this.mvNoMore = true;
      }
      this.finishReq(false);
    },
    async requestAlbums(sid) {
      this.loading = true;
      this.albums = await req.netease.getSingerAlbums(sid);
      this.finishReq();
    },
    async reqHotSingers() {
      this.loading = true;
      this.hotSingers = await req.netease.hotSinger();
      this.finishReq();
    },
    finishReq(toTop = true) {
      this.loading = false;
      this.$nextTick(() => {
        this.handleClick(toTop);
        this.$refs.page && this.$refs.page.refresh();
      });
    },
    songId({ id }) {
      this.updateSource("netease");
      this.updatePlaylistIds(this.ids);
      this.updateSongId(id);
    },
    searchPlayer(id, name) {
      this.singerId = id;
      this.updateSingerName(name);
    },
    handleClick(toTop = true) {
      this.$nextTick(() => {
        this.$emit("refresh");
        toTop && this.$emit("toTop");
      });
    },
    toUser(uid) {
      this.updateUserId(uid);
      this.$router.push("/user");
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleClick();
      this.$nextTick(() => this.$refs.page.refresh());
    },
    handleCurrentChange(val) {
      this.curPage = val;
      this.handleClick();
    },
    updateId({ id, name, nickname }) {
      if (this.activeName === "first") {
        this.updateSingerId(id);
        this.updateSingerName(name);
      } else if (this.activeName === "third") {
        this.updateAlbumId(id);
        this.$router.push("/album");
      } else if (this.activeName === "fourth") {
        this.$router.push({
          path: "/showMv",
          query: { mvId: id, name, artName: nickname },
        });
      }
    },
  },
};
</script>
