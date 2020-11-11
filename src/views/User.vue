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
    <div class="user-content" v-if="userInfo.profile">
      <div class="user-info">
        <el-avatar
          size="medium"
          v-if="userInfo.profile.avatarUrl"
          :src="userInfo.profile.avatarUrl"
          v-viewer
        />
        <el-tag type="success">{{ userInfo.profile.nickname }}</el-tag>
        <el-tooltip placement="bottom" content="性别">
          <el-tag v-if="userInfo.profile.gender === 1">男</el-tag>
          <el-tag type="danger" v-else-if="userInfo.profile.gender === 2"
            >女</el-tag
          >
          <el-tag type="warning" v-else>保密</el-tag>
        </el-tooltip>
        <el-tooltip placement="bottom" content="出生日期">
          <el-tag
            type="info"
            v-if="userInfo.profile.birthday && userInfo.profile.birthday > 0"
            >{{ userInfo.profile.birthday | dateFormat }}</el-tag
          >
        </el-tooltip>
        <el-tooltip placement="bottom" content="用户等级">
          <el-tag type="danger" v-if="userInfo.level">
            Lv.{{ userInfo.level }}
          </el-tag>
        </el-tooltip>
        <el-tooltip placement="bottom" content="村龄">
          <el-tag type="primary" v-if="userInfo.createDays">
            {{ Math.round(userInfo.createDays / 365) }} 年
          </el-tag>
        </el-tooltip>
        <el-tooltip placement="bottom" content="用户类别">
          <el-tag type="warning" v-if="userInfo.profile.userType === 2">
            {{ userInfo.profile.allAuthTypes[0].desc }}
          </el-tag>
          <el-tag type="warning" v-else-if="userInfo.profile.userType === 4">
            {{ userInfo.profile.allAuthTypes[0].desc }}
          </el-tag>
          <el-tag type="warning" v-else>普通用户</el-tag>
        </el-tooltip>
        <el-tag type="primary" v-if="userInfo.profile.vipType === 11"
          >黑胶 VIP</el-tag
        >
        <el-tag
          type="success"
          v-if="userInfo.profile.artistId"
          @click="toSinger(userInfo.profile.artistId)"
          >查看歌手页</el-tag
        >
      </div>

      <el-collapse class="box-card" v-if="userInfo.profile.signature">
        <el-collapse-item class="desc" title="个人介绍">
          {{ userInfo.profile.signature }}
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
          <span slot="label"
            >关注 ({{ userInfo.profile.follows | roundW }})</span
          >
          <user-content :list="followList"></user-content>
        </el-tab-pane>

        <el-tab-pane name="fourth">
          <span slot="label"
            >动态 ({{ userInfo.profile.eventCount | roundW }})</span
          >
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
          <span slot="label"
            >粉丝 ({{ userInfo.profile.followeds | roundW }})</span
          >
          <user-content :list="fansList"></user-content>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import req from "@/network/req";
import LogContent from "@/components/content/LogContent";
import NoResult from "@/components/common/noResult/NoResult";
import UserContent from "@/components/content/UserContent";
import Event from "@/components/content/Event";

export default {
  name: "User",
  components: { LogContent, UserContent, Event, NoResult },
  data() {
    return {
      userInfo: {},
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
      if (this.userBackImg && this.userInfo.profile) {
        return {
          backgroundImage: "url(" + this.userInfo.profile.backgroundUrl + ")",
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
        this.userInfo = {};
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
      this.loading = true;
      [this.userInfo, this.playlist] = await Promise.all([
        req.netease.userDetail(uid),
        req.netease.userMusic(uid),
      ]);
      this.username = this.userInfo.profile.nickname;
      this.reqFinish();
    },
    async requestUserFollow(uid) {
      this.loading = true;
      this.followList = await req.netease.userFollows(uid);
      this.reqFinish();
    },
    async requestUserEvent() {
      this.loading = true;
      let events = await req.netease.userEvents(
        this.uid,
        this.limit,
        this.lasttime
      );
      this.eventList.push(...events);

      let last = this.eventList[this.eventList.length - 1];
      if (last) {
        this.noMore = this.lasttime === last.eventTime;
        this.lasttime = last.eventTime;
      }
      if (this.eventList.length === this.userInfo.profile.eventCount) {
        this.noMore = true;
      }

      this.loading = false;
      this.reqFinish(false);
    },
    async requestUserFan(uid) {
      this.fansList = await req.netease.userFans(uid);
      this.reqFinish();
    },
    reqFinish(toTop = true) {
      this.loading = false;
      this.handleClick(toTop);
    },
    toSinger(sid) {
      this.updateSingerId(sid);
      this.$router.push("/singer");
    },
    handleClick(toTop = true) {
      this.$nextTick(() => {
        this.$emit("refresh");
        toTop && this.$emit("toTop");
      });
    },
  },
};
</script>