//index.js
import {
  twx
} from '../../twx/twx.js'
const app = getApp()

Page({
  data: {
    imgUrls: [
      '/images/banner.png',
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
            luck_activity_list = []
          }
        } = data
        let list = luck_activity_list.map((item, idx)=>{
          const { goods_img } = item;
          let img = goods_img.split(',')[0]
          return {
            ...item,
            goods_img: getApp().globalData.config.image_url + '/' + img
          }
        })
        this.setData({
          activities: list
        })
      }
    }).finally(()=>{
      wx.hideLoading()
    })
  },
  onShow: function() {
    
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