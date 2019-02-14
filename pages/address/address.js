// pages/address/address.js
import {
  twx
} from '../../twx/twx.js'
Page({

  /**
   * Page initial data
   */
  data: {
    info:{},
    newinfo:{}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    let info = wx.getStorageSync('__address');
    info && this.setData({
      info: info
    })

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  },

  inputChange: function(e) {
    let info = this.data.newinfo
    switch (e.currentTarget.id) {
      case '0':
        info.name = e.detail.value
        break;
      case '1':
        info.phone = e.detail.value
        break;
      case '2':
        info.address = e.detail.value
        break;
    }
    this.setData({
      newinfo: info
    })
  },
  tapDone: function(e) {
    let info = Object.assign(this.data.info, this.data.newinfo)
    wx.setStorage({
      key: '__address',
      data: info,
    })
    twx.request({
      url: '/api/order/modify/address',
      data: {
        address: info.address,
        receiver: info.name,
        mobile: info.phone
      }
    }).then((res)=>{
      if (res.code) {
        wx.showToast({
          title: '完成',
        })
      }
    })
  }
})