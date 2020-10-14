import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    state: {
        isPc: true,
        source: "netease",
        imgs: "",
        toplists: [],
        username: "",
        userId: 537069044,
        detailId: 3778678,
        playlistIds: [],
        songId: 1407551413,
        singerId: 4292,
    },
    mutations: {
        updateSource: (state, payload) => {
            state.source = payload
        },
        updateImgs: (state, payload) => {
            state.imgs = payload
        },
        updateIsPc: (state, payload) => {
            state.isPc = payload
        },
        updateDetailId: (state, payload) => {
            state.detailId = payload
        },
        updatePlaylistIds: (state, payload) => {
            state.playlistIds = payload
        },
        updateSongId: (state, payload) => {
            state.songId = payload
        },
        updateSingerId(state, payload) {
            state.singerId = payload;
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