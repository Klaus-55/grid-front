import {request} from "./request";
import moment from "momnet";

//降水请求接口
export function getRainHttp(start, end, ybsc, jysd, jysx, jycp) {
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
  let url = '/keguan/checkRainScore/'
  if (jysx === 'zh') {
    // {start}/{end}/{time}/{type}
    url += startStr + '/' + endStr + '/' + ybsc + '/' + jycp
  } else {
    // {start}/{end}/{time}/{hour}/{interval}/{type}
    url += startStr + '/' + endStr + '/' + ybsc + '/' + hour + '/' + jysx + '/' + jycp
  }
  console.log(url)
  return request({
    url: url
  })
}

//温度数据请求接口
export function getTempHttp(start, end, ybsc, jysd, jysx, jyyx, jycp) {
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
  // /keguan//checkTempScore/{start}/{end}/{time}/{hour}/{interval}/{facname}/{type}
  let url = '/keguan/checkTemScore/' + startStr + '/' + endStr + '/' + ybsc + '/' + hour + '/' + jysx + '/' + jyyx + '/' + jycp
  console.log(url);
  return request({
    url: url
  })
}

//短时强降水、雷暴大风数据访问接口

export function getHeavyHttp(start, end, ybsc, jysd, jysx, facname, jycp) {
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
  // /keguan/checkHeavyScore/{start}/{end}/{time}/{hour}/{interval}/{facname}/{type}
  let url = '/keguan/checkHeavyScore/' + startStr + '/' + endStr + '/' +
    ybsc + '/' + hour + '/' + jysx + '/' + facname + '/' + jycp
  console.log(url)
  return request({
    url: url
  })
}