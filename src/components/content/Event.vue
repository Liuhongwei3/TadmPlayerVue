<template>
  <div>
    <no-result v-if="list.length === 0">
      <el-tag type="warning">该用户暂无动态呢！</el-tag>
    </no-result>

    <div v-else>
      <div class="event event-row-items" v-for="item in list" :key="item.id">
        <div class="event-user">
          <el-avatar
            class="event-user-item"
            :src="item.user.avatarUrl"
            v-viewer
          ></el-avatar>
          <div class="event-user-item">
            <div>
              <span class="content-username">{{ item.user.nickname }}</span>
              <span class="event-type">{{ item.type | getEventType }}</span>
            </div>
            <div class="event-time">
              {{ item.eventTime | dateFormat("more") }}
            </div>
          </div>
        </div>

        <div class="event-content">
          <event-content :json="item.json" />
        </div>

        <div class="event-img" v-viewer>
          <img
            v-for="items in item.pics"
            :key="items.originUrl"
            v-lazy="items.originUrl"
          />
        </div>

        <div class="event-like">
          <span>{{ item.info.commentCount | roundW }}</span>
          <i class="fa fa-commenting-o comment-icon" aria-hidden="true"></i>
          <span>{{ item.info.shareCount | roundW }}</span>
          <i class="fa fa-share-square-o share-icon" aria-hidden="true"></i>
          <span>{{ item.info.likedCount | roundW }}</span>
          <i class="fa fa-thumbs-o-up like-icon" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoResult from "@/components/common/noResult/NoResult";
import EventContent from "@/components/content/EventContent";

export default {
  name: "Event",
  components: {
    NoResult,
    EventContent,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.event {
  text-align: left;
  margin: 10px;
}

.event-user,
.event-content,
.event-img {
  margin: 5px;
}

.event-user-item {
  display: inline-block;
}

.event-content {
  /* 确保加载回车 */
  white-space: pre-wrap;
}

.event-type,
.event-time {
  color: #b1b1b1;
}

.event-img img {
  width: 160px;
  height: 160px;
  margin: 5px;
  border-radius: 5px;
}

.event-like {
  display: flex;
  flex-direction: row-reverse;
  margin-right: 10px;
}

@media screen and (max-width: 768px) {
  .event {
    font-size: 14px;
  }

  .event-img img {
    width: 80px;
    height: 80px;
  }
}
</style>
