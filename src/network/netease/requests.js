/*
 * https://liuhongwei3.github.io Inc.
 * Name: Request.js
 * Date: 2020/1/30 上午9:57
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import { request } from "./index";

const toplist = () => {
  return request({
    url: "/toplist",
  });
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

const musicUrl = (id) => {
  return request({
    url: "/song/url?id=" + id,
  });
};

const musicCover = (id) => {
  return request({
    url: "/song/detail?ids=" + id,
  });
};

const musicLyric = (id) => {
  return request({
    url: "/lyric?id=" + id,
  });
};

const userMusic = (uid) => {
  return request({
    url: "/user/playlist?uid=" + uid,
  });
};

const userDetail = (uid) => {
  return request({
    url: "/user/detail?uid=" + uid,
  });
};

const playlistdetail = (pid) => {
  return request({
    url: "/playlist/detail?id=" + pid,
  });
};

const searchMusic = (keyword) => {
  return request({
    url: "/search?keywords=" + keyword,
  });
};

const search = (keyword, type = 1) => {
  return request({
    url: "/search?keywords=" + keyword + "&type=" + type,
  });
};

const userFollows = (uid) => {
  return request({
    url: "/user/follows?uid=" + uid,
  });
};

const userFans = (uid) => {
  return request({
    url: "/user/followeds?uid=" + uid,
  });
};

const userEvents = (uid, limit = 20, lasttime = -1) => {
  return request({
    url: `/user/event?uid=${uid}&limit=${limit}&lasttime=${lasttime}`,
  });
};

const hotSearch = () => {
  return request({
    // url: '/search/hot'
    url: "/search/hot/detail",
  });
};

const singer = (sid) => {
  return request({
    url: "/artists?id=" + sid,
  });
};

const hotSinger = () => {
  return request({
    url: "/top/artists?offset=0&limit=30",
  });
};

const songComment = (sid) => {
  return request({
    url: "/comment/music?id=" + sid,
  });
};

const songHotComment = (sid, limit = 30) => {
  return request({
    url: "/comment/hot?type=0&id=" + sid + "&limit=" + limit,
  });
};

const cloudHotComments = () => {
  return request({
    url: "/comment/hotwall/list",
  });
};

const detailComment = (id, limit = 20) => {
  return request({
    url: `/comment/playlist?id=${id}&limit=${limit}`,
  });
};

const detailSubscribe = (id, limit = 20) => {
  return request({
    url: `/playlist/subscribers?id=${id}&limit=${limit}`,
  });
};

const download = (url) => {
  return request({
    responseType: "arraybuffer",
    url,
  });
};

const hotDetails = (limit = 24) => {
  return request({
    url: "/top/playlist?limit=" + limit,
  });
};

const getMvUrl = (mvid) => {
  return request({
    url: "/mv/url?id=" + mvid,
  });
};

const getMvComment = (mvid) => {
  return request({
    url: `/comment/mv?id=${mvid}`,
  });
};

const topMv = (area = "内地", limit = 10) => {
  return request({
    url: `/top/mv?area=${area}&limit=${limit}`,
  });
};

const allMv = (
  area = "全部",
  type = "全部",
  order = "最热",
  limit = 30,
  offset = 0
) => {
  return request({
    url: `/mv/all?area=${area}&type=${type}&order=${order}&limit=${limit}&offset=${offset}`,
  });
};

const videoGroups = () => {
  return request({
    url: `/video/group/list`,
  });
};

// need login
const getVideosByGroupId = (id) => {
  return request({
    url: `/video/group?id=${id}`,
  });
};

const getVideoDetailById = (id) => {
  return request({
    url: `/video/detail?id=${id}`,
  });
};

const getVideoUrlById = (id) => {
  return request({
    url: `/video/url?id=${id}`,
  });
};

const getVideoComments = (id, limit = 20) => {
  return request({
    url: `/comment/video?id=${id}&limit=${limit}`,
  });
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
  hotSearch,
  userFollows,
  userFans,
  userEvents,
  singer,
  hotSinger,
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
};
