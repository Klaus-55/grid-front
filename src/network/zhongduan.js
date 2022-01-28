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
// /zhongduan/dailyForecast/{start}/{end}/{fTime}/{rainType}/{tempType}
export function dailyForecast(start, end, fTime, rainType, tempType) {
  let url = '/zhongduan/dailyForecast/' + start + '/' + end + '/' + fTime + '/' + rainType + '/' + tempType
  return request({
    url: url
  })
}

//每日预报员年度评分
// /zhongduan/getScoreByYear/{start}/{end}/{fTime}
export function getScoreByYear(start, end, fTime) {
  let url = '/zhongduan/getScoreByYear/' + start + '/' + end + '/' + fTime
  return request({
    url: url
  })
}

//每日预报员评分
// /zhongduan/weatherPublic/{start}/{end}
export function weatherPublic(start, end) {
  let url = '/zhongduan/weatherPublic/' + start + '/' + end
  return request({
    url: url
  })
}

//城镇预报评分
// /zhongduan/townForecastScore/{start}/{end}/{period}/{obtType}
export function townForecastScore(start, end, period, obtType) {
  let url = '/zhongduan/townForecastScore/' + start + '/' + end + '/' + period + '/' + obtType
  return request({
    url: url
  })
}

//城镇预报员评分
// /zhongduan/townForecasterScore/{start}/{end}/{period}/{obtType}/{wfsrc}
export function townForecasterScore(start, end, period, obtType, wfsrc) {
  let url = '/zhongduan/townForecasterScore/' + start + '/' + end + '/' + period + '/' + obtType + '/' + wfsrc
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

//降水检验
// /zhongduan/rainScore/{start}/{end}/{fTime}/{type}
export function rainScore(start, end, fTime, type) {
  let url = '/zhongduan/rainScore/' + start + '/' + end + '/' + fTime + '/' + type
  return request({
    url: url
  })
}

//降水检验2
// /zhongduan/rainScore2/{start}/{end}/{fTime}/{type}
export function rainScore2(start, end, fTime, type) {
  let url = '/zhongduan/rainScore2/' + start + '/' + end + '/' + fTime + '/' + type
  return request({
    url: url
  })
}

//温度检验
// /zhongduan/tempScore/{start}/{end}/{fTime}/{type}/{wfhours}/{facname}
export function tempScore(start, end, fTime, type, wfhours, facname) {
  if (facname.indexOf('maxt') !== -1) {
    facname = 'TMAX'
  } else if (facname.indexOf('mint') !== -1) {
    facname = 'TMIN'
  }
  let url = '/zhongduan/tempScore/' + start + '/' + end + '/' + fTime + '/' + type + '/' + wfhours + '/' + facname
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

//降雪实况
export function getSnowFact(start, end) {
  let url = '/zhongduan/getSnowFact/' + start + '/' + end
  return request({
    url
  })
}