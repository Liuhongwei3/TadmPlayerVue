<template>
  <div class="back-top" @click="topClick">
    <i class="fa fa-arrow-up fa-2x" aria-hidden="true"></i>
  </div>
</template>

<script>
export default {
  name: "BackTop",
  methods: {
    topClick: function() {
      this.$emit("backTop");
    },
  },
};
</script>

<style scoped>
.backTop {
  position: fixed;
  right: 2vw;
  bottom: 20%;
  color: rgba(5, 124, 190, 0.87);
  background-color: #9d9b9b;
  padding: 10px;
  border-radius: 50%;
  animation: show 0.5s;
}
</style>
