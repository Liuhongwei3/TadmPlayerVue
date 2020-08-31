<template>
  <div>
    <el-button type="primary" v-if="username.length === 0"
               @click="dialogVisible=true">进入我的网易云
    </el-button>
    <el-dropdown class="user" v-else split-button type="primary" @command="logout">
      {{username}}
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
            title="进入我的网易云"
            :visible.sync="dialogVisible"
            :append-to-body="true"
    >
      <span>输入您的网易云 ID，您也可以直接在搜索中输入您的用户名并选择用护栏进入！</span><br/>
      <el-link type="primary" href="https://music.163.com" target="_blank">忘记自己的 ID？点我获取网易云 ID</el-link>
      <el-input v-model="userId" placeholder="请输入网易云 ID"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="login">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "LogContent",
    data() {
      return {
        userId: "",
        dialogVisible: false
      }
    },
    created() {
      this.userId = window.localStorage.getItem("uid");
    },
    computed: {
      username: {
        get() {
          return this.$store.state.username
        },
        set(value) {
          this.$store.commit('updateUserName', value)
        }
      }
    },
    methods: {
      login() {
        this.dialogVisible = false;
        if (this.userId) {
          this.$store.commit('updateUserId', this.userId);
          window.localStorage.setItem("uid", this.userId);
          this.$notify({
            title: '成功',
            message: '成功进入我的网易云 ~',
            type: 'success'
          })
        }
      },
      logout() {
        this.userId = "";
        this.username = "";
        this.$store.commit('updateUserId', "");
        this.$store.commit('updateUserName', "");
      },
    }
  }
</script>

<style scoped>
  .user {
    float: right;
    margin-right: 15px;
  }
</style>