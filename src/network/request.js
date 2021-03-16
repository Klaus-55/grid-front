import axios from "axios";

export function request(config) {
  //1. 创建axios实例
  const instance = axios.create({
    baseURL: 'http://localhost:9000/grid-server/api',
    // baseURL: 'http://192.168.0.146:9000/grid-server/api',
    // baseURL: 'http://10.111.102.27:9000/grid-server/api',
    timeout: 5000
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