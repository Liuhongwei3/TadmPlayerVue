<!--
  - https://liuhongwei3.github.io Inc.
  - Name: Home.vue
  - Date: 2020/1/30 上午9:46
  - Author: Tadm
  - Copyright (c) 2020 All Rights Reserved.
  -->

<template>
  <div>
	<play :cSongId="songid" :cplaylistIds="playlistIds"></play>
  </div>
</template>

<script>
  // @ is an alias to /src
  // import HelloWorld from '@/components/HelloWorld.vue'
  import Play from "./Play";

  export default {
    name: 'home',
    data() {
      return {}
    },
    computed: {
      songid() {
        return this.$store.state.songId
      },
      playlistIds() {
        return this.$store.state.playlistIds
      },
    },
    components: {
      Play
    },
    methods: {}
  }
</script>
