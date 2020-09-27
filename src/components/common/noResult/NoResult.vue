<!--
  - https://liuhongwei3.github.io Inc.
  - Name: NoResult.vue
  - Date: 2020/2/14 上午11:36
  - Author: Tadm
  - Copyright (c) 2020 All Rights Reserved.
  -->

<template>
  <div id="noResult" v-show="flag">
    暂时没有任何结果~
  </div>
</template>

<script>
export default {
  name: "NoResult",
  data() {
    return {
      flag: true,
    };
  },
  props: {
    result: {
      type: Number | Array | String,
      default: 0 | [] | "",
    },
  },
  watch: {
    result(newValue) {
      this.flag = newValue.length === 0 || !newValue;
    },
  },
};
</script>

<style scoped>
#noResult {
  margin-top: 20px;
  color: #ff2730;
}
</style>
