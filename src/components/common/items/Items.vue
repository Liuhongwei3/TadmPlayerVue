<template>
  <div>
    <no-result :result="lists" />
    <div class="main">
      <div class="items" v-for="item in lists" :key="item.id">
        <el-tooltip
          placement="right"
          :content="`${item.name} --- ${item.nickname}`"
          v-if="item.name && item.nickname"
        >
          <div>
            <img
              v-lazy="item.imgUrl"
              :key="item.imgUrl"
              @click="updateId(item.id)"
            />
            <p class="name">
              {{ item.name }}
              <span v-if="item.name && item.nickname">---</span>
              {{ item.nickname }}
            </p>
          </div>
        </el-tooltip>
        <div v-else>
          <img
            v-lazy="item.imgUrl"
            :key="item.imgUrl"
            @click="updateId(item.id)"
          />
          <p class="name">
            {{ item.name }}
            {{ item.nickname }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NoResult from "@/components/common/noResult/NoResult";
import { listId } from "../../../network/Request";

export default {
  name: "Items",
  components: { NoResult },
  data() {
    return {};
  },
  props: {
    lists: {
      type: Array,
      default: [],
    },
  },
  methods: {
    updateId(id) {
      this.$emit("newId", id);
    },
  },
};
</script>
