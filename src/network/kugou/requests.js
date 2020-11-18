import doReq from "./doReq";

const toplist = async () => {
  let flag = await doReq(`/m_kugou/rank/list/index&json=true`);
  if (!flag || !flag.data) {
    return [];
  }

  let formatList = [];
  for (let v of flag.data.rank.list) {
    let obj = {};
    obj.id = v.rankid;
    obj.name = v.rankname;
    obj.imgUrl = v.imgurl.replace("{size}", "400");
    obj.updateTime = v.update_frequency;
    formatList.push(obj);
  }

  return formatList;
};

const hotDetails = async () => {
  let flag = await doReq(`/m_kugou/plist/index&json=true`);
  if (!flag || !flag.data) {
    return [];
  }

  let formatList = [];
  for (let v of flag.data.plist.list.info) {
    let obj = {};

    obj.id = v.specialid;
    obj.name = v.specialname;
    obj.nickname = v.username;
    obj.imgUrl = v.imgurl.replace("{size}", "400");
    obj.playCount = v.playcount;

    formatList.push(obj);
  }
  return formatList;
};

const getTopDetailSongs = async (id) => {
  let flag = await doReq(`/m_kugou/rank/info/?rankid=${id}&page=1&json=true`);
  if (!flag || !flag.data) {
    return [];
  }
};

const getDetailSongs = async (id) => {
  let flag = await doReq(`/m_kugou/plist/list/${id}?json=true`);
  if (!flag || !flag.data) {
    return [];
  }

  return [flag.data.info.list, flag.data.list.list.info];
};

const getSongDetail = async (id) => {
  let flag = await doReq(`/p_kugou/yy/index.php?r=play/getdata&hash=${id}`);
  if (!flag || !flag.data) {
    return [];
  }

  return flag;
};

export default {
  toplist,
  hotDetails,
  getDetailSongs,
  getSongDetail,
};
