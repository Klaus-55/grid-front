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

//每日预报员评分
// /zhongduan/dailyForecast/{start}/{end}/{fTime}
export function dailyForecast(start, end, fTime) {
  let url = '/zhongduan/dailyForecast/' + start + '/' + end + '/' + fTime
  return request({
    url: url
  })
}