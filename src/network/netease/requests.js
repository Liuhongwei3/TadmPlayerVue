/*
 * https://liuhongwei3.github.io Inc.
 * Name: Request.js
 * Date: 2020/1/30 上午9:57
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import { request } from "./index";
import doReq from "./doReq";

const toplist = async () => {
  let flag = await doReq(`/toplist`);
  if (!flag) {
    return [];
  }

  let formatList = [];
  for (let v of flag.data.list) {
    let obj = {};
    obj.id = v.id;
    obj.name = v.name;
    obj.imgUrl = v.coverImgUrl;
    obj.playCount = v.playCount;
    obj.updateTime = v.updateTime;
    formatList.push(obj);
  }

  return formatList;
};

const hotDetails = async (limit = 24) => {
  let flag = await doReq(`/top/playlist?limit=${limit}`);
  if (!flag) {
    return [];
  }

  let {
    data: { playlists },
  } = flag;

  let formatList = [];
  for (let v of playlists) {
    let obj = {};

    obj.id = v.id;
    obj.name = v.name;
    obj.nickname = v.creator.nickname;
    obj.imgUrl = v.coverImgUrl;
    obj.playCount = v.playCount;

    formatList.push(obj);
  }
  return formatList;
};

const listId = (idx) => {
  return request({
    url: "/top/list?idx=" + idx,
  });
};

const checkMusic = (id) => {
  return request({
    url: "/check/music?id=" + id,
  });
};

const musicUrl = async (id) => {
  let flag = await doReq(`/song/url?id=${id}`);
  if (!flag || !flag.data || flag.data.data.length === 0) {
    return "";
  }

  return flag.data.data[0].url;
};

const musicCover = async (id) => {
  let flag = await doReq(`/song/detail?ids=${id}`);
  if (!flag) {
    return {};
  }

  return flag.data;
};

const musicLyric = (id) => {
  return request({
    url: "/lyric?id=" + id,
  });
};

const userMusic = async (uid) => {
  let flag = await doReq(`/user/playlist?uid=${uid}`);
  if (!flag) {
    return [];
  }

  return flag.data.playlist;
};

const userDetail = async (uid) => {
  let flag = await doReq(`/user/detail?uid=${uid}`);
  if (!flag) {
    return [];
  }

  return flag.data;
};

const playlistdetail = async (pid) => {
  let flag = await doReq(`/playlist/detail?id=${pid}`);
  if (!flag) {
    return [];
  }

  return flag.data.playlist;
};

const searchMusic = (keyword) => {
  return request({
    url: "/search?keywords=" + keyword,
  });
};

const searchSongs = async (keyword, type = 1) => {
  let flag = await doReq(`/search?keywords=${keyword}&type=${type}`);
  if (!flag || !flag.data.result || !flag.data.result.songs) {
    return [];
  }
  let {
    data: {
      result: { songs },
    },
  } = flag;
  return songs;
};

const searchPlaylists = async (keyword, type = 1000) => {
  let flag = await doReq(`/search?keywords=${keyword}&type=${type}`);

  if (!flag || !flag.data.result || !flag.data.result.playlists) {
    return [];
  }
  let {
    data: {
      result: { playlists },
    },
  } = flag;

  let lists = [];
  for (let v of playlists) {
    let obj = {};
    obj.id = v.id;
    obj.name = v.name;
    obj.nickname = v.creator.nickname;
    obj.imgUrl = v.coverImgUrl;
    obj.trackCount = v.trackCount;
    obj.playCount = v.playCount;
    lists.push(obj);
  }
  return lists;
};

const searchArtists = async (keyword, type = 100) => {
  let flag = await doReq(`/search?keywords=${keyword}&type=${type}`);
  if (!flag || !flag.data.result || !flag.data.result.artists) {
    return [];
  }
  let {
    data: {
      result: { artists },
    },
  } = flag;

  let lists = [];
  for (let v of artists) {
    let obj = {};
    obj.id = v.id;
    obj.name = v.name;
    obj.imgUrl = v.picUrl;
    obj.albumSize = v.albumSize;
    lists.push(obj);
  }
  return lists;
};

const searchUsers = async (keyword, type = 1002) => {
  let flag = await doReq(`/search?keywords=${keyword}&type=${type}`);
  if (!flag || !flag.data.result || !flag.data.result.userprofiles) {
    return [];
  }
  let {
    data: {
      result: { userprofiles },
    },
  } = flag;

  let lists = [];
  for (let v of userprofiles) {
    let obj = {};
    obj.id = v.userId;
    obj.name = v.nickname;
    obj.imgUrl = v.avatarUrl;
    obj.signature = v.signature;
    obj.gender = v.gender;
    lists.push(obj);
  }
  return lists;
};

const searchMvs = async (keyword, type = 1004) => {
  let flag = await doReq(`/search?keywords=${keyword}&type=${type}`);
  if (!flag || !flag.data.result || !flag.data.result.mvs) {
    return [];
  }
  let {
    data: {
      result: { mvs },
    },
  } = flag;

  let lists = [];
  for (let v of mvs) {
    let obj = {};
    obj.id = v.id;
    obj.name = v.name;
    obj.artists = v.artists;
    obj.playCount = v.playCount;
    obj.imgUrl = v.cover;
    lists.push(obj);
  }
  return lists;
};

const searchVideos = async (keyword, type = 1014) => {
  let flag = await doReq(`/search?keywords=${keyword}&type=${type}`);
  if (!flag || !flag.data.result || !flag.data.result.videos) {
    return [];
  }
  let {
    data: {
      result: { videos },
    },
  } = flag;

  return videos;
};

const searchAlbums = async (keyword, type = 10) => {
  let flag = await doReq(`/search?keywords=${keyword}&type=${type}`);
  if (!flag || !flag.data.result || !flag.data.result.albums) {
    return [];
  }
  let {
    data: {
      result: { albums },
    },
  } = flag;

  let lists = [];
  for (let v of albums) {
    let obj = {};
    obj.id = v.id;
    obj.name = v.name;
    obj.nickname = v.artist.name;
    obj.imgUrl = v.picUrl;
    lists.push(obj);
  }
  return lists;
};

const search = async (keyword, type = 1) => {
  let flag = await doReq(`/search?keywords=${keyword}&type=${type}`);
  if (!flag || !flag.data.result) {
    return [];
  }
  let {
    data: { result },
  } = flag;
  return result;
};

const userFollows = async (uid) => {
  let flag = await doReq(`/user/follows?uid=${uid}`);
  if (!flag) {
    return [];
  }

  return flag.data.follow;
};

const userFans = async (uid) => {
  let flag = await doReq(`/user/followeds?uid=${uid}`);
  if (!flag) {
    return [];
  }

  return flag.data.followeds;
};

const userEvents = async (uid, limit = 20, lasttime = -1) => {
  let flag = await doReq(
    `/user/event?uid=${uid}&limit=${limit}&lasttime=${lasttime}`
  );
  if (!flag) {
    return [];
  }

  return flag.data.events;
};

const hotSearch = () => {
  return request({
    // url: '/search/hot'
    url: "/search/hot/detail",
  });
};

const singer = async (sid) => {
  let flag = await doReq(`/artists?id=${sid}`);
  if (!flag) {
    return [{}, []];
  }

  let { data } = flag;

  let info = data.artist;

  let lists = [];
  for (let v of data.hotSongs) {
    let obj = {};

    obj.id = v.id;
    obj.name = v.name;
    obj.imgUrl = v.al.picUrl;

    lists.push(obj);
  }

  return [info, lists];
};

const hotSinger = async (limit = 50) => {
  let flag = await doReq(`/top/artists?offset=0&limit=${limit}`);
  if (!flag) {
    return [];
  }

  let {
    data: { artists },
  } = flag;

  let lists = [];
  for (let v of artists) {
    let obj = {};
    obj.id = v.id;
    obj.name = v.name;
    obj.imgUrl = v.picUrl;
    obj.accountId = v.accountId;
    obj.albumSize = v.albumSize;
    obj.musicSize = v.musicSize;

    lists.push(obj);
  }

  return lists;
};

const getSingerAlbums = async (id, limit = 30) => {
  let flag = await doReq(`/artist/album?id=${id}&limit=${limit}`);
  if (!flag) {
    return [];
  }
  let {
    data: { hotAlbums },
  } = flag;

  let list = [];
  for (let v of hotAlbums) {
    let obj = {};

    obj.id = v.id;
    obj.name = v.name;
    obj.nickname = v.artist.name;
    obj.imgUrl = v.picUrl;

    list.push(obj);
  }

  return list;
};

const getSingerMvs = async (id, limit = 20) => {
  let flag = await doReq(`/artist/mv?id=${id}&limit=${limit}`);
  if (!flag) {
    return [];
  }
  let {
    data: { mvs },
  } = flag;

  for (let v of mvs) {
    v.imgUrl = v.imgurl;
    v.nickname = v.artistName;
  }
  return mvs;
};

const songComment = async (sid, limit = 30) => {
  let flag = await doReq(`/comment/music?id=${sid}&limit=${limit}`);
  if (!flag) {
    return [];
  }
  return [flag.data.comments, !flag.data.more];
};

const songHotComment = async (sid, limit = 30) => {
  let flag = await doReq(`/comment/hot?type=0&id=${sid}&limit=${limit}`);
  if (!flag) {
    return [];
  }
  return [flag.data.hotComments, !flag.data.hasMore];
};

const cloudHotComments = async () => {
  let flag = await doReq(`/comment/hotwall/list`);
  if (!flag) {
    return [];
  }

  let {
    data: { data },
  } = flag;
  for (let v of data) {
    let obj = {};
    obj.userId = v.simpleUserInfo.userId;
    obj.avatarUrl = v.simpleUserInfo.avatar;
    obj.nickname = v.simpleUserInfo.nickname;

    v.user = obj;
  }
  return data;
};

const detailComment = async (id, limit = 20) => {
  let flag = await doReq(`/comment/playlist?id=${id}&limit=${limit}`);
  if (!flag) {
    return [];
  }

  return flag.data;
};

const detailSubscribe = async (id, limit = 20) => {
  let flag = await doReq(`/playlist/subscribers?id=${id}&limit=${limit}`);
  if (!flag) {
    return [];
  }

  let lists = [];
  for (let v of flag.data.subscribers) {
    let obj = {};

    obj.id = v.userId;
    obj.name = v.nickname;
    obj.signature = v.signature;
    obj.gender = v.gender;
    obj.imgUrl = v.avatarUrl;

    lists.push(obj);
  }

  return lists;
};

const download = (url) => {
  return request({
    responseType: "arraybuffer",
    url,
  });
};

const getMvUrl = async (mvid) => {
  let flag = await doReq(`/mv/url?id=${mvid}`);
  if (!flag || !flag.data) {
    return [];
  }

  return flag.data.data.url;
};

const getMvComment = async (mvid) => {
  let flag = await doReq(`/comment/mv?id=${mvid}`);
  if (!flag || !flag.data) {
    return [[], []];
  }

  return [flag.data.hotComments, flag.data.comments];
};

const topMv = async (area = "内地", limit = 10) => {
  let flag = await doReq(`/top/mv?area=${area}&limit=${limit}`);
  if (!flag || !flag.data || !flag.data.data) {
    return [];
  }

  return flag.data.data;
};

const allMv = async (
  area = "全部",
  type = "全部",
  order = "最热",
  limit = 30,
  offset = 0
) => {
  let flag = await doReq(
    `/mv/all?area=${area}&type=${type}&order=${order}&limit=${limit}&offset=${offset}`
  );
  if (!flag) {
    return [];
  }

  return flag.data.data;
};

const videoGroups = async () => {
  let flag = await doReq(`/video/group/list`);
  if (!flag) {
    return [];
  }

  return flag.data.data;
};

// need login
const getVideosByGroupId = async (id) => {
  let flag = await doReq(`/video/group?id=${id}`);
  if (!flag) {
    return [];
  }

  return flag.data;
};

const getVideoDetailById = async (id) => {
  let flag = await doReq(`/video/detail?id=${id}`);
  if (!flag) {
    return [];
  }

  return flag.data.data;
};

const getVideoUrlById = async (id) => {
  let flag = await doReq(`/video/url?id=${id}`);
  if (!flag) {
    return [];
  }

  return flag.data;
};

const getVideoComments = async (id, limit = 20) => {
  let flag = await doReq(`/comment/video?id=${id}&limit=${limit}`);
  if (!flag || !flag.data) {
    return [[], []];
  }

  return [flag.data.hotComments, flag.data.comments];
};

const getAlbumDetail = async (id) => {
  let flag = await doReq(`/album?id=${id}`);
  if (!flag || !flag.data || !flag.data.album || !flag.data.songs) {
    return [[], []];
  }

  return [flag.data.album, flag.data.songs];
};

const getAlbumComments = async (id, limit = 20) => {
  let flag = await doReq(`/comment/album?id=${id}&limit=${limit}`);
  if (!flag || !flag.data) {
    return [[], []];
  }

  return [flag.data.comments, flag.data.hotComments];
};

export default {
  toplist,
  listId,
  checkMusic,
  musicUrl,
  musicCover,
  musicLyric,
  userMusic,
  userDetail,
  playlistdetail,
  searchMusic,
  search,
  searchSongs,
  searchPlaylists,
  searchArtists,
  searchUsers,
  searchMvs,
  searchVideos,
  searchAlbums,
  hotSearch,
  userFollows,
  userFans,
  userEvents,
  singer,
  hotSinger,
  getSingerAlbums,
  getSingerMvs,
  songComment,
  songHotComment,
  cloudHotComments,
  detailComment,
  detailSubscribe,
  download,
  hotDetails,
  getMvUrl,
  getMvComment,
  topMv,
  allMv,
  videoGroups,
  getVideosByGroupId,
  getVideoDetailById,
  getVideoUrlById,
  getVideoComments,
  getAlbumDetail,
  getAlbumComments,
};
