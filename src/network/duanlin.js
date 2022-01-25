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

// 分页查询值班信息
// /attendanceList
export function attendanceList({current, size}) {
  let url = '/duanlin/attendanceList'
  return request({
    url: url,
    params: {
      current: current,
      size: size
    }
  })
}


//登陆验证
// /login
export function login(username, password) {
  let url = '/duanlin/login?username=' + username + '&password=' + password
  return request({
    url
  })
}

//强降水检验
// /heavyRainScore/{start}/{end}/{ftime}
export function heavyRainScore(start, end, ftime) {
  let url = '/duanlin/heavyRainScore/' + start + '/' + end + '/' + ftime
  return request({
    url
  })
}

//雷暴检验
// /thunderScore/{start}/{end}/{ftime}
export function thunderScore(start, end, ftime) {
  let url = '/duanlin/thunderScore/' + start + '/' + end + '/' + ftime
  return request({
    url
  })
}

//雷暴大风检验
// /thunderstormScore/{start}/{end}/{ftime}
export function thunderstormScore(start, end, ftime) {
  let url = '/duanlin/thunderstormScore/' + start + '/' + end + '/' + ftime
  return request({
    url
  })
}

//冰雹检验
// /hailScore/{start}/{end}/{ftime}
export function hailScore(start, end, ftime) {
  let url = '/duanlin/hailScore/' + start + '/' + end + '/' + ftime
  return request({
    url
  })
}

//省级预警预报质量
export function provincialWarning(start, end, warningType, method) {
  let url = '/duanlin/provincialWarning/' + start + '/' + end + '/' + warningType + '/' + method
  return request({
    url
  })
}

//省级预警评定详情
export function provincialDetail(start, end, warningType, level, rs, type) {
  let url = '/duanlin/provincialDetail/' + start + '/' + end + "/" + warningType + '/' + level + "/" + rs  + "/" + type
  return request({
    url
  })
}

//市级预警预报质量
export function cityWarning(start, end, warningType, method) {
  let url = '/duanlin/cityWarning/' + start + '/' + end + "/" + warningType + "/" + method
  return request({
    url
  })
}

//市级预警评定详情
export function cityDetail(start, end, department, warningType, level, rs, type) {
  let url = '/duanlin/cityDetail/' + start + '/' + end + '/' + department + "/" + warningType + '/' + level + "/" + rs + '/' + type
  return request({
    url
  })
}

//预警有效性评定
export function cityWarningEff(start, end, warningType) {
  let url = '/duanlin/cityWarningEff/' + start + '/' + end + "/" + warningType
  return request({
    url
  })
}

//区县预警有效性
// /duanlin/districtWarningEff/{start}/{end}/{warningType}/{factory}/{area}
export function districtWarningEff(start, end, warningType, factory, area) {
  let url = '/duanlin/districtWarningEff/' + start + '/' + end + "/" + warningType + "/" + area
  return request({
    url
  })
}

//市级预警评定详情
export function cityEffDetail(start, end, department, warningType, level) {
  let url = '/duanlin/cityDetailEff/' + start + '/' + end + '/' + department + "/" + warningType + '/' + level
  return request({
    url
  })
}

//强降水监测警报
// /heavyRainMonitor/{start}/{end}/{area}/{regLevel}
export function heavyRainMonitor(start, end, area, regLevel) {
  let url = '/duanlin/heavyRainMonitor/' + start + '/' + end + '/' + area + '/' + regLevel
  return request({
    url
  })
}

//强降水监测警报详情
// /heavyRainMonitor/{start}/{end}/{area}/{district}/{level}
export function heavyDetail(start, end, area, district, level) {
  let url = '/duanlin/heavyDetail/' + start + '/' + end + '/' + area + '/' +district + '/' + level
  return request({
    url
  })
}

//强降水监测警报市县
// /getHeavyDistrict
export function getHeavyDistrict() {
  let url = '/duanlin/getHeavyDistrict'
  return request({
    url
  })
}

//强降水监测警报市县
// /download
export function download(fileName) {
  let url = '/duanlin/download/' + fileName
  return request({
    url
  })
}