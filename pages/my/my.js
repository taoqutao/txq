// pages/my/my.js
import {twx} from '../../twx/twx.js'
const app = getApp()
Page({
  /**
   * Page initial data
   */
  data: {
    userInfo: {
      nickName: '点击登录',
      avatarUrl: '/images/ufo.png'
    },
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    // 获取用户信息
    app.globalData.userInfo && this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  jump: function(e) {
    let url = ''
    switch (e.currentTarget.id) {
      case '0':
        if (this.data.userInfo) {
          url = '/pages/address/address'
        } else if (e.detail.userInfo) {
          app.globalData.userInfo = e.detail.userInfo
          this.setData({
            userInfo: e.detail.userInfo
          })
        } else {
          return;
        } 
        break;
      case '1':
        url = '/pages/record/record'
        break;
      case '2':
        url = '/pages/help/help'
        break;
      case '3':
        url = '/pages/contact/contact'
        break;
    }
    wx.navigateTo({
      url: url
    })
  }
})