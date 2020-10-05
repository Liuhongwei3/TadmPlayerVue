<template>
  <div>
    <LogContent />
    <div v-if="username.length !== 0">
      <div class="user-info">
        <el-avatar size="medium" v-if="avatarUrl" :src="avatarUrl" />
        <span>创建的歌单</span>
      </div>
      <div class="main">
        <div
          class="items"
          v-for="item in filterList"
          :key="item.id"
          @click="playlistId(item.id)"
        >
          <el-tooltip :content="item.name" placement="top">
            <el-badge :value="item.trackCount | roundW">
              <img v-lazy="item.coverImgUrl" :key="item.coverImgUrl" />
              <p class="name">{{ item.name }}</p>
            </el-badge>
          </el-tooltip>
        </div>
      </div>
      <horizontal-scroll class="page-wrapper" :probe-type="3" ref="page">
        <div class="page-content">
          <el-pagination
            background
            hide-on-single-page
            layout="total, sizes, prev, pager, next"
            :total="playlist.length"
            :page-sizes="[15, 25, 30, 50, 100]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </horizontal-scroll>
      <div>关注的歌手</div>
      <div class="main">
        <div
          class="items"
          v-for="item in followList"
          :key="item.userId"
          @click="singer(item.nickname)"
        >
          <el-tooltip placement="top" :content="item.nickname">
            <el-badge :value="item.followeds | roundW">
              <img v-lazy="item.avatarUrl" :key="item.avatarUrl" />
              <p class="name">{{ item.nickname }}</p>
            </el-badge>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { userFollows, userMusic } from "@/network/Request";
import { to } from "@/utils";
import LogContent from "@/components/content/LogContent";
import HorizontalScroll from "@/components/common/scroll/HorizontalScroll";

export default {
  name: "User",
  components: { LogContent, HorizontalScroll },
  data() {
    return {
      avatarUrl: "",
      playlist: [],
      followList: [],
      pageSize: 15,
      curPage: 1,
    };
  },
  created() {
    this.requestUserData(this.uid);
  },
  computed: {
    ...mapState({
      uid: "userId",
    }),
    username: {
      get() {
        return this.$store.state.username;
      },
      set(value) {
        this.updateUserName(value);
      },
    },
    filterList() {
      return this.playlist.slice(
        (this.curPage - 1) * this.pageSize,
        this.pageSize * this.curPage
      );
    },
  },
  watch: {
    uid(newValue) {
      this.requestUserData(newValue);
    },
  },
  methods: {
    ...mapMutations(["updateUserName", "updateDetailId", "updateSingerName"]),
    async requestUserData(uid) {
      if (uid) {
        this.$notify({
          title: "信息提示",
          message: "加载用户数据中！",
          type: "info",
          offset: 50,
          duration: 1500,
        });
        let [err, data] = await to(
          Promise.all([userMusic(uid), userFollows(uid)])
        );
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
        let [
          {
            data: { playlist },
          },
          {
            data: { follow },
          },
        ] = data;
        this.avatarUrl = playlist[0].creator.avatarUrl;
        this.username = playlist[0].creator.nickname;
        this.playlist = playlist;
        this.followList = follow;
        this.$nextTick(() => {
          this.$bus.$emit("refresh");
          this.$refs.page.refresh();
        });
      }
    },
    playlistId(id) {
      this.updateDetailId(id);
      this.$router.push("/detail");
    },
    singer(name) {
      this.updateSingerName(name);
      this.$router.push("/singer");
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
  beforeDestroy() {
    this.$bus.$off("refresh");
  },
};
</script>
