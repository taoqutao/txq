

import {request} from './twx.request.js'

function isLogin(jumpLogin, pageObejct) {
  return !!wx.getStorageSync('twx_token');
}

function login(obj) {
  // 登录
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      request({
        url: '/api/wx/login',
        method: 'GET',
        data: {
          code: res.code
        }
      }).then((data) => {
        if (data.code) {
          wx.setStorage({
            key: 'twx_token',
            data: data.data.token,
          })
        }
      })
    }
  })
}

export {
  isLogin,
  login
}