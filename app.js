//app.js
import {twx} from '/twx/twx.js'
App({
  onLaunch: function () {
    twx.login();
    
    twx.request({
      url: '/api/info/config',
      method: 'GET'
    }).then((data)=>{
      if (data.code) {
        this.globalData.config = data.data;
      }
    })

    wx.getUserInfo({
      success: (res) => {
        this.globalData.userInfo = res.userInfo
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.os = res.brand
      }
    })
  },
  globalData: {
    userInfo: null
  }
})