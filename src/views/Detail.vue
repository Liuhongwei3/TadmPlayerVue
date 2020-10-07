<template>
  <div>
    <div>
      <el-tooltip placement="top" :content="this.detailName">
        <el-tag type="primary">
          {{ this.detailName }}
        </el-tag>
      </el-tooltip>
      <el-tooltip placement="top" :content="this.detailAuthorName">
        <el-tag type="success" title="点击查看用户详情" @click="updateUserId()">
          {{ this.detailAuthorName }}
        </el-tag>
      </el-tooltip>
    </div>
    <el-collapse class="box-card" v-if="description">
      <el-collapse-item class="desc" title="歌单简介">
        {{ this.description }}
      </el-collapse-item>
    </el-collapse>

    <el-table
      v-if="isPc"
      class="detail-table"
      ref="detailTable"
      :data="filterList"
      highlight-current-row
      @current-change="handleTableCurrentChange"
      v-loading.fullscreen.lock="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-table-column label="封面">
        <template slot-scope="scope">
          <el-avatar :src="scope.row.al.picUrl"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="歌曲名"> </el-table-column>
      <el-table-column label="歌手">
        <template slot-scope="scope">
          <el-tooltip placement="top" content="点击歌手名查看歌手">
            <span @click="searchPlayer(scope.row.ar[0].name)">{{
              scope.row.ar[0].name
            }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="专辑">
        <template slot-scope="scope">
          <span>{{ scope.row.al.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">
            {{ Math.floor(scope.row.dt / 1000) | timeFormat }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="发行日期">
        <template slot-scope="scope">
          <span>{{ scope.row.publishTime | dateFormat }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div
      v-else
      class="main"
      v-loading.fullscreen.lock="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div class="items" v-for="(item, index) in filterList" :key="index">
        <el-tooltip
          placement="top"
          :content="`${item.name}---${item.ar[0].name}`"
        >
          <div>
            <img
              v-lazy="item.al.picUrl"
              alt="img"
              @click="updateSongId(item.id)"
            />
            <p class="name">
              {{ item.name }}---
              <el-tooltip placement="top" content="点击歌手名查看歌手">
                <span @click="searchPlayer(item.ar[0].name)">
                  {{ item.ar[0].name }}
                </span>
              </el-tooltip>
            </p>
          </div>
        </el-tooltip>
      </div>
    </div>

    <horizontal-scroll class="page-wrapper" :probe-type="3" ref="page">
      <div class="page-content">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="songs.length"
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
import { playlistdetail, musicCover, searchSinger } from "@/network/Request";
import HorizontalScroll from "@/components/common/scroll/HorizontalScroll";
import { mapState } from "vuex";
import { to } from "@/utils";

export default {
  name: "Detail",
  components: {
    HorizontalScroll,
  },
  data() {
    return {
      detailName: "",
      detailAuthorId: 0,
      detailAuthorName: "",
      description: "",
      songs: [],
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
      return this.songs.slice(
        (this.curPage - 1) * this.pageSize,
        this.pageSize * this.curPage
      );
    },
  },
  watch: {
    detailId(newValue) {
      this.requestPlaylistDetail(newValue);
    },
  },
  methods: {
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
        let [err, data] = await to(playlistdetail(pdlId));
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
        this.detailName = playlist.name;
        this.detailAuthorId = playlist.creator.userId;
        this.detailAuthorName = playlist.creator.nickname;
        this.description = playlist.description;

        let temp = playlist.trackIds;
        let songIds = "";
        temp.forEach((item) => {
          songIds += item.id + ",";
        });
        let last = songIds.length - 1;
        songIds = songIds.substring(0, last);

        [err, data] = await to(musicCover(songIds));
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
        let ids = [];
        for (let i = 0; i < songs.length; i++) {
          ids[i] = songs[i].id;
        }
        this.$store.commit("updatePlaylistIds", ids);

        this.loading = false;
        this.$nextTick(() => {
          this.$bus.$emit("refresh");
          this.$refs.page.refresh();
        });
      }
    },
    updateSongId(sid) {
      this.$store.commit("updateSongId", sid);
    },
    async searchPlayer(player) {
      let {
        data: {
          result: { artists },
        },
      } = await searchSinger(this.player);
      if (artists.length === 0) {
        this.$notify({
          title: "警告信息",
          message: "暂未找到该歌手的信息，本次将不进行跳转！",
          type: "warning",
        });
        return;
      }
      this.$store.commit("updateSingerId", artists[0].id);
      if (this.$route.path !== "/singer") {
        this.$router.push("/singer");
      }
    },
    updateUserId() {
      this.$store.commit("updateUserId", this.detailAuthorId);
      this.$router.push("/user");
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.$emit("toTop");
    },
    handleCurrentChange(val) {
      this.curPage = val;
      this.$emit("toTop");
    },
    handleTableCurrentChange(row) {
      this.updateSongId(row.id);
      this.$refs.detailTable.setCurrentRow(row);
    },
  },
  beforeDestroy() {
    this.$bus.$off("refresh");
  },
};
</script>
