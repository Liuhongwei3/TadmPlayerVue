<template>
  <div>
    <el-button
      class="user"
      type="primary"
      v-if="ownUserId != userId || ownUserName.length === 0"
      @click="dialogVisible = true"
      >进入我的网易云
    </el-button>
    <el-dropdown
      class="user"
      v-if="ownUserId == userId && ownUserName.length !== 0"
      split-button
      type="primary"
      @command="logout"
    >
      {{ ownUserName }}
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog
      title="进入我的网易云"
      :visible.sync="dialogVisible"
      :append-to-body="true"
    >
      <span
        >输入您的网易云
        ID，您也可以直接在搜索中输入您的用户名并选择用护栏进入！</span
      ><br />
      <el-link type="primary" href="https://music.163.com" target="_blank"
        >忘记自己的 ID？点我获取网易云 ID</el-link
      >
      <el-input
        clearable
        v-model="uid"
        placeholder="请输入网易云 ID"
        @keyup.enter.native="reqUserName(uid)"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="login">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import req from "@/network/req";
import { to } from "@/utils";

export default {
  name: "LogContent",
  data() {
    return {
      uid: 0,
      dialogVisible: false,
    };
  },
  created() {
    this.uid = window.localStorage.getItem("uid");
    this.reqUserName(this.uid);
  },
  computed: {
    ...mapState(["userId"]),
    ownUserId: {
      get() {
        return this.$store.state.ownUserId;
      },
      set(val) {
        this.updateOwnUserId(val);
      },
    },
    ownUserName: {
      get() {
        return this.$store.state.ownUserName;
      },
      set(value) {
        this.updateOwnUserName(value);
      },
    },
  },
  methods: {
    ...mapMutations(["updateOwnUserId", "updateOwnUserName", "updateUserId"]),
    async reqUserName(uid) {
      if (!uid) return;
      let [err, data] = await to(req.netease.userDetail(uid));
      if (err) {
        this.$notify({
          title: "错误",
          message: "请输入正确的网易云 ID ~",
          type: "error",
        });
        this.dialogVisible = true;
        return;
      }
      let {
        data: {
          profile: { nickname },
        },
      } = data;

      this.ownUserId = uid;
      this.ownUserName = nickname;
      this.updateUserId(uid);
      this.dialogVisible = false;
      this.$notify({
        title: "成功",
        message: "成功进入我的网易云 ~",
        type: "success",
      });
      window.localStorage.setItem("uid", this.ownUserId);
    },
    login() {
      this.dialogVisible = false;
      this.uid && this.reqUserName(this.uid);
    },
    logout() {
      this.uid = "";
      this.ownUserId = "";
      window.localStorage.clear();
    },
  },
};
</script>

<style scoped>
.user {
  float: right;
  margin-right: 15px;
}
</style>
