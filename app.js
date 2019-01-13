//app.js
import {twx} from '/twx/twx.js'
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        twx.request({
          url: '/api/wx/login',
          method: 'GET',
          data: {
            code : res.code
          }
        }).then((data)=>{
          console.log(data)
        })
      }
    })
    // 获取用户信息
    twx.auth({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo

        twx.request({
          url: '/api/user/modify',
          data: {
            sex: res.userInfo.gender,
            nickName: res.userInfo.nickName
          }
        })
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})