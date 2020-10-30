<template>
  <div>
    <div class="user-info">
      <el-avatar size="medium" :src="detailInfo.coverImgUrl" />
      <el-tag type="primary">
        {{ this.detailInfo.name }}
      </el-tag>
      <el-tag type="danger">歌曲：{{ detailInfo.trackCount }}</el-tag>
      <el-tag type="warning">播放：{{ detailInfo.playCount }}</el-tag>
      <el-tooltip
        placement="bottom"
        content="点击查看用户详情"
        v-if="detailInfo.creator && detailInfo.creator.nickname"
      >
        <el-tag type="success" @click="updateUId()">
          {{ this.detailInfo.creator.nickname }}
        </el-tag>
      </el-tooltip>
    </div>
    <el-collapse class="box-card" v-if="detailInfo.description">
      <el-collapse-item class="desc" title="歌单简介">
        {{ this.detailInfo.description }}
      </el-collapse-item>
    </el-collapse>

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
        class="row-items"
        type="flex"
        justify="center"
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

    <Items
      v-else-if="!isPc"
      :lists="filterFormatList"
      @newId="updateId"
      v-loading.lock="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    />

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
          :total="songs.length"
          :current-page="curPage"
          :page-size="pageSize"
          :page-sizes="[15, 25, 30, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </horizontal-scroll>
  </div>
</template>

<script>
import req from "@/network/req";
import Items from "@/components/common/items/Items";
import HorizontalScroll from "@/components/common/scroll/HorizontalScroll";
import NoResult from "@/components/common/noResult/NoResult";
import { mapMutations, mapState } from "vuex";
import { to } from "@/utils";

export default {
  name: "Detail",
  components: {
    Items,
    HorizontalScroll,
    NoResult,
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
    };
  },
  created() {
    this.requestPlaylistDetail(this.detailId);
  },
  computed: {
    ...mapState(["isPc", "detailId"]),
    filterList() {
      return this.songs
        ? this.songs.slice(
            (this.curPage - 1) * this.pageSize,
            this.pageSize * this.curPage
          )
        : [];
    },
    filterFormatList() {
      return this.formatSongs
        ? this.formatSongs.slice(
            (this.curPage - 1) * this.pageSize,
            this.pageSize * this.curPage
          )
        : [];
    },
  },
  watch: {
    detailId(newValue) {
      this.requestPlaylistDetail(newValue);
    },
    isPc(newValue) {
      this.updatePageSize();
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
    async requestPlaylistDetail(pdlId) {
      if (pdlId) {
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
          return;
        }
        let {
          data: { playlist },
        } = data;
        this.detailInfo = playlist;

        let temp = playlist.trackIds;
        if (temp.length === 0) {
          this.songs = [];
          this.formatSongs = [];
          this.ids = [];
        } else {
          let songIds = "";
          // 防止过多导致请求歌曲数据失败
          if (temp.length >= 200) {
            temp = temp.slice(0, 200);
          }
          temp.forEach((item) => {
            songIds += item.id + ",";
          });
          let last = songIds.length - 1;
          songIds = songIds.substring(0, last);

          [err, data] = await to(req.netease.musicCover(songIds));
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
          this.songs = songs;

          let formatList = [];
          for (let v of songs) {
            let obj = {};

            obj.id = v.id;
            obj.name = v.name;
            obj.nickname = v.ar[0].name;
            obj.imgUrl = v.al.picUrl;

            formatList.push(obj);
          }
          this.formatSongs = formatList;

          let ids = [];
          for (let i = 0; i < songs.length; i++) {
            ids[i] = songs[i].id;
          }
          this.ids = Array.from(ids);
        }

        this.loading = false;
        this.$nextTick(() => {
          this.$bus.$emit("refresh");
          this.$refs.page && this.$refs.page.refresh();
          this.curPage = 1;
        });
      }
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
      this.updateSId(id);
    },
    updateUId() {
      this.updateUserId(this.detailInfo.creator.userId);
      this.$router.push("/user");
    },
    updateSinger(sid) {
      this.updateSingerId(sid);
      this.$router.push("/singer");
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.$nextTick(() => {
        this.$bus.$emit("refresh");
        this.$refs.page.refresh();
        this.$emit("toTop");
      });
    },
    handleCurrentChange(val) {
      this.curPage = val;
      this.$nextTick(() => {
        this.$bus.$emit("refresh");
        this.$emit("toTop");
      });
    },
  },
  beforeDestroy() {
    this.$bus.$off("refresh");
  },
};
</script>
