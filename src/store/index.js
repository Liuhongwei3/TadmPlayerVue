import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        username: "",
        userId: 537069044,
        detailId: 3778678,
        playlistIds: [],
        songId: 1332153723,
        singerName: "",
    },
    mutations: {
        updateDetailId: (state, payload) => {
            state.detailId = payload
        },
        updatePlaylistIds: (state, payload) => {
            state.playlistIds = payload
        },
        updateSongId: (state, payload) => {
            state.songId = payload
        },
        updateSingerName(state, payload) {
            state.singerName = payload
        },
        updateUserId: (state, payload) => {
            state.userId = payload
        },
        updateUserName: (state, payload) => {
            state.username = payload
        }
    },
    actions: {},
    modules: {}
})