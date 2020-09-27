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
