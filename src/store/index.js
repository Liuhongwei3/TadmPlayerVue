/*
 * https://liuhongwei3.github.io Inc.
 * Name: index.js
 * Date: 2020/1/30 上午9:46
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    songId: 1330348068,
    // songId: 558290126,
    lyrics: '',
    playlistCurrentId: 803608638,
    playlist: [],
    playlistIds: [],
    userId: 537069044,
    username: '',
    singerName: '',
  },
  getters: {
  },
  mutations: {
    updatePlaylistCurrentId(state,payload){
      state.playlistCurrentId = payload
    },
    updateSongId(state,payload){
      state.songId = payload
    },
    updatePlaylist(state,payload){
      state.playlist = payload
    },
    updatePlaylistIds(state,payload){
      state.playlistIds = payload
    },
    updateUserId(state,payload){
      state.userId = payload
    },
    updateUserName(state,payload){
      state.username = payload
    },
    updateSingerName(state,payload){
      state.singerName = payload
    },
    updateLyrics(state,payload){
      state.lyrics = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
