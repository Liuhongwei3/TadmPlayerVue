<template>
  <div
    v-loading.lock="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="user-info">
      <el-avatar :src="singerInfo.picUrl"></el-avatar>
      <el-tag @click="changeSongsFlag">{{ singerInfo.name }}</el-tag>
      <el-tag type="danger">歌曲：{{ singerInfo.musicSize }}</el-tag>
      <el-tag type="warning">专辑：{{ singerInfo.albumSize }}</el-tag>
      <el-tag type="success" @click="toUser(singerInfo.accountId)"
        >去他的个人主页</el-tag
      >
    </div>
    <el-collapse class="box-card" v-if="singerInfo.briefDesc">
      <el-collapse-item class="desc" title="歌手简介">
        {{ singerInfo.briefDesc }}
      </el-collapse-item>
    </el-collapse>

    <el-tooltip placement="top" content="点击显示或隐藏详情">
      <el-tag type="info" @click="changeSongsFlag">歌手热门歌曲</el-tag>
    </el-tooltip>
    <div class="main" v-show="this.songsFlag">
      <Items :lists="filterList" @newId="songId" />
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
          :current-page="curPage"
          :page-size="pageSize"
          :page-sizes="[15, 25, 30, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </horizontal-scroll>

    <el-tooltip placement="bottom" content="点击显示或隐藏详情">
      <el-tag type="primary" @click="changeSingerFlag">热门歌手排行榜</el-tag>
    </el-tooltip>
    <div class="main" v-show="this.singerFlag">
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
    </div>
  </div>
</template>

<script>
import req from "@/network/req";
import { to } from "@/utils";
import NoResult from "@/components/common/noResult/NoResult";
import HorizontalScroll from "@/components/common/scroll/HorizontalScroll";
import Items from "@/components/common/items/Items";
import { mapMutations, mapState } from "vuex";

export default {
  name: "Singer",
  components: { NoResult, HorizontalScroll, Items },
  data() {
    return {
      singerFlag: false,
      songsFlag: true,
      singerInfo: {},
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
  },
  watch: {
    singerId(newValue) {
      if (newValue) {
        this.singerFlag = false;
        this.songsFlag = true;
        this.curPage = 1;
        this.requestSinger(newValue);
      } else {
        this.singerFlag = true;
        this.songsFlag = false;
      }
    },
    singerFlag(newValue) {
      if (newValue && this.hotSingers.length === 0) {
        this.reqHotSingers();
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
    ]),
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
        let [err, { data }] = await to(req.netease.singer(sid));
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
        this.singerInfo = data.artist;

        let lists = [];
        for (let v of data.hotSongs) {
          let obj = {};

          obj.id = v.id;
          obj.name = v.name;
          obj.imgUrl = v.al.picUrl;

          lists.push(obj);
        }
        this.musiclist = lists;

        this.loading = false;
        this.$nextTick(() => {
          this.$bus.$emit("refresh");
          this.$refs.page.refresh();
          this.$emit("toTop");
        });
      }
    },
    async reqHotSingers() {
      let {
        data: { artists },
      } = await req.netease.hotSinger();
      let lists = [];
      for (let v of artists) {
        let obj = {};
        obj.id = v.id;
        obj.name = v.name;
        obj.imgUrl = v.picUrl;
        obj.accountId = v.accountId;
        obj.albumSize = v.albumSize;
        obj.musicSize = v.musicSize;

        lists.push(obj);
      }
      this.hotSingers = lists;
      this.$nextTick(() => this.$bus.$emit("refresh"));
    },
    songId({ id }) {
      this.updateSource("netease");
      this.updateSongId(id);
    },
    searchPlayer(id, name) {
      this.singerId = id;
      this.updateSingerName(name);
    },
    changeSingerFlag() {
      this.singerFlag = !this.singerFlag;
      this.$nextTick(() => this.$bus.$emit("refresh"));
    },
    changeSongsFlag() {
      this.songsFlag = !this.songsFlag;
      this.$nextTick(() => this.$bus.$emit("refresh"));
    },
    toUser(uid) {
      this.updateUserId(uid);
      this.$router.push("/user");
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.$emit("toTop");
      this.$nextTick(() => this.$refs.page.refresh());
    },
    handleCurrentChange(val) {
      this.curPage = val;
      this.$emit("toTop");
    },
    updateId({ id, name }) {
      this.updateSingerId(id);
      this.updateSingerName(name);
    },
  },
};
</script>
