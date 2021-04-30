/*
 * https://liuhongwei3.github.io Inc.
 * Name: Request.js
 * Date: 2020/1/30 上午9:57
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import { request } from "./index";
import doReq from "./doReq";

// 0: pc
// 1: android
// 2: iphone
// 3: ipad
const getBanner = async (type = 0) => {
    let flag = await doReq(`/banner?type=${type}`);
    if (!flag || !flag.data || !flag.data.banners) {
        return [];
    }

    return flag.data.banners;
};

const getRecomDetails = async (limit = 30) => {
    let flag = await doReq(`/personalized?limit=${limit}`);
    if (!flag || !flag.data) {
        return [];
    }

    for (let v of flag.data.result) {
        v.imgUrl = v.picUrl;
    }

    return flag.data.result;
};

const getPerPush = async () => {
    let flag = await doReq(`/personalized/privatecontent`);
    if (!flag || !flag.data) {
        return [];
    }

    return flag.data.result;
};

const getNewSongs = async (limit = 14) => {
    let flag = await doReq(`/personalized/newsong?limit=${limit}`);
    if (!flag || !flag.data) {
        return [];
    }

    for (let v of flag.data.result) {
        v.imgUrl = v.picUrl;
    }

    return flag.data.result;
};

const getNewMvs = async () => {
    let flag = await doReq(`/personalized/mv`);
    if (!flag || !flag.data) {
        return [];
    }

    return flag.data.result;
};

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

const checkMusic = async (id) => {
    let flag = await doReq(`/check/music?id=${id}`);
    if (!flag || !flag.data) {
        return { suceess: false, message: "暂无版权" };
    }

    return flag.data;
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
    if (!flag || !flag.data || !flag.data.songs) {
        return [];
    }

    let songs = [];
    for (let v of flag.data.songs) {
        if (v.ar.length >= 3) {
            v.ar = v.ar.slice(0, 3);
        }
        songs.push({
            id: v.id,
            name: v.name,
            artists: v.ar,
            album: v.al,
            dt: Math.floor(v.dt / 1000),
            mv: v.mv,
            publishTime: v.publishTime,
        });
    }
    return songs;
};

const musicLyric = async (id) => {
    let flag = await doReq(`/lyric?id=${id}`);
    if (!flag || !flag.data) {
        return false;
    }

    return flag.data;
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

const searchSuggest = async (keyword, type = "mobile") => {
    let flag = await doReq(`/search/suggest?keywords=${keyword}&type=${type}`);
    if (!flag) {
        return [];
    }

    return flag.data.result;
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
    for (let v of songs) {
        if (v.artists.length >= 3) {
            v.artists = v.artists.slice(0, 3);
        }
        v.dt = Math.floor(v.duration / 1000);
        v.publishTime = v.album.publishTime;
    }

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
        responseType: "blob",
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

const getSimiDetails = async (id) => {
    let flag = await doReq(`/related/playlist?id=${id}`);
    if (!flag || !flag.data || !flag.data.playlists) {
        return [];
    }

    for (let v of flag.data.playlists) {
        v.imgUrl = v.coverImgUrl;
    }

    return flag.data.playlists;
};

const getSimiSingers = async (id) => {
    let flag = await doReq(`/simi/artist?id=${id}`);
    if (!flag || !flag.data || !flag.data.artists) {
        return [];
    }

    for (let v of flag.data.artists) {
        v.imgUrl = v.picUrl;
    }

    return flag.data.artists;
};

const getSimiMvs = async (id) => {
    let flag = await doReq(`/simi/mv?mvid=${id}`);
    if (!flag || !flag.data || !flag.data.mvs) {
        return [];
    }

    return flag.data.mvs;
};

const getRelatedVideos = async (id) => {
    let flag = await doReq(`/related/allvideo?id=${id}`);
    if (!flag || !flag.data || !flag.data.data) {
        return {};
    }

    return flag.data.data;
};

const getMvDetail = async (id) => {
    let flag = await doReq(`/mv/detail?mvid=${id}`);
    if (!flag || !flag.data || !flag.data.data) {
        return {};
    }

    return flag.data.data;
};

const getMvCount = async (id) => {
    let flag = await doReq(`/mv/detail/info?mvid=${id}`);
    if (!flag || !flag.data) {
        return {};
    }

    return flag.data;
};

export default {
    getBanner,
    getRecomDetails,
    getPerPush,
    getNewSongs,
    getNewMvs,
    toplist,
    checkMusic,
    musicUrl,
    musicCover,
    musicLyric,
    userMusic,
    userDetail,
    playlistdetail,
    searchMusic,
    search,
    searchSuggest,
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
    getSimiDetails,
    getSimiSingers,
    getSimiMvs,
    getRelatedVideos,
    getMvDetail,
    getMvCount,
};
