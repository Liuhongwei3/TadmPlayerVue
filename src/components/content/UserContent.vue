<template>
  <div>
    <div class="main">
      <div
        class="items"
        v-for="item in filterList"
        :key="item[id]"
        @click="updateInfo(method, item[id], item[name])"
      >
        <el-tooltip placement="top" :content="item[name]">
          <el-badge :value="item[count] | roundW" v-if="item[count] >= 100">
            <img v-lazy="item[imgUrl]" :key="item[imgUrl]" />
            <p class="name">{{ item[name] }}</p>
          </el-badge>
          <div v-else>
            <img v-lazy="item[imgUrl]" :key="item[imgUrl]" />
            <p class="name">{{ item[name] }}</p>
          </div>
        </el-tooltip>
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
import { mapMutations } from "vuex";
import HorizontalScroll from "@/components/common/scroll/HorizontalScroll";
import { searchSinger } from "@/network/Request";

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
      default: [],
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
  mounted() {
    this.updatePageSize();
    window.addEventListener("resize", () => this.updatePageSize());
  },
  watch: {
    list(newValue) {
      newValue && this.$nextTick(() => this.$refs.page.refresh);
    },
  },
  computed: {
    filterList() {
      return this.list.slice(
        (this.curPage - 1) * this.pageSize,
        this.pageSize * this.curPage
      );
    },
  },
  methods: {
    ...mapMutations([
      "updateUserId",
      "updateUserName",
      "updateDetailId",
      "updateSingerName",
    ]),
    async updateInfo(type, id, name) {
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
      if (document.documentElement.offsetWidth <= 768) {
        this.pageSize = 6;
      } else {
        this.pageSize = 15;
      }
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
        this.$refs.page.refresh();
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
