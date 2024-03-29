import axios from "axios";

export function request(config) {
  let baseURL
  if (process.env.NODE_ENV === 'development') {
    baseURL = 'http://10.111.102.28:9000/grid-server/api'
  } else {
    baseURL = 'http://10.111.100.216:9000/grid-server/api'
  }
  //1. 创建axios实例
  const instance = axios.create({
    // baseURL: 'http://localhost:9000/grid-server/api',
    // baseURL: 'http://192.168.0.146:9000/grid-server/api',
    // baseURL: 'http://10.111.100.216:9000/grid-server/api',
    // timeout: 5000c
    baseURL
  })

  //2.axios拦截器
  instance.interceptors.request.use(config => {
    // console.log(config);
    return config
  }, err => {
    // console.log(err);
  })
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err);
  })
  return instance(config)
}