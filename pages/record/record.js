// pages/record/record.js
import {
  twx
} from '../../twx/twx.js'

Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    twx.request({
      url: '/api/order/query',
      method: 'GET'
    }).then((data)=>{
      if (data.code) {
        let map = getApp().globalData.config.activity_status || {
          10: '进行中',
          20: '已结束',
          30: '已取消'
        }
        
        let list = data.data.map((item, index)=>{
          let state = map[parseInt(item.status)]
          return {
            id: item.activity_id,
            name: '',
            count: '',
            state: state
          }
        })
        this.setData({
          list: list
        })
      } 
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

  },

  tapCard: function(e) {
    const { id } = e.currentTarget
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + `${id}`,
    })
  }
})