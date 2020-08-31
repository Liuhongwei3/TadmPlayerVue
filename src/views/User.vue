<template>
  <div>
    <LogContent/>
    <div v-if="username.length !== 0">
      <div class="user-info">
        <el-avatar size="medium" v-if="avatarUrl" :src="avatarUrl"/>
        <el-tag type="danger">{{ username }}</el-tag>
        <span>创建的歌单</span>
      </div>
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
      <div>
        <el-tag type="danger">{{ username }}</el-tag>
        的关注
      </div>
      <div id="userFollow">
        <div class="items main" v-for="item in followList" :key="item.userId" @click="singer(item.nickname)">
          <div class="authorPlayCount"></div>
          <img v-lazy="item.avatarUrl" :key="item.avatarUrl">
          <p class="name">{{ item.nickname }}</p>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import {userFollows, userMusic} from "@/network/Request";
  import LogContent from "@/components/content/LogContent";

  export default {
    name: "User",
    components: {LogContent},
    data() {
      return {
        avatarUrl: "",
        playlist: [],
        ids: [],
        followList: []
      }
    },
    created() {
      if (this.uid) {
        this.requestUserM(this.uid);
        userFollows(this.uid).then(res => {
          this.followList = res.data.follow
        })
      }
    },
    computed: {
      uid() {
        return this.$store.state.userId
      },
      username: {
        get() {
          return this.$store.state.username
        },
        set(value) {
          this.$store.commit('updateUserName', value)
        }
      }
    },
    watch: {
      uid(newValue) {
        if (newValue) {
          newValue && this.requestUserM(newValue)
          userFollows(newValue).then(res => {
            this.followList = res.data.follow
          })
        }
      }
    },
    methods: {
      requestUserM(uid) {
        uid && userMusic(uid).then(res => {
          this.avatarUrl = res.data.playlist[0].creator.avatarUrl;
          this.username = res.data.playlist[0].creator.nickname;
          if (this.username && this.username !== this.$store.state.userName) {
            this.$store.commit('updateUserName', this.username);
          }
          this.playlist = res.data.playlist;
          for (let i = 0; i < this.playlist.length; i++) {
            this.ids[i] = this.playlist[i].id;
          }
        })
      },
      playlistId(id) {
        this.$store.commit('updateDetailId', id);
        this.$router.push('/detail');
      },
      singer(name) {
        this.$store.commit('updateSingerName', name);
        this.$router.push('/singer');
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

  .main {
    position: relative;
  }

  .items {
    margin: 10px 0;
  }

  .top {
    top: 5px;
    right: 25px;
    z-index: 9;
  }

  .bottom {
    width: 100px;
    bottom: 26px;
    z-index: 9;
  }

  @media screen and (max-width: 768px) {
    .top{
      right: -12px;
    }
    .bottom {
      bottom: 20px;
      left: -20px;
    }

    img {
      margin: 5px;
    }
  }
</style>
