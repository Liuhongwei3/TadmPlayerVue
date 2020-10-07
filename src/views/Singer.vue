<template>
  <div
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-tag
      type="success"
      @click="changeSongsFlag"
      v-if="this.singerName.length === 0"
      >歌手热门歌曲</el-tag
    >
    <el-tooltip v-else placement="top" content="点击显示或隐藏详情">
      <el-tag @click="changeSongsFlag">{{ this.singerName }}</el-tag>
    </el-tooltip>
    <el-card shadow="hover" class="box-card" v-if="this.musiclist.length === 0">
      <div slot="header" class="clearfix">
        <span>Tips</span>
      </div>
      <no-result :result="musiclist" />
      <span>点击上方歌手名或者索您喜欢的歌手即可查看！</span>
    </el-card>
    <div v-else>
      <el-collapse class="box-card" v-if="briefDesc">
        <el-collapse-item class="desc" title="歌手简介">
          {{ this.briefDesc }}
        </el-collapse-item>
      </el-collapse>
      <el-divider></el-divider>
      <div class="main" v-show="this.songsFlag">
        <div
          class="items"
          v-for="item in filterList"
          :key="item.id"
          @click="songId(item.id)"
        >
          <el-tooltip placement="top" :content="item.al.name">
            <div>
              <img v-lazy="item.al.picUrl" :key="item.al.picUrl" />
              <p class="name">{{ item.al.name }}</p>
            </div>
          </el-tooltip>
        </div>
      </div>
      <horizontal-scroll
        v-show="this.songsFlag"
        class="page-wrapper"
        :probe-type="3"
        ref="page"
      >
        <div class="page-content">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next"
            :total="musiclist.length"
            :page-sizes="[15, 25, 30, 50, 100]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination></div
      ></horizontal-scroll>
    </div>
    <el-divider></el-divider>
    <el-tooltip placement="top" content="点击显示或隐藏详情">
      <el-tag @click="changeSingerFlag">热门歌手排行榜</el-tag>
    </el-tooltip>
    <div class="main" v-show="this.singerFlag">
      <div class="items" v-for="item in hotSingers" :key="item.id">
        <el-tooltip placement="top" content="点击查看歌手详情">
          <div>
            <img
              v-lazy="item.picUrl"
              :key="item.picUrl"
              @click.prevent="searchPlayer(item.id, item.name)"
            />
            <p>{{ item.name }}</p>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { hotSinger, searchSinger, singer } from "@/network/Request";
import { to } from "@/utils";
import NoResult from "@/components/common/noResult/NoResult";
import HorizontalScroll from "@/components/common/scroll/HorizontalScroll";
import { mapState } from "vuex";

export default {
  name: "Singer",
  components: { NoResult, HorizontalScroll },
  data() {
    return {
      singerFlag: false,
      songsFlag: true,
      singerName: "",
      briefDesc: "",
      hotSingers: [],
      musiclist: [],
      pageSize: 15,
      curPage: 1,
      loading: false,
    };
  },
  created() {
    this.singerId && this.requestSinger(this.singerId);
  },
  computed: {
    singerId: {
      get() {
        return this.$store.state.singerId;
      },
      set(val) {
        this.$store.commit("updateSingerId", val);
      },
    },
    filterList() {
      return this.musiclist.slice(
        (this.curPage - 1) * this.pageSize,
        this.pageSize * this.curPage
      );
    },
  },
  watch: {
    singerId(newValue) {
      if (newValue) {
        this.singerFlag = false;
        this.songsFlag = true;
        this.requestSinger(newValue);
      } else {
        this.singerFlag = true;
        this.songsFlag = false;
      }
    },
    singerFlag(newValue) {
      if (newValue && this.hotSingers.length === 0) {
        hotSinger().then((res) => {
          this.hotSingers = res.data.artists;
          this.$bus.$emit("refresh");
        });
      }
    },
  },
  methods: {
    async requestSinger(sid) {
      if (sid) {
        this.loading = true;
        this.$notify({
          title: "信息提示",
          message: "加载歌手详情数据中！",
          type: "info",
          offset: 50,
          duration: 1500,
        });
        let [err, { data }] = await to(singer(sid));
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
        this.singerName = data.artist.name;
        this.briefDesc = data.artist.briefDesc;
        this.musiclist = data.hotSongs;
        this.loading = false;
        this.$nextTick(() => {
          this.$bus.$emit("refresh");
          this.$refs.page.refresh();
          this.$emit("toTop");
        });
      }
    },
    songId(sid) {
      this.$store.commit("updateSongId", sid);
    },
    searchPlayer(id, name) {
      this.singerId = id;
      this.$store.commit("updateSingerName", name);
      this.singerName = name;
    },
    changeSingerFlag() {
      this.singerFlag = !this.singerFlag;
    },
    changeSongsFlag() {
      this.songsFlag = !this.songsFlag;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.$emit("toTop");
      this.$nextTick(() => this.$refs.page.refresh());
    },
    handleCurrentChange(val) {
      this.curPage = val;
      this.$emit("toTop");
      this.$nextTick(() => this.$refs.page.refresh());
    },
  },
};
</script>
