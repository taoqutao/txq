// pages/members/members.js
import {
  twx
} from '../../twx/twx.js'

Page({

  /**
   * Page initial data
   */
  data: {
    userInfo: null,
    members: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) { 
    wx.showLoading()
    twx.request({
      url: '/api/activity/order/' + `${options.activityId}`,
      method: 'GET'
    }).then((res) => {
      if (res.code) {
        const { data: {
          orders = []
        } = {} } = res
        let list = orders.slice(0, 8)
        this.setData({
          members: list
        })
      }
    }).finally(()=>{
      wx.hideLoading()
    })
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

  }
})