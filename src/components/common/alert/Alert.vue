<template>
  <div id="alert" v-if="flag" class="alert fade show" role="alert">
	<a href="#" class="close" data-dismiss="alert">&times;</a>
	<slot></slot>
  </div>
</template>

<script>

  export default {
    name: "Alert",
    data() {
      return {
      }
    },
    props: {
      time: {
        type: Number,
        default: 1500
      },
      flag: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
    },
	watch:{
      flag(newValue){
        if(newValue){
          setTimeout(() => {
            this.$emit("closeAlert")
          }, this.time)
		}
	  }
	},
    methods: {}
  }
</script>

<style scoped>
  #alert {
	margin: 0 auto;
	position: absolute;
	width: 75%;
	top: 15%;
	left: 0;
	right: 0;
	z-index: 9;
  }

  @media screen and (max-width: 768px) {
	#alert {
	  width: 90%;
	}
  }
</style>
