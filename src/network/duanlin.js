import {request} from "./request";


//降水检验
// /rainScore/{start}/{end}/{ftime}/{wfinterval}/{product}
export function rainScore(start, end, ftime, wfinterval, product) {
  let url = '/duanlin/rainScore/' + start + '/' + end + '/' + ftime + "/" + wfinterval + "/" + product
  return request({
    url
  })
}

//温度检验
// /temScore/{start}/{end}/{ftime}/{wfinterval}/{product}
export function temScore(start, end, ftime, wfinterval, product) {
  let url = '/duanlin/temScore/' + start + '/' + end + '/' + ftime + "/" + wfinterval + "/" + product
  return request({
    url
  })
}

//省级预警预报质量
export function provincialWarning(start, end, warningType, factory) {
  let url = '/duanlin/provincialWarning/' + start + '/' + end + '/' + warningType + "/" + factory
  return request({
    url
  })
}

//省级预警评定详情
export function provincialDetail(start, end, warningType, level, rs) {
  let url = '/duanlin/provincialDetail/' + start + '/' + end + "/" + warningType + '/' + level + "/" + rs
  return request({
    url
  })
}

//市级预警预报质量
export function cityWarning(start, end, warningType, factory, index) {
  let url
  if (index === 'cw') {
    url = '/duanlin/cityWarning/' + start + '/' + end + "/" + warningType + "/" + factory
  } else {
    url = '/duanlin/cityWarningEff/' + start + '/' + end + "/" + warningType
  }
  return request({
    url
  })
}

//区县预警预报质量
// /duanlin/districtWarning/{start}/{end}/{warningType}/{factory}/{area}
export function districtWarning(start, end, warningType, factory, area, index) {
  let url
  if (index === 'cw') {
    url = '/duanlin/districtWarning/' + start + '/' + end + "/" + warningType + "/" + factory + "/" + area
  } else {
    url = '/duanlin/districtWarningEff/' + start + '/' + end + "/" + warningType + "/" + area
  }
  return request({
    url
  })
}

//市级预警评定详情
export function cityDetail(start, end, department, warningType, level, rs, index) {
  let url
  if (index === 'cwd') {
    url = '/duanlin/cityDetail/' + start + '/' + end + '/' + department + "/" + warningType + '/' + level + "/" + rs
  } else {
    url = '/duanlin/cityDetailEff/' + start + '/' + end + '/' + department + "/" + warningType + '/' + level
  }
  return request({
    url
  })
}

//强降水监测警报
// /heavyRainMonitor/{start}/{end}/{area}
export function heavyRainMonitor(start, end, area) {
  let url = '/duanlin/heavyRainMonitor/' + start + '/' + end + '/' + area
  return request({
    url
  })
}