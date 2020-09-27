<template>
  <div id="search">
    <el-input
      type="text"
      class="searchInput"
      placeholder="Please Input your search content~"
      v-model.lazy.trim="keyword"
      clearable
    >
      <el-select v-model="select" slot="prepend" placeholder="请选择">
        <el-option label="歌曲" value="1"></el-option>
        <el-option label="歌词" value="2"></el-option>
        <el-option label="歌单" value="3"></el-option>
        <el-option label="歌手" value="4"></el-option>
        <el-option label="用户" value="5"></el-option>
      </el-select>
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="doSearch"
      ></el-button>
    </el-input>
    <div id="hotSearch">
      <span
        id="hotSearchResults"
        :key="item.first"
        v-for="item in hotSearchResults"
      >
        <el-tag type="success" @click="updateKeyword(item.first)">
          {{ item.first }}
        </el-tag>
      </span>
    </div>
    <Items :lists="searchResults" @newId="updateId" />
  </div>
</template>

<script>
import {
  hotSearch,
  musicCover,
  searchMusic,
  search,
  singer,
} from "@/network/Request";
import Items from "@/components/common/items/Items";

export default {
  name: "search",
  components: { Items },
  data() {
    return {
      select: "1",
      keyword: "",
      tempKeyword: "",
      hotSearchResults: [],
      searchResults: [],
    };
  },
  created() {
    hotSearch().then((res) => {
      this.hotSearchResults = res.data.result.hots;
    });
  },
  watch: {
    select(newValue) {
      this.doSearch();
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$emit("toTop");
    });
  },
  methods: {
    async updateId(id) {
      switch (+this.select) {
        case 1:
        case 2: {
          this.$store.commit("updateSongId", id);
          break;
        }
        case 3: {
          this.$store.commit("updateDetailId", id);
          this.$router.push("/detail");
          break;
        }
        case 4: {
          let {
            data: {
              artist: { name },
            },
          } = await singer(id);
          this.$store.commit("updateSingerName", name);
          this.$router.push("/singer");
          break;
        }
        case 5: {
          this.$store.commit("updateUserId", id);
          this.$router.push("/user");
          break;
        }
      }
    },
    updateKeyword(keyword) {
      this.keyword = keyword;
      this.doSearch();
    },
    doSearch() {
      let select = +this.select;
      if (!select) {
        this.$message.warning({
          showClose: true,
          message: "请选择搜索选项！",
        });
        return;
      }
      if (!this.keyword) {
        this.$message.warning({
          showClose: true,
          message: "请输入关键词后搜索！",
        });
        this.tempKeyword = "";
        return;
      }
      if (this.tempKeyword === this.select + this.keyword) {
        this.$message.warning({
          showClose: true,
          message: "该关键词搜索结果已显示在下方！本次将不再搜索！",
        });
        return;
      }
      switch (select) {
        case 1: {
          this.searchSongs();
          break;
        }
        case 2: {
          this.searchLyrics();
          break;
        }
        case 3: {
          this.searchDetails();
          break;
        }
        case 4: {
          this.searchSingers();
          break;
        }
        case 5: {
          this.searchUsers();
          break;
        }
      }
      this.tempKeyword = this.select + this.keyword;
    },
    handleData(songs = [], flag = 1) {
      let lists = [];
      for (let v of songs) {
        let obj = {};
        if (flag === 5) {
          obj.id = v.userId;
          obj.name = v.nickname;
          obj.imgUrl = v.avatarUrl;
          lists.push(obj);
          continue;
        }
        obj.id = v.id;
        obj.name = v.name;
        if (flag === 4) {
          obj.imgUrl = v.picUrl;
          lists.push(obj);
          continue;
        }
        obj.mvid = v.mvid;
        if (flag === 1 || flag === 2) {
          obj.nickname = v.artists[0].name;
        } else if (flag === 3) {
          obj.nickname = v.creator.nickname;
          obj.imgUrl = v.coverImgUrl;
        }
        lists.push(obj);
      }
      this.searchResults = lists;
    },
    async searchSongs() {
      let {
        data: {
          result: { songs },
        },
      } = await searchMusic(this.keyword);
      this.handleData(songs, 1);
    },
    async searchLyrics() {
      let {
        data: {
          result: { songs },
        },
      } = await search(this.keyword, 1006);
      this.handleData(songs, 2);
    },
    async searchDetails() {
      let {
        data: {
          result: { playlists },
        },
      } = await search(this.keyword, 1000);
      this.handleData(playlists, 3);
    },
    async searchSingers() {
      let {
        data: {
          result: { artists },
        },
      } = await search(this.keyword, 100);
      this.handleData(artists, 4);
    },
    async searchUsers() {
      let {
        data: {
          result: { userprofiles },
        },
      } = await search(this.keyword, 1002);
      this.handleData(userprofiles, 5);
    },
  },
};
</script>

<style scoped>
#hotSearchResults {
  color: #ff572b;
}

#hotSearchResults:hover {
  cursor: pointer;
}

.searchInput {
  width: 50%;
}

.el-select {
  width: 80px;
}

@media screen and (max-width: 768px) {
  #searchResult {
    margin: 0 auto;
    padding: 0;
  }

  img {
    margin: 5px;
  }

  .searchInput {
    width: 90%;
  }
}
</style>
