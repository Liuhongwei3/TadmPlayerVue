<template>
  <div>
    <el-tag type="danger">热门歌单</el-tag>
    <el-tag type="info">放松心情</el-tag>
    <el-tag type="success">动感节奏</el-tag>
    <el-tag type="primary">轻松纯音乐</el-tag>
    <div id="hotDetail">
      <div
        class="main"
        v-for="item in hotDetailLists"
        :key="item.id"
        @click="updateDetailId(item.id)"
      >
        <el-tooltip
          placement="right"
          :content="`${item.name}---${item.creator.nickname}`"
        >
          <div>
            <el-badge :value="item.playCount | roundW">
              <!-- <div class="top">
              <i class="fa fa-headphones" aria-hidden="true"></i>
              {{ item.playCount | roundW }}
            </div> -->
              <div class="bottom">
                By
                <span>{{ item.creator.nickname }}</span>
              </div>
              <img v-lazy="item.coverImgUrl" :key="item.coverImgUrl" />
              <p class="name">{{ item.name }}</p>
            </el-badge>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { hotDetails } from "@/network/Request";

export default {
  name: "hotDetail",
  data() {
    return {
      hotDetailLists: [],
      limit: 24,
    };
  },
  created() {
    this.requestHotDetails(this.limit);
  },
  mounted() {
    this.$bus.$on("loadMoreHotDetails", () => {
      if (this.limit <= 100) {
        this.limit += 24;
        this.requestHotDetails(this.limit);
      }
    });
  },
  methods: {
    requestHotDetails(limit) {
      hotDetails(limit).then((res) => {
        if (res.data.code === 200) {
          this.hotDetailLists = res.data.playlists;
        } else {
          console.log("There is some errors~");
        }
      });
    },
    updateDetailId(id) {
      this.$store.commit("updateDetailId", id);
      this.$router.push("/detail");
    },
  },
  beforeDestroy() {
    this.$bus.$off("loadMoreHotDetails"); //当这个组件销毁的时候bus也跟着一起销毁
  },
};
</script>

<style scoped>
#hotDetail {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  justify-content: space-around;
}

.main {
  position: relative;
  text-align: center;
  margin: 10px 0;
}

.bottom {
  bottom: 32px;
  left: 15px;
}

@media screen and (max-width: 768px) {
  .bottom {
    bottom: 25px;
  }

  img {
    margin: 5px;
  }
}
</style>
