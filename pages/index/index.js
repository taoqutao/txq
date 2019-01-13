//index.js
import {
  twx
} from '../../twx/twx.js'
const app = getApp()

Page({
  data: {
    imgUrls: [
      '/images/banner.jpg',
    ],
    activities: []
  },
  onLoad: function() {
    wx.showLoading()
    twx.request({
      url: '/api/activity/query',
      method: 'GET'
    }).then((data) => {
      if (data.code) {
        const {
          data: {
            luckActivityList = []
          }
        } = data

        this.setData({
          activities: luckActivityList
        })
      }
    }).finally(()=>{
      wx.hideLoading()
    })
  },
  onShow: function() {
    twx.request({
      url: '/api/info/config',
      method: 'GET'
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  tapCard: function(e) {
    const {id} = e.currentTarget
    wx.navigateTo({
      url: '/pages/detail/detail?id='+`${id}`,
    })
  },
  tapSubscribe: function(e) {
    wx.navigateTo({
      url: '',
    })
  }
})