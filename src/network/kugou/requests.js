import doReq from "./doReq";

const toplist = async () => {
  let flag = await doReq(`/m_kugou/rank/list/index&json=true`);
  // let flag = await doReq(`http://m.kugou.com/rank/list/index&json=true`);

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
  let flag = await doReq(`http://m.kugou.com/plist/index&json=true`);
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

// http://mobilecdnbj.kugou.com/api/v3/rank/vol?ranktype=&plat=0&rankid=6666&page=1
const getTopDetailSongs = async (id) => {
  let flag = await doReq(`/m_kugou/rank/info/?rankid=${id}&page=1&json=true`);
  if (!flag || !flag.data) {
    return [];
  }
};

const getDetailSongs = async (id) => {
  let flag = await doReq(`http://m.kugou.com/plist/list/${id}?json=true`);
  if (!flag || !flag.data) {
    return [];
  }

  return [flag.data.info.list, flag.data.list.list.info];
};

const getSongDetail = async (id) => {
  let flag = await doReq(
    `https://www.kugou.com/yy/index.php&r=play/getdata&hash=${id}`
  );
  if (!flag || !flag.data) {
    return [];
  }

  console.log(flag.data);

  return flag;
};

const getAlbumDetail = async (id) => {
  let flag = await doReq(
    `http://mobilecdnbj.kugou.com/api/v3/album/info?albumid=${id}`
  );
  if (!flag || !flag.data) {
    return [];
  }

  return flag.data;
};

// const getSongDetail = async (hash, a_id) => {
//   // let {
//   //   data: { info },
//   // } = await searchSong(name);
//   // console.log(info[0]);

//   let flag = await doReq(
//     `/p_kugou/yy/index.php?r=play/getdata&hash=${hash}&album_id=${a_id}&_=${Date.now()}`,
//     "POST",
//     { Cookie: "kg_mid=6666" }
//   );

//   if (!flag || !flag.data) {
//     return [];
//   }

//   console.log(flag.data);

//   return flag.data;
// };

const searchSong = async (keyword, pagesize = 1, page = 1) => {
  let flag = await doReq(
    `http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=${keyword}&page=${page}&pagesize=${pagesize}&showtype=1`
  );
  if (!flag || !flag.data) {
    return {};
  }

  return flag.data;
};

export default {
  toplist,
  hotDetails,
  getDetailSongs,
  getSongDetail,
  getAlbumDetail,
};
