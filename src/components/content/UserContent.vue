<template>
  <div>
    <div class="main">
      <div
        class="items"
        v-for="item in filterList"
        :key="item[id]"
        @click="updateInfo(method, item[id], item[name])"
      >
        <div class="items-img">
          <img v-lazy="item[imgUrl]" :key="item[imgUrl]" />
          <div class="play-count" v-if="item[count] !== 0">
            <i class="fa fa-user-circle-o" aria-hidden="true"></i>
            <span>{{ item[count] | roundW }}</span>
          </div>
          <p class="name">{{ item[name] }}</p>
        </div>
      </div>
    </div>
    <horizontal-scroll class="page-wrapper" :probe-type="3" ref="page">
      <div class="page-content">
        <el-pagination
          background
          hide-on-single-page
          layout="total, sizes, prev, pager, next"
          :total="list.length"
          :current-page="curPage"
          :page-size="pageSize"
          :page-sizes="[6, 15, 25, 30, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </horizontal-scroll>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import HorizontalScroll from "@/components/common/scroll/HorizontalScroll";

export default {
  name: "UserContent",
  components: { HorizontalScroll },
  data() {
    return {
      curPage: 1,
      pageSize: 15,
    };
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    id: {
      type: String,
      default: "userId",
    },
    name: {
      type: String,
      default: "nickname",
    },
    imgUrl: {
      type: String,
      default: "avatarUrl",
    },
    count: {
      type: String,
      default: "followeds",
    },
    method: {
      type: String,
      default: "user",
    },
  },
  computed: {
    ...mapState(["isPc"]),
    filterList() {
      return this.list
        ? this.list.slice(
            (this.curPage - 1) * this.pageSize,
            this.pageSize * this.curPage
          )
        : [];
    },
  },
  mounted() {
    this.updatePageSize();
  },
  watch: {
    list(newValue) {
      newValue &&
        this.$nextTick(() => {
          this.$refs.page.refresh();
          this.curPage = 1;
        });
    },
    isPc(newValue) {
      this.updatePageSize();
    },
  },
  methods: {
    ...mapMutations([
      "updateUserId",
      "updateUserName",
      "updateDetailId",
      "updateSingerName",
    ]),
    updateInfo(type, id, name) {
      switch (type) {
        case "detail": {
          this.updateDetailId(id);
          this.$router.push("/detail");
          break;
        }
        case "user": {
          this.updateUserId(id);
          this.updateUserName(name);
          break;
        }
      }
    },
    updatePageSize() {
      this.pageSize = this.isPc ? 15 : 6;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.$nextTick(() => {
        this.$bus.$emit("refresh");
        this.$refs.page.refresh();
        this.$bus.$emit("toTop");
      });
    },
    handleCurrentChange(val) {
      this.curPage = val;
      this.$nextTick(() => {
        this.$bus.$emit("refresh");
        this.$bus.$emit("toTop");
      });
    },
  },
  beforeDestroy() {
    this.$bus.$off("refresh");
    this.$bus.$off("toTop");
  },
};
</script>
