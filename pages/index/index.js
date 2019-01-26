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
  onLoad: function(options) {
    if (options.activitiId) {
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + `${options.activitiId}`,
      })
    }
    this.request(true)
  },
  request: function(showLoading) {
    showLoading && wx.showLoading();
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
        let list = luck_activity_list.filter((item, index) => {
          return item.status == '10'
        }).map((item, idx) => {
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
    }).finally(() => {
      wx.hideLoading()
    })
  },
  onShow: function() {
    this.data.timer = setInterval(()=>{
      this.request(false)
    }, 30000)
    
  },
  onHide: function() {
    clearInterval(this.data.timer)
  },
  onUnload: function () {
    clearInterval(this.data.timer)
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