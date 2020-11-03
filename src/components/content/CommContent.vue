<template>
  <div v-if="comments && comments.length !== 0">
    <slot></slot>
    <div class="commentItems" v-for="item in comments" :key="item.commentId">
      <el-row class="comment-row-items">
        <el-col :lg="1" :sm="2" :xs="4">
          <el-avatar
            size="medium"
            :src="item.user.avatarUrl"
            v-viewer.static
            @click="updateUserId(item.user.userId)"
          />
        </el-col>
        <el-col :lg="22" :sm="22" :xs="20">
          <div class="comment-main">
            <span
              class="content-username"
              @click="updateUserId(item.user.userId)"
              >{{ item.user.nickname }}：</span
            >
            <span class="commentContent" v-html="item.content"></span>
          </div>

          <div>
            <span class="comment-time">{{
              item.time | dateFormat("more")
            }}</span>
            <span class="comment-like">
              <i class="fa fa-thumbs-o-up like" aria-hidden="true"></i>
              <span class="count">{{ item.likedCount | roundW }}</span>
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommContent",
  props: {
    comments: {
      type: Array,
      default: [],
    },
  },
  methods: {
    updateUserId(uid) {
      if (!uid) {
        return;
      }
      this.$store.commit("updateUserId", uid);
      this.$router.push("/user").then((err) => {});
    },
  },
};
</script>

<style scoped>
.commentItems {
  text-align: left;
  margin: 20px 10px;
  line-height: 24px;
}

.comment-main {
  margin-bottom: 5px;
}

.comment-like {
  margin-left: 70%;
}

.like {
  color: #ed959f;
  margin-right: 5px;
}

.count {
  color: #ef5476;
}

.comment-time {
  font-size: 14px;
  color: rgb(214, 170, 117);
}

@media screen and (max-width: 768px) {
  .commentItems {
    font-size: 14px;
  }

  .comment-like {
    margin-left: 0;
    display: block;
  }
}
</style>
