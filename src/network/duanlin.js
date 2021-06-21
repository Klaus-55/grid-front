import {request} from "./request";

//省级预警预报质量
export function provincialWarning(start, end, warningType, factory) {
  let url = '/duanlin/provincialWarning/' + start + '/' + end + '/' + warningType + "/" + factory
  return request({
    url
  })
}

//省级预警评定详情
export function provincialDetail(start, end, department, warningType, level, rs) {
  let url = '/duanlin/provincialDetail/' + start + '/' + end + '/' + department + "/" + warningType + '/' + level + "/" + rs
  return request({
    url
  })
}