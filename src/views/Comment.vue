<!--
  - https://liuhongwei3.github.io Inc.
  - Name: Comment.vue
  - Date: 2020/2/3 下午12:32
  - Author: Tadm
  - Copyright (c) 2020 All Rights Reserved.
  -->

<template>
  <div id="comments">
	<div class="title" @click="changeshowCloudCommentsFlag">云村热评</div>
	<div class="commentItems" v-for="item in cloudHotComments" v-show="showCloudCommentsFlag"
		 @click="updateUserId(item.simpleUserInfo.userId)">
	  <img class="userImg" :src="item.simpleUserInfo.avatar">
	  <span class="commentUser">{{ item.simpleUserInfo.nickname }}</span> :
	  <span>{{ item.content }}</span>
	  <span class="count">
		<i class="fa fa-heart like" aria-hidden="true"></i> {{ item.likedCount | roundW}}
	  </span>
	</div>
	<div id="hotComments">
	  <div class="title">精彩评论</div>
	  <div class="commentItems" v-for="item in hotComments">
		<img class="userImg" :src="item.user.avatarUrl" @click="updateUserId(item.user.userId)">
		<span class="commentUser" :title="item.user.nickname" @click="updateUserId(item.user.userId)">
		  {{ item.user.nickname }}
		</span>
		<span>: {{ item.content }}</span>
		<span class="count">
		  <i class="fa fa-heart like" aria-hidden="true"></i> {{ item.likedCount | roundW}}
		</span>
	  </div>
	</div>
  </div>
</template>

<script>
  import {cloudHotComments, songComment, songHotComment} from "../network/Top";

  export default {
    name: "Comment",
    data() {
      return {
        limit: 20,
        hotComments: [],
        showCloudCommentsFlag: false,
        comments: [],
        cloudHotComments: []
      }
    },
    created() {
      this.songId = this.$store.state.songId
      this.limit = 20
      this.requestHComments(this.songId)
      cloudHotComments().then(res => {
        this.cloudHotComments = res.data.data
      })
    },
    mounted() {
      this.$bus.$on('loadMoreComments', () => {
        this.limit += 20
        this.requestHComments(this.songId, this.limit)
      })
    },
    computed: {
      songId: {
        get() {
          return this.$store.state.songId
        },
        set(arg) {
          this.$store.state.songId = arg
        }
      }
    },
    watch: {
      songId(newValue) {
        this.requestHComments(newValue)
      }
    },
    methods: {
      requestComments(sid) {
        songComment(sid).then(res => {
          this.comments = res.data.comments
        })
      },
      requestHComments(sid, limit = 20) {
        songHotComment(sid, limit).then(res => {
          this.hotComments = res.data.hotComments
        })
      },
      changeshowCloudCommentsFlag() {
        this.showCloudCommentsFlag = !this.showCloudCommentsFlag
      },
      updateUserId(uid) {
        this.$store.commit('updateUserId', uid)
        this.showCommentsFlag = !this.showCommentsFlag
        if (this.$route.path === '/user') {
          this.$router.push('/home')
          setTimeout(() => {
            this.$router.push('/user').then(err => {
              console.log(err);
            })
          }, 350)
        } else {
          this.$router.push('/user').then(err => {
            console.log(err);
          })
        }
      }
    },
    beforeDestroy() {
      this.$bus.$off("loadMoreComments");  //当这个组件销毁的时候bus也跟着一起销毁
    }
  }
</script>

<style scoped>
  #hotComments, #comments {
	margin: 30px;
  }

  .commentUser {
	color: #ff58a6e6;
  }

  .userImg {
	width: 40px;
	height: 40px;
	border-radius: 25px;
  }

  .title {
	color: coral;
	text-align: center;
	font-size: 18px;
  }

  .commentItems {
	text-align: left;
	margin: 5px 0;
	line-height: 50px;
  }

  .commentUser {
	color: #ff58a6e6;
  }

  .like {
	color: #ed959f;
  }

  .count {
	margin-left: 10px;
	color: #ef5476;
  }

  @media screen and (max-width: 768px) {
	#hotComments, #comments {
	  margin: 5px;
	  padding: 5px;
	}

	.userImg {
	  width: 30px;
	  height: 30px;
	}

	.commentItems {
	  font-size: 14px;
	  line-height: 36px;
	}
  }
</style>
