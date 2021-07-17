import {request} from "./request";
import moment from "momnet";
import el from "element-ui/src/locale/lang/el";

//降水请求接口
export function getRainHttp(start, end, ybsc, jysd, jysx, jycp, isZhuri) {
  let path = window.location.pathname
  let startStr = moment(start).format('YYYYMMDD')
  let endStr = moment(end).format('YYYYMMDD')
  let hour = jysd.reduce((prev, cur) => {
    return prev + ',' + cur
  })
  if (ybsc === 'zh') {
    startStr += '0000'
    endStr += '2300'
  } else {
    startStr += ybsc + '00'
    endStr += ybsc + '00'
  }
  let url = '/keguan'
  if (path.indexOf('test') !== -1) url = '/keguan/test'
    if (isZhuri) {
    // {start}/{end}/{time}/{interval}/{type}
    url += '/checkRainScore/' + startStr + '/' + endStr + '/' + ybsc + '/' + jysx + '/' + jycp
  } else {
    // {start}/{end}/{time}/{hour}/{interval}/{type}
    url += '/checkRainScore/' + startStr + '/' + endStr + '/' + ybsc + '/' + hour + '/' + jysx + '/' + jycp
  }
  return request({
    url: url
  })
}

//温度数据请求接口
export function getTempHttp(start, end, ybsc, jysd, jysx, jyyx, jycp, isZhuri) {
  let path = window.location.pathname
  if (jyyx.indexOf('maxt') !== -1) {
    jyyx = 'TMAX'
  } else if (jyyx.indexOf('mint') !== -1) {
    jyyx = 'TMIN'
  } else {
    jyyx = 'TMP'
  }
  let startStr = moment(start).format('YYYYMMDD')
  let endStr = moment(end).format('YYYYMMDD')
  let hour = jysd.reduce((prev, cur) => {
    return prev + ',' + cur
  })
  if (ybsc === 'zh') {
    startStr += '0000'
    endStr += '2300'
  } else {
    startStr += ybsc + '00'
    endStr += ybsc + '00'
  }
  let url = '/keguan'
  if (path.indexOf('test') !== -1) url = '/keguan/test'
  if (isZhuri) {
    // {start}/{end}/{time}/{interval}/{facname}/{type}
    url += '/checkTemScore/' + startStr+ '/' + endStr + '/' + ybsc + '/' + jysx + '/' + jyyx + '/' + jycp
  } else {
    // {start}/{end}/{time}/{hour}/{interval}/{facname}/{type}
     url += '/checkTemScore/' + startStr + '/' + endStr + '/' + ybsc + '/' + hour + '/' + jysx + '/' + jyyx + '/' + jycp
  }
  return request({
    url: url
  })
}

//短时强降水、雷暴大风数据访问接口
export function getHeavyHttp(start, end, ybsc, jysd, jysx, facname, jycp, isZhuri) {
  let path = window.location.pathname
  let startStr = moment(start).format('YYYYMMDD')
  let endStr = moment(end).format('YYYYMMDD')
  let hour = jysd.reduce((prev, cur) => {
    return prev + ',' + cur
  })
  if (ybsc === 'zh') {
    startStr += '0000'
    endStr += '2300'
  } else {
    startStr += ybsc + '00'
    endStr += ybsc + '00'
  }
  let url = '/keguan'
  if (path.indexOf('test') !== -1) url = '/keguan/test'
  if (isZhuri) {
    // {start}/{end}/{time}/{interval}/{facname}/{type}
    url += '/checkHeavyScore/' + startStr + '/' + endStr + '/' + ybsc + '/' + jysx + '/' + facname + '/' + jycp
  } else {
    // {start}/{end}/{time}/{hour}/{interval}/{facname}/{type}
    url += '/checkHeavyScore/' + startStr + '/' + endStr + '/' + ybsc + '/' + hour + '/' + jysx + '/' + facname + '/' + jycp
  }
  return request({
    url: url
  })
}

//预报及实况监测
// /keguan/forecastMonitor/{start}/{end}/{facname}
// /keguan/factMonitor/{start}/{end}/{facname}
export function foreAndLiveMonitor(start, end, facname, type) {
  start = moment(start).format('YYYYMMDD')
  end = moment(end).format('YYYYMMDD')
  let url = '/keguan/forecastMonitor/'
  if (type === 'fact') url = '/keguan/factMonitor/'
  url += start + '/' + end + '/' + facname
  return request({
    url
  })
}
