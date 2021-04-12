import axios from 'axios'
/* axios.defaults.baseURL = 'http://mw-striver.cn:8080' */
axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.withCredentials = false
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  console.log(response)
  // 对响应数据做点什么
  let result = {}
  switch (response.status) {
    case 200:
      result = response.data
      break
    case 404:
      result = { status: false, msg: '404无法连接服务器' }
      break
    default :
      result = { status: false, msg: '未知错误' }
      break
  }
  return result
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 简单 GET 请求
export async function get (url, params) {
  return axios.get(url, {
    params: params
  })
}

export async function post (url, params) {
  // eslint-disable-next-line handle-callback-err
  return axios.post(url, params).catch(error => {
    // layer.msg('服务器异常：' + error)
  })
}

// 文件上传
export async function upLoadFile (url, params) {
  const config = {
    // 添加请求头
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 9999999999000,
    // 添加上传进度监听事件
    onUploadProgress: e => {
      /* let completeProgress = ((e.loaded / e.total * 100) | 0) + '%'
      this.progress = completeProgress */
    }
  }
  return axios.post(url, params, config)
}
// 文件下载post
export async function postDown (url, param) {
  const config = {
    timeout: 9999999999000,
    'Content-Type': 'application/octet-stream',
    responseType: 'blob'
  }
  return axios.post(url, param, config)
}
// 文件下载get
export async function getDown (url, param) {
  const config = {
    params: param,
    timeout: 9999999999000,
    'Content-Type': 'application/octet-stream',
    responseType: 'blob'
  }
  return axios.get(url, config).catch(e => {
    // layer.msg('异常')
    console.log(e)
  })
}

export function getBaseUrl () {
  return axios.defaults.baseURL
}
export function setBaseUrl (url) {
  try {
    axios.defaults.baseURL = url
    return true
  } catch (e) {
    return false
  }
}
