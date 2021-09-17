import {request} from "./request";

//预警消息评分
export function warningMessage(start, end) {
  let url = '/zhongduan/warningMessage/' + start + '/' + end
  return request({
    url
  })
}

//预警消息评定详情
export function warningDetail(start, end, type, level, fdate) {
  let url = '/zhongduan/warningDetail/' + start + '/' + end + '/' + type + '/' + level + '/' + fdate
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

//暴雨公众预报
export function rainstormPublic(year, product, model) {
  let url = '/zhongduan/rainstormPublic/' + year + '/' + product + '/' + model
  return request({
    url
  })
}

//暴雨公众预报详情
export function rainstormDetail(start, end) {
  let url = '/zhongduan/rainstormDetail/' + start + '/' + end
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

//模式检验评分
// /zhongduan/modelScore/{year}/{month}/{feHour}/{type}/{rtc}/{item}
export function modelScore(year, month, feHour, type, rtc, item) {
  let url = '/zhongduan/modelScore/' + year + '/' + month + '/' + feHour + '/' + type + '/' + rtc + '/' + item
  return request({
    url: url
  })
}

//获取实况站点数据
export function liveObtData(reqUrl, data) {
  let url = '/zhongduan' + reqUrl
  return request({
    url: url,
    params: data
  })
}

//请求格点预报数据
// /zhongduan/getWFGribData
export function wfData(data) {
  let url = '/zhongduan/getWFGribData'
  return request({
    url: url,
    params: data
  })
}

//请求图表数据
// /zhongduan/chart_live_hour_obt， /zhongduan/chart_live_hour_obt_cal，/zhongduan/chart_live_hour_grib
export function chartData(url, data) {
  let reUrl = '/zhongduan' + url
  return request({
    url: reUrl,
    params: data
  })
}

//请求格点实况数据
// /zhongduan/getLiveGribData
export function liveGribData(data) {
  let url = '/zhongduan/getLiveGribData'
  return request({
    url: url,
    params: data
  })
}