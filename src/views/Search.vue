<template>
  <div id="search">
    <el-autocomplete
      class="searchInput"
      v-model.lazy="keyword"
      clearable
      v-model="keyword"
      :fetch-suggestions="querySearch"
      placeholder="请输入搜索关键词"
      @select="handleSelect"
      @keyup.enter.native="doSearch"
    >
      <el-select
        class="type-select"
        v-model="type"
        slot="prepend"
        placeholder="请选择"
      >
        <el-option label="歌曲" value="1"></el-option>
        <el-option label="歌词" value="2"></el-option>
        <el-option label="歌单" value="3"></el-option>
        <el-option label="歌手" value="4"></el-option>
        <el-option label="用户" value="5"></el-option>
        <el-option label="MV" value="6"></el-option>
      </el-select>
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="doSearch"
      ></el-button>
      <template slot-scope="{ item }">
        <div class="searchWord">{{ item.searchWord }}</div>
        <span class="content">{{ item.content }}</span>
      </template>
    </el-autocomplete>

    <Items
      :lists="searchResults"
      @newId="updateId"
      v-loading.lock="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    />
  </div>
</template>

<script>
import req from "@/network/req";
import { to } from "@/utils";
import Items from "@/components/common/items/Items";
import { mapState } from "vuex";

export default {
  name: "search",
  components: { Items },
  data() {
    return {
      type: "1",
      keyword: "",
      tempKeyword: "",
      hotSearchKeywords: [],
      searchResults: [],
      loading: false,
    };
  },
  computed: {
    ...mapState(["source"]),
  },
  async created() {
    let {
      data: { data },
    } = await req.netease.hotSearch();
    this.hotSearchKeywords = data;
  },
  watch: {
    source(newValue) {
      this.doSearch();
    },
    type(newValue) {
      this.doSearch();
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$emit("toTop");
    });
  },
  methods: {
    querySearch(queryString, cb) {
      let hotKeywords = this.hotSearchKeywords;
      let results = queryString
        ? hotKeywords.filter(this.createFilter(queryString))
        : hotKeywords;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (keyword) => {
        return keyword.searchWord.trim().indexOf(queryString.trim()) !== -1;
      };
    },
    handleSelect(item) {
      this.keyword = item.searchWord;
      this.doSearch();
    },
    async updateId({ id, name, nickname }) {
      switch (+this.type) {
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
          this.$store.commit("updateSingerId", id);
          this.$router.push("/singer");
          break;
        }
        case 5: {
          this.$store.commit("updateUserId", id);
          this.$router.push("/user");
          break;
        }
        case 6: {
          this.$router.push({
            path: "/showMv",
            query: { mvId: id, name, artName: nickname },
          });
          break;
        }
      }
    },
    updateKeyword(keyword) {
      this.keyword = keyword;
      this.doSearch();
    },
    async doSearch() {
      let source = this.source;
      let type = +this.type;

      if (!type) {
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
      if (this.tempKeyword === this.source + this.type + this.keyword) {
        this.$message.warning({
          showClose: true,
          message: "该关键词搜索结果已显示在下方！本次将不再搜索！",
        });
        return;
      }
      if (type !== 1 && source === "qq") {
        this.$message.warning({
          showClose: true,
          message: "QQ 数据源暂时只支持歌曲搜索！",
        });
        return;
      }

      this.loading = true;
      this.tempKeyword = this.source + this.type + this.keyword;
      switch (source) {
        case "netease": {
          this.doNetEaseSearch(type);
          break;
        }
        case "qq": {
          this.doQqSearch(type);
          break;
        }
      }
    },
    async doQqSearch(type = 1) {
      if (type === 1) {
        let [err, data] = await to(req.qq.searchMusicByQq(this.keyword));
        this.loading = false;
        if (err) {
          return;
        }
        let {
          data: {
            data: { songs },
          },
        } = data;
        let lists = [];
        for (let v of songs) {
          lists.push({
            id: v.id,
            name: v.name,
            nickname: v.artists[0].name,
            imgUrl: v.album.cover,
          });
        }
        this.searchResults = lists;
        this.loading = false;
        this.$nextTick(() => this.$bus.$emit("refresh"));
      }
    },
    doNetEaseSearch(type = 1) {
      switch (type) {
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
        case 6: {
          this.searchMvs();
          break;
        }
      }
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

        if (flag === 6) {
          obj.imgUrl = v.cover;
        }

        if (flag === 1 || flag === 2 || flag === 6) {
          obj.nickname = v.artists[0].name;
        } else if (flag === 3) {
          obj.nickname = v.creator.nickname;
          obj.imgUrl = v.coverImgUrl;
        }
        lists.push(obj);
      }
      this.searchResults = lists;
      this.loading = false;
      this.$nextTick(() => this.$bus.$emit("refresh"));
    },
    async searchSongs() {
      let {
        data: {
          result: { songs },
        },
      } = await req.netease.search(this.keyword);
      this.handleData(songs, 1);
    },
    async searchLyrics() {
      let {
        data: {
          result: { songs },
        },
      } = await req.netease.search(this.keyword, 1006);
      this.handleData(songs, 2);
    },
    async searchDetails() {
      let {
        data: {
          result: { playlists },
        },
      } = await req.netease.search(this.keyword, 1000);
      this.handleData(playlists, 3);
    },
    async searchSingers() {
      let {
        data: {
          result: { artists },
        },
      } = await req.netease.search(this.keyword, 100);
      this.handleData(artists, 4);
    },
    async searchUsers() {
      let {
        data: {
          result: { userprofiles },
        },
      } = await req.netease.search(this.keyword, 1002);
      this.handleData(userprofiles, 5);
    },
    async searchMvs() {
      let {
        data: {
          result: { mvs },
        },
      } = await req.netease.search(this.keyword, 1004);
      this.handleData(mvs, 6);
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

.type-select {
  width: 80px;
}

.searchWord {
  text-overflow: ellipsis;
  overflow: hidden;
}
.content {
  font-size: 12px;
  color: #b4b4b4;
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
    width: 70%;
  }

  .type-select {
    width: 60px;
  }
}
</style>
