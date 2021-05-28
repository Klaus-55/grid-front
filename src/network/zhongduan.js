import {request} from "./request";

//预警消息评分
export function warningMessage(start, end) {
  let url = '/zhongduan/warningMessage/' + start + '/' + end
  return request({
    url
  })
}

//预警消息评定详情
export function warningDetail(start, end, type, level) {
  let url = '/zhongduan/warningDetail/' + start + '/' + end + '/' + type + '/' + level
  return request({
    url
  })
}

//降水过程评分
export function rainProgress(start, end) {
  let url = '/zhongduan/rainProgress/' + start + '/' + end
  return request({
    url
  })
}

//降水过程评定详情
export function rainDetail(start, end) {
  let url = '/zhongduan/rainDetail/' + start + '/' + end
  return request({
    url
  })
}

//每日预报员评分
// /zhongduan/dailyForecast/{start}/{end}/{fTime}
export function dailyForecast(start, end, fTime) {
  let url = '/zhongduan/dailyForecast/' + start + '/' + end + '/' + fTime
  return request({
    url: url
  })
}