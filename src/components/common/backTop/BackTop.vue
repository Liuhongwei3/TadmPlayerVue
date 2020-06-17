<template>
  <div class="back-top" @click="topClick">
	<slot></slot>
  </div>
</template>

<script>
  export default {
    name: "BackTop",
    methods: {
      topClick: function () {
        this.$emit('backTop');
      }
    }
  }
</script>

<style scoped>
</style>
