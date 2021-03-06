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
  onLoad: function(options) {
    const {
      state
    } = options;
    state && wx.setNavigationBarTitle({
      title: '中奖纪录'
    })
    twx.request({
      url: '/api/order/query' + (state ? '?status=' + state : ''),
      method: 'GET'
    }).then((data) => {
      if (data.code) {
        let map = getApp().globalData.config.activity_status || {
          10: '进行中',
          20: '已结束',
          30: '已取消'
        }
        const {
          data: {
            orders = []
          } = {}
        } = data


        let list = state ? orders.filter((item, index) => {
          return item.order_status == '1'
        }) : orders;
        list = list.map((item, index) => {
          let stateName = map[parseInt(item.activity_status)]
          let images = item.goods_img.split(',').filter((item, idex) => {
            return !!item
          }).map((item, idx) => {
            return getApp().globalData.config.image_url + '/' + item
          }) || []
          return {
            id: item.activity_id,
            name: item.goods_name,
            image: images[0],
            state: item.activity_status,
            time: item.create_time,
            stateName: stateName
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

  tapCard: function(e) {
    const {
      id
    } = e.currentTarget
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + `${id}`,
    })
  }
})