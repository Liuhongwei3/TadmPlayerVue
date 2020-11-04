<template>
  <div
    id="search"
    v-loading.lock="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
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
        <el-option label="专辑" value="8"></el-option>
        <el-option label="歌手" value="4"></el-option>
        <el-option label="用户" value="5"></el-option>
        <el-option label="MV" value="6"></el-option>
        <el-option label="视频" value="7"></el-option>
      </el-select>
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="doSearch"
      ></el-button>
      <template slot-scope="{ item }">
        <div class="searchWord">{{ item.searchWord }}</div>
        <span class="search-input-content">{{ item.content }}</span>
      </template>
    </el-autocomplete>

    <div v-if="searchResults.length">
      <el-tag type="success">
        已为您找到 {{ searchResults.length }} 条结果
      </el-tag>
    </div>

    <div v-if="isPc && (type == 1 || type == 2) && searchResults.length">
      <el-row class="row-header" type="flex" justify="center" :gutter="20">
        <el-col :span="1">
          <div class="detail-item"></div>
        </el-col>
        <el-col :span="8">
          <div class="detail-item">音乐标题</div>
        </el-col>
        <el-col :span="4">
          <div class="detail-item">歌手</div>
        </el-col>
        <el-col :span="6">
          <div class="detail-item">专辑</div>
        </el-col>
        <el-col :span="3" v-if="source === 'netease'">
          <div class="detail-item">时长</div>
        </el-col>
      </el-row>
      <el-row
        class="search-row-items"
        type="flex"
        justify="center"
        align="middle"
        :gutter="20"
        v-for="(item, index) in searchResults"
        :key="type + item.id"
        @dblclick.native="updateId({ id: item.id })"
      >
        <el-col :span="1">
          <div class="detail-item">{{ index + 1 }}</div>
        </el-col>
        <el-col :span="8">
          <div class="detail-item">{{ item.name }}</div>
        </el-col>
        <el-col :span="4">
          <div
            class="detail-item search-singer"
            v-for="items in item.artists"
            :key="type + items.id"
            @click="updateSinger(items.id)"
          >
            <span>{{ items.name }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="detail-item">{{ item.album.name }}</div>
        </el-col>
        <el-col :span="3" v-if="source === 'netease'">
          <div class="detail-item">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">
              {{ Math.floor(item.duration / 1000) | timeFormat }}
            </span>
          </div>
        </el-col>
      </el-row>
    </div>

    <div v-else-if="!isPc && (type == 1 || type == 2) && searchResults.length">
      <el-row
        class="row-header"
        type="flex"
        justify="center"
        align="middle"
        :gutter="20"
      >
        <el-col :span="3">
          <div class="detail-item"></div>
        </el-col>
        <el-col :span="10">
          <div class="detail-item">音乐标题</div>
        </el-col>
        <el-col :span="8">
          <div class="detail-item">歌手</div>
        </el-col>
      </el-row>
      <el-row
        class="search-row-items"
        type="flex"
        justify="center"
        align="middle"
        :gutter="20"
        v-for="(item, index) in searchResults"
        :key="type + item.id"
        @dblclick.native="updateId({ id: item.id })"
      >
        <el-col :span="3">
          <div class="detail-item">{{ index + 1 }}</div>
        </el-col>
        <el-col :span="10">
          <div class="detail-item">{{ item.name }}</div>
        </el-col>
        <el-col :span="8">
          <div
            class="detail-item search-singer"
            v-for="items in item.artists"
            :key="type + items.id"
            @click="updateSinger(items.id)"
          >
            <span>{{ items.name }}</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <video-content
      v-else-if="type == 7"
      :videos="searchResults"
      @newId="updateId"
    ></video-content>

    <Items v-else :lists="searchResults" @newId="updateId">
      <template v-slot:playCount="search">
        <div v-if="search.item.playCount">
          <i class="fa fa-video-camera" aria-hidden="true" v-if="type == 6"></i>
          <i class="fa fa-headphones" aria-hidden="true" v-else></i>
          <span>{{ search.item.playCount | roundW }}</span>
        </div>
        <div v-else-if="search.item.trackCount">
          <el-tooltip placement="bottom" content="歌曲数">
            <div>
              <i class="fa fa-list-ol" aria-hidden="true"></i>
              <span>{{ search.item.trackCount | roundW }}</span>
            </div>
          </el-tooltip>
        </div>
        <div v-else-if="search.item.albumSize">
          <el-tooltip placement="bottom" content="专辑数">
            <div>
              <i class="fa fa-list-ol" aria-hidden="true"></i>
              <span>{{ search.item.albumSize | roundW }}</span>
            </div>
          </el-tooltip>
        </div>
        <div v-else-if="search.item.gender || search.item.gender == 0">
          <i
            class="fa fa-2x fa-mars male"
            aria-hidden="true"
            v-if="search.item.gender == 1"
          ></i>
          <i
            class="fa fa-2x fa-venus female"
            aria-hidden="true"
            v-else-if="search.item.gender == 2"
          ></i>
          <span v-else>保密</span>
        </div>
      </template>
      <template v-slot:nickname="search">
        <span v-if="search.item.nickname"
          ><span>By </span>{{ search.item.nickname }}</span
        >
        <span v-if="search.item.artists">
          <span>By </span>
          <span v-for="art in search.item.artists" :key="art.id">
            {{ art.name }} /</span
          >
        </span>

        <el-tooltip placement="top" content="个人签名">
          <div v-if="search.item.signature">
            <span>{{ search.item.signature }}</span>
          </div>
        </el-tooltip>
      </template>
    </Items>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

import req from "@/network/req";
import { to } from "@/utils";
import Items from "@/components/common/items/Items";
import VideoContent from "../components/content/VideoContent";

export default {
  name: "search",
  components: { Items, VideoContent },
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
    ...mapState(["isPc", "source"]),
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
    ...mapMutations([
      "updateSongId",
      "updateUserId",
      "updateDetailId",
      "updateSingerId",
      "updateAlbumId",
    ]),
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
    async updateId({ id, name, artists }) {
      switch (+this.type) {
        case 1:
        case 2: {
          this.updateSongId(id);
          break;
        }
        case 3: {
          this.updateDetailId(id);
          this.$router.push("/detail");
          break;
        }
        case 4: {
          this.updateSinger(id);
          break;
        }
        case 5: {
          this.updateUserId(id);
          this.$router.push("/user");
          break;
        }
        case 6: {
          this.$router.push({
            path: "/showMv",
            query: { mvId: id, name, artists },
          });
          break;
        }
        case 7: {
          if (/^\d*$/.test(id)) {
            this.$router.push({
              path: "/showMv",
              query: { mvId: id, name, artists },
            });
          } else {
            this.$router.push({
              path: "/showVideo",
              query: { vid: id },
            });
          }
          break;
        }
        case 8: {
          this.updateAlbumId(id);
          this.$router.push("/album");
          break;
        }
      }
    },
    updateKeyword(keyword) {
      this.keyword = keyword;
      this.doSearch();
    },
    updateSinger(sid) {
      this.updateSingerId(sid);
      this.$router.push("/singer");
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
      this.searchResults = [];
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
            artists: v.artists,
            nickname: v.artists[0].name,
            imgUrl: v.album.cover,
            album: v.album,
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
        case 7: {
          this.searchVideos();
          break;
        }
        case 8: {
          this.searchAlbums();
        }
      }
    },
    setResults(result) {
      this.searchResults = result;
      this.loading = false;
      this.$nextTick(() => this.$bus.$emit("refresh"));
    },
    async searchSongs() {
      this.setResults(await req.netease.searchSongs(this.keyword, 1));
    },
    async searchLyrics() {
      this.setResults(await req.netease.searchSongs(this.keyword, 1006));
    },
    async searchDetails() {
      this.setResults(await req.netease.searchPlaylists(this.keyword, 1000));
    },
    async searchSingers() {
      this.setResults(await req.netease.searchArtists(this.keyword, 100));
    },
    async searchUsers() {
      this.setResults(await req.netease.searchUsers(this.keyword, 1002));
    },
    async searchMvs() {
      this.setResults(await req.netease.searchMvs(this.keyword, 1004));
    },
    async searchVideos() {
      this.setResults(await req.netease.searchVideos(this.keyword, 1014));
    },
    async searchAlbums() {
      this.setResults(await req.netease.searchAlbums(this.keyword, 10));
    },
  },
};
</script>
