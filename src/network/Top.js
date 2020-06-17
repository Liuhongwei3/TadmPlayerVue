/*
 * https://liuhongwei3.github.io Inc.
 * Name: Top.js
 * Date: 2020/1/30 上午9:57
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import {request} from './index'

export function toplist() {
  return request({
    url: '/toplist'
  })
}

export function listId(idx) {
  return request({
    url: '/top/list?idx=' + idx
  })
}

export function checkMusic(id) {
  return request({
    url: '/check/music?id=' + id
  })
}

export function musicUrl(id) {
  return request({
    url: '/song/url?id=' + id
  })
}

export function musicCover(id) {
  return request({
    url: '/song/detail?ids=' + id
  })
}

export function musicLyric(id) {
  return request({
    url: '/lyric?id=' + id
  })
}

export function userMusic(uid) {
  return request({
    url: '/user/playlist?uid=' + uid
  })
}

export function userDetail(uid) {
  return request({
    url: '/user/detail?uid=' + uid
  })
}

export function playlistdetail(pid) {
  return request({
    url: '/playlist/detail?id=' + pid
  })
}

export function searchMusic(keyword) {
  return request({
    url: '/search?keywords=' + keyword
  })
}

export function search(keyword, type) {
  return request({
    url: '/search?keywords=' + keyword + '&type=' + type
  })
}

export function searchSinger(keyword) {
  return request({
    url: '/search?type=100&keywords=' + keyword
  })
}

export function searchUser(keyword) {
  return request({
    url: '/search?type=1002&keywords=' + keyword
  })
}

export function userFollows(uid) {
  return request({
    url: '/user/follows?uid=' + uid
  })
}

export function hotSearch() {
  return request({
    url: '/search/hot'
  })
}

export function singer(sid) {
  return request({
    url: '/artists?id=' + sid
  })
}

export function hotSinger() {
  return request({
    url: '/top/artists?offset=0&limit=30'
  })
}

export function songComment(sid) {
  return request({
    url: '/comment/music?id=' + sid
  })
}

export function songHotComment(sid, limit = 20) {
  return request({
    url: '/comment/hot?type=0&id=' + sid + '&limit=' + limit
  })
}

export function cloudHotComments() {
  return request({
    url: '/comment/hotwall/list'
  })
}

export function download(url) {
  return request({
    responseType: 'arraybuffer',
    url: url
  })
}

export function hotDetails(limit = 24) {
  return request({
    url: '/top/playlist?limit=' + limit
  })
}
