export default {
  updateTopLists({ commit }, data) {
    commit("updateTopLists", data.list);
  },
};
