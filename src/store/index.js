import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    state: {
        toplists: [],
        username: "",
        userId: 537069044,
        detailId: 3778678,
        playlistIds: [],
        songId: 1407551413,
        singerName: "李荣浩",
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
        },
        updateTopLists: (state, payload) => {
            state.toplists = payload
        },
    },
    actions: {
        updateTopLists({ commit }, data) {
            commit("updateTopLists", data.list)
        }
    },
})