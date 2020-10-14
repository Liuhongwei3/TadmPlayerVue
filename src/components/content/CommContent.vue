<template>
  <div v-if="comments && comments.length !== 0">
    <slot></slot>
    <div class="commentItems" v-for="item in comments" :key="item.commentId">
      <el-avatar
        size="medium"
        :src="item.user.avatarUrl"
        @click="updateUserId(item.user.userId)"
      />
      <span class="commentUser" @click="updateUserId(item.user.userId)">
        {{ item.user.nickname }}:
      </span>
      <span v-html="item.content"></span>
      <span class="count">
        <i class="fa fa-heart like" aria-hidden="true"></i>
        {{ item.likedCount | roundW }}
      </span>
      <span class="comment-time">({{ item.time | dateFormat("more") }})</span>
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
.commentUser {
  color: #5aacc8;
  font-size: 18px;
}

.commentUser:hover {
  cursor: pointer;
}

.commentItems {
  text-align: left;
  margin-left: 10px;
  line-height: 36px;
}

.like {
  color: #ed959f;
}

.count {
  margin-left: 10px;
  color: #ef5476;
}

.comment-time {
  font-size: 14px;
  margin: 0 5px;
  color: rgb(214, 170, 117);
}
@media screen and (max-width: 768px) {
  .commentUser {
    font-size: 16px;
  }
  .commentItems {
    font-size: 14px;
    line-height: 36px;
  }
}
</style>
