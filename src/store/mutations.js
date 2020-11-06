export default {
  updateSource: (state, payload) => {
    state.source = payload;
  },
  updateImgs: (state, payload) => {
    state.imgs = payload;
  },
  updateIsPc: (state, payload) => {
    state.isPc = payload;
  },
  updateDetailId: (state, payload) => {
    state.detailId = payload;
  },
  updateAlbumId: (state, payload) => {
    state.albumId = payload;
  },
  updatePlaylistIds: (state, payload) => {
    state.playlistIds = payload;
  },
  updateHistoryLists: (state, payload) => {
    if (!payload || payload.length === 0) {
      state.historyLists = [];
      return;
    }
    for (let pay of payload) {
      for (let i = 0; i < state.historyLists.length; i++) {
        if (pay.id === state.historyLists[i].id) {
          state.historyLists.splice(i, 1);
          break;
        }
      }
      state.historyLists.unshift(pay);
    }
  },
  updateSongId: (state, payload) => {
    state.songId = payload;
  },
  updateSingerId(state, payload) {
    state.singerId = payload;
  },
  updateSingerName(state, payload) {
    state.singerName = payload;
  },
  updateUserId: (state, payload) => {
    state.userId = payload;
  },
  updateOwnUserId: (state, payload) => {
    state.ownUserId = payload;
  },
  updateOwnUserName: (state, payload) => {
    state.ownUserName = payload;
  },
  updateUserName: (state, payload) => {
    state.username = payload;
  },
  updateUserBackImg: (state, payload) => {
    state.userBackImg = payload;
  },
  updateTopLists: (state, payload) => {
    state.toplists = payload;
  },
};
