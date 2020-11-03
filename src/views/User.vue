<template>
  <div
    :style="useBackImg"
    v-loading.lock="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div>
      <LogContent />
    </div>
    <div class="user-content" v-if="username.length !== 0">
      <div class="user-info">
        <el-avatar
          size="medium"
          v-if="profile.avatarUrl"
          :src="profile.avatarUrl"
          v-viewer.static
        />
        <el-tag type="success">{{ profile.nickname }}</el-tag>
        <el-tooltip placement="bottom" content="性别">
          <el-tag v-if="profile.gender === 1">男</el-tag>
          <el-tag type="danger" v-else-if="profile.gender === 2">女</el-tag>
          <el-tag type="warning" v-else>保密</el-tag>
        </el-tooltip>
        <el-tooltip placement="bottom" content="出生日期">
          <el-tag type="info" v-if="profile.birthday && profile.birthday > 0">{{
            profile.birthday | dateFormat
          }}</el-tag>
        </el-tooltip>
        <el-tooltip placement="bottom" content="用户类别">
          <el-tag type="warning" v-if="profile.userType === 2">
            {{ profile.allAuthTypes[0].desc }}
          </el-tag>
          <el-tag type="warning" v-else-if="profile.userType === 4">
            {{ profile.allAuthTypes[0].desc }}
          </el-tag>
          <el-tag type="warning" v-else>普通用户</el-tag>
        </el-tooltip>
        <el-tag type="primary" v-if="profile.vipType === 11">黑胶 VIP</el-tag>
        <el-tag
          type="success"
          v-if="profile.artistId"
          @click="toSinger(profile.artistId)"
          >查看歌手页</el-tag
        >
      </div>

      <el-collapse class="box-card" v-if="profile.signature">
        <el-collapse-item class="desc" title="个人介绍">
          {{ profile.signature }}
        </el-collapse-item>
      </el-collapse>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="歌单列表" name="first">
          <user-content
            :list="playlist"
            id="id"
            name="name"
            count="playCount"
            imgUrl="coverImgUrl"
            method="detail"
          ></user-content>
        </el-tab-pane>

        <el-tab-pane name="second">
          <span slot="label">关注 ({{ profile.follows | roundW }})</span>
          <user-content :list="followList"></user-content>
        </el-tab-pane>

        <el-tab-pane name="fourth">
          <span slot="label">动态 ({{ profile.eventCount | roundW }})</span>
          <Event :list="eventList" />
          <div v-if="loading">
            <el-button type="primary">
              <i class="el-icon-loading"></i>加载中...
            </el-button>
          </div>
          <div v-if="noMore">
            <el-divider></el-divider>
            <el-button type="warning">没有更多了</el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane name="third">
          <span slot="label">粉丝 ({{ profile.followeds | roundW }})</span>
          <user-content :list="fansList"></user-content>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import req from "@/network/req";
import { to } from "@/utils";
import LogContent from "@/components/content/LogContent";
import NoResult from "@/components/common/noResult/NoResult";
import UserContent from "@/components/content/UserContent";
import Event from "./Event";

export default {
  name: "User",
  components: { LogContent, UserContent, Event, NoResult },
  data() {
    return {
      profile: {},
      playlist: [],
      followList: [],
      eventList: [],
      fansList: [],
      loading: false,
      activeName: "first",
      noMore: false,
      limit: 20,
      lasttime: -1,
    };
  },

  computed: {
    ...mapState({
      uid: "userId",
      source: "source",
      userBackImg: "userBackImg",
    }),
    username: {
      get() {
        return this.$store.state.username;
      },
      set(value) {
        this.updateUserName(value);
      },
    },
    useBackImg() {
      if (this.userBackImg) {
        return {
          backgroundImage: "url(" + this.profile.backgroundUrl + ")",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
          backgroundSize: "contain",
          backgroundAttachment: "scroll",
        };
      }
    },
  },
  created() {
    this.uid && this.requestUserPlaylist(this.uid);
  },
  mounted() {
    this.$bus.$on("loadMoreUser", () => {
      if (
        this.source === "netease" &&
        this.activeName === "fourth" &&
        !this.noMore
      ) {
        this.requestUserEvent();
      }
    });
  },
  watch: {
    uid(newValue, oldValue) {
      if (newValue != oldValue) {
        this.activeName = "first";
        this.noMore = false;
        this.playlist = [];
        this.followList = [];
        this.eventList = [];
        this.fansList = [];
        this.requestUserPlaylist(+newValue);
      }
    },
    activeName(newValue) {
      if (newValue === "second" && this.followList.length === 0) {
        this.requestUserFollow(this.uid);
      } else if (newValue === "third" && this.fansList.length === 0) {
        this.requestUserFan(this.uid);
      } else if (newValue === "fourth" && this.eventList.length === 0) {
        this.requestUserEvent();
      }
    },
  },
  methods: {
    ...mapMutations(["updateUserName", "updateSingerId"]),
    async requestUserPlaylist(uid) {
      let {
        data: { profile },
      } = await this.doReq(uid, req.netease.userDetail);
      this.profile = profile;
      this.username = profile.nickname;

      let {
        data: { playlist },
      } = await this.doReq(uid, req.netease.userMusic);
      this.playlist = playlist;

      this.reqFinish();
    },
    async requestUserFollow(uid) {
      let {
        data: { follow },
      } = await this.doReq(uid, req.netease.userFollows);
      this.followList = follow;
      this.reqFinish();
    },
    async requestUserEvent() {
      this.loading = true;
      let { data } = await req.netease.userEvents(
        this.uid,
        this.limit,
        this.lasttime
      );
      this.eventList.push(...data.events);

      let last = this.eventList[this.eventList.length - 1];
      if (last) {
        this.noMore = this.lasttime === last.eventTime;
        this.lasttime = last.eventTime;
      }
      if (this.eventList.length === this.profile.eventCount) {
        this.noMore = true;
      }

      this.loading = false;
      this.reqFinish();
    },
    async requestUserFan(uid) {
      let {
        data: { followeds },
      } = await this.doReq(uid, req.netease.userFans);
      this.fansList = followeds;
      this.reqFinish();
    },
    async doReq(uid, func) {
      if (!uid) return;
      this.loading = true;
      // this.$notify({
      //   title: "信息提示",
      //   message: "加载用户数据中！",
      //   type: "info",
      //   duration: 1500,
      // });
      let [err, data] = await to(func(uid));
      if (err) {
        this.$notify({
          title: "加载错误",
          message: err.response.statusText,
          type: "error",
          offset: 50,
          duration: 2000,
        });
      } else {
        return data;
      }
    },
    reqFinish() {
      this.loading = false;
      if (this.activeName === "fourth") {
        this.$nextTick(() => {
          this.$bus.$emit("refresh");
        });
      } else {
        this.$nextTick(() => {
          this.$bus.$emit("refresh");
          this.$emit("toTop");
        });
      }
    },
    toSinger(sid) {
      this.updateSingerId(sid);
      this.$router.push("/singer");
    },
    handleClick() {
      this.$nextTick(() => {
        this.$bus.$emit("refresh");
      });
    },
  },
  beforeDestroy() {
    this.$bus.$off("refresh");
  },
};
</script>