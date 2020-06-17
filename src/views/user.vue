<!--
  - https://liuhongwei3.github.io Inc.
  - Name: user.vue
  - Date: 2020/1/30 下午10:36
  - Author: Tadm
  - Copyright (c) 2020 All Rights Reserved.
  -->

<template>
  <div>
	<no-result :result="username"></no-result>
	<div v-if="username.length !== 0">
	  <div><span class="title">{{ username }} </span>创建的歌单</div>
	  <div id="user">
		<div class="items" v-for="item in playlist" :key="item.id" @click="playlistId(item.id)">
		  <div class="main" :title="item.name">
			<div class="authorPlayCount">
			  <div class="top" title="播放次数">
				<i class="fa fa-headphones" aria-hidden="true"></i> {{item.playCount | roundW}}
			  </div>
			  <div class="bottom" title="歌曲数">
				<i class="fa fa-list-alt" aria-hidden="true"></i> {{item.trackCount | roundW}}
			  </div>
			</div>
			<img v-lazy="item.coverImgUrl" :key="item.coverImgUrl">
			<p class="name">{{ item.name }}</p>
		  </div>
		</div>
	  </div>
	  <div><span class="title follow">{{ username }} </span>的关注</div>
	  <div id="userFollow">
		<div class="items" v-for="item in followList" :key="item.userId" @click="singer(item.nickname)">
		  <div class="authorPlayCount"></div>
		  <img v-lazy="item.avatarUrl" :key="item.avatarUrl">
		  <p class="name">{{ item.nickname }}</p>
		</div>
	  </div>
	</div>
	<div v-else class="noId">
	  <p> 您还没有输入您的网易云ID呢！！！<br/>
		Tips: ID 就是您的网易云账号登录后链接后面的数字~<br/>
		Example: https://music.163.com/#/user/home?id=537069044 (537069044即为 ID)
	  </p>
	</div>
  </div>

</template>

<script>
  import {userFollows, userMusic} from "../network/Top";
  import NoResult from "../components/common/noResult/NoResult";

  export default {
    name: "user",
    components: {NoResult},
    data() {
      return {
        uid: 537069044,
        username: '',
        playlist: [],
        ids: [],
        followList: []
      }
    },
    created() {
      let uid = this.$store.state.userId
      this.requestUserM(uid)
      userFollows(uid).then(res => {
        this.followList = res.data.follow
      })
    },
    watch: {
      uid(newValue) {
        this.requestUserM(newValue)
        userFollows(newValue).then(res => {
          this.followList = res.data.follow
        })
      }
    },
    methods: {
      requestUserM(uid) {
        userMusic(uid).then(res => {
          this.username = res.data.playlist[0].creator.nickname
          if (this.username && this.username !== this.$store.state.userName) {
            this.$store.commit('updateUserName', this.username)
          }
          this.playlist = res.data.playlist;
          for (let i = 0; i < this.playlist.length; i++) {
            this.ids[i] = this.playlist[i].id
          }
        })
      },
      playlistId(id) {
        this.$store.commit('updatePlaylistCurrentId', id)
        this.$router.push('/detail')
      },
      singer(name) {
        this.$store.commit('updateSingerName', name)
        this.$router.push('/singer')
      }
    }
  }
</script>

<style scoped>
  #user, #userFollow {
	margin-top: 15px;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
  }

  .title {
	color: coral;
	text-align: center;
	font-size: 18px;
  }

  .main {
	position: relative;
  }

  .top, .bottom {
	position: absolute;
	height: 27px;
	color: #e6e6e6;
	font-size: 13px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
  }

  .top {
	right: 20px;
  }

  .follow {
	margin: 10px;
  }

  .noId {
	margin: 15px 0;
	color: #ff572b;
  }

  @media screen and (max-width: 768px) {
	.bottom {
	  bottom: 20px;
	}
  }
</style>
