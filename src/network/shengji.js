import {request} from "./request";

//首席岗预报员评分
export function getChiefScore(start, end) {
  let url = '/provincial/getChiefScore/' + start + '/' + end
  return request({
    url
  })
}

//中短期领班预报员评分
export function getForemanScore(start, end) {
  let url = '/provincial/getForemanScore/' + start + '/' + end
  return request({
    url
  })
}

//中短期夜班预报员评分
export function getNightShiftScore(start, end) {
  let url = '/provincial/getNightShiftScore/' + start + '/' + end
  return request({
    url
  })
}

//短临岗预报员评分
export function getShortTermScore(start, end) {
  let url = '/provincial/getShortTermScore/' + start + '/' + end
  return request({
    url
  })
}

//客观预报岗评分
export function getObjectiveScore(start, end) {
  let url = '/provincial/getObjectiveScore/' + start + '/' + end
  return request({
    url
  })
}

//市级评分
export function getCityScore(start, end) {
  let url = '/provincial/getCityScore/' + start + '/' + end
  return request({
    url
  })
}

//市级评分2
export function getCityScore2() {
  let url = '/provincial/getCityScore2'
  return request({
    url
  })
}

//市级预报员评分
export function getForecasterScore(start, end) {
  let url = '/provincial/getForecasterScore/' + start + '/' + end
  return request({
    url
  })
}

//市级预报员评分2
export function getForecasterScore2() {
  let url = '/provincial/getForecasterScore2'
  return request({
    url
  })
}