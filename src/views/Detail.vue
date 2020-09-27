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
    <div class="main">
      <div
        class="items"
        v-for="(item, index) in filterList"
        :key="index"
        @click="updateSongId(item.id)"
      >
        <el-tooltip
          placement="top"
          :content="`${item.name}---${item.ar[0].name}`"
        >
          <div>
            <img v-lazy="item.al.picUrl" alt="img" />
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
    <horizontal-scroll class="page-wrapper" :probe-type="3">
      <div class="page-content">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="detailList.length"
          :page-sizes="[15, 25, 30, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination></div
    ></horizontal-scroll>
  </div>
</template>

<script>
import { playlistdetail, musicCover } from "@/network/Request";
import HorizontalScroll from "@/components/common/scroll/HorizontalScroll";

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
      detailList: [],
      playlistIds: [],
      pageSize: 15,
      curPage: 1,
    };
  },
  created() {
    let pdlId = this.$store.state.detailId;
    this.requestPlaylistDetail(pdlId);
  },
  computed: {
    filterList() {
      return this.detailList.slice(
        (this.curPage - 1) * this.pageSize,
        this.pageSize * this.curPage
      );
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$emit("toTop");
    });
  },
  methods: {
    requestPlaylistDetail(pdlId) {
      this.$notify({
        title: "信息提示",
        message: "加载歌单数据中！",
        type: "info",
      });
      playlistdetail(pdlId).then((res) => {
        let {
          data: { playlist },
        } = res;
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
        musicCover(songIds).then((res) => {
          let { data } = res;
          this.detailList = data.songs;
          for (let i = 0; i < this.detailList.length; i++) {
            this.playlistIds[i] = this.detailList[i].id;
          }
        });
      });
    },
    updateSongId(sid) {
      this.$store.commit("updateSongId", sid);
      this.$store.commit("updatePlaylistIds", this.playlistIds);
    },
    searchPlayer(player) {
      this.$store.commit("updateSingerName", player);
      this.$router.push("/singer");
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
  },
};
</script>
