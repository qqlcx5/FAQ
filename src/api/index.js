import axios from './config'

import {
  $msg
} from '../js/common'

function api_get(domain) {
  return new Promise((resolve, reject) => {
    axios.get(domain).then(res => {
      if (res.status === 200 && res.data.status === 'success') {
        resolve(res.data.data)
      } else {
        $msg(res.data.msg, 'warning')
      }
    }).catch(() => {
      $msg('连接出错了', 'error')
    })
  })
}

function api_post(domain, data, method = "post", contentType) {
  return new Promise((resolve, reject) => {
    let obj = {
      method: method,
      url: domain,
    }
    if (data) obj.data = data;
    if (contentType === 'json') obj.headers = {
      "Content-Type": "application/json"
    }
    axios(obj).then(res => {
      if (res.status === 200) {
        resolve(res.data)
      } else {
        reject(res)
        $msg(res.data.msg, 'warning')
      }
    }).catch(() => {
      reject("连接出错了")
      $msg('连接出错了', 'error')
    })
  })
}




export {
  api_get,
  api_post
}