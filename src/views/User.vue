<template>
  <div>
    <div>
      <LogContent />
    </div>
    <div v-if="username.length !== 0">
      <div class="user-info">
        <el-avatar
          size="medium"
          v-if="profile.avatarUrl"
          :src="profile.avatarUrl"
        />
        <el-tooltip placement="bottom" content="性别">
          <el-tag v-if="profile.gender === 1">男</el-tag>
          <el-tag type="danger" v-else>女</el-tag>
        </el-tooltip>
        <el-tooltip placement="bottom" content="出生日期">
          <el-tag type="info">{{ profile.birthday | dateFormat }}</el-tag>
        </el-tooltip>
        <el-tooltip placement="bottom" content="用户类别">
          <el-tag type="warning" v-if="profile.userType === 0">普通用户</el-tag>
          <el-tag type="warning" v-else-if="profile.userType === 2">
            {{ profile.allAuthTypes[0].desc }}
          </el-tag>
          <el-tag type="warning" v-else-if="profile.userType === 4">
            {{ profile.allAuthTypes[0].desc }}
          </el-tag>
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
      <el-divider></el-divider>
      <div v-if="playlist.length !== 0">
        <el-tag type="success">歌单列表</el-tag>
        <user-content
          :list="playlist"
          id="id"
          name="name"
          count="playCount"
          imgUrl="coverImgUrl"
          method="detail"
        ></user-content>
        <el-divider></el-divider>
      </div>
      <div v-if="followList.length !== 0">
        <el-tag type="primary">关注列表</el-tag>
        <user-content :list="followList"></user-content>
        <el-divider></el-divider>
      </div>
      <div v-if="fansList.length !== 0">
        <el-tag type="primary">粉丝列表</el-tag>
        <user-content :list="fansList"></user-content>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import {
  userDetail,
  userFollows,
  userMusic,
  userFans,
} from "@/network/Request";
import { to } from "@/utils";
import LogContent from "@/components/content/LogContent";
import UserContent from "@/components/content/UserContent";

export default {
  name: "User",
  components: { LogContent, UserContent },
  data() {
    return {
      profile: {},
      playlist: [],
      followList: [],
      fansList: [],
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
  },
  watch: {
    uid(newValue) {
      this.requestUserData(newValue);
    },
  },
  methods: {
    ...mapMutations(["updateUserName", "updateSingerId"]),
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
          Promise.all([
            userDetail(uid),
            userMusic(uid),
            userFollows(uid),
            userFans(uid),
          ])
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
            data: { profile },
          },
          {
            data: { playlist },
          },
          {
            data: { follow },
          },
          {
            data: { followeds },
          },
        ] = data;
        this.profile = profile;
        this.username = profile.nickname;
        this.playlist = playlist;
        this.followList = follow;
        this.fansList = followeds;
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
  },
  beforeDestroy() {
    this.$bus.$off("refresh");
  },
};
</script>
