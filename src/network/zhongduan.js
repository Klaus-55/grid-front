import {request} from "./request";

//每日预报员评分
// /zhongduan/dailyForecast/{start}/{end}/{fTime}
export function dailyForecast(start, end, fTime) {
  let url = '/zhongduan/dailyForecast/' + start + '/' + end + '/' + fTime
  return request({
    url: url
  })
}