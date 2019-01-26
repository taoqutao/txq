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
    joined_count: 0
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

    twx.request({
      url: '/api/order/query',
      method: 'GET'
    }).then((data) => {
      if (data.code) {
        const {
          data: {
            total_count = 0
          } = {}
        } = data
        this.setData({
          joined_count: total_count
        })
      }
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
    return {
      title: '送你一份优选好物免费领取福利！',
      imageUrl: '/images/share.jpg'
    }

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
          this.onShow()
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