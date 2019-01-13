// pages/detail/detail.js
import {
  twx
} from '../../twx/twx.js'

Page({

  /**
   * Page initial data
   */
  data: {
    imgUrls: [
      '/images/banner.jpg',
    ],
    info: {},
    showTip: true
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    twx.request({
      url: '/api/activity/query/' + `${options.id}`,
      method: 'GET',
    }).then(data => {
      if (data.code) {
        let info = {}
        let d = data.data
        info.name = d.goodsName + ' x ' + d.goodsCount
        info.state = new Date(d.endTime).getTime() - new Date().getTime()
        info.description = info.activityDesc
        info.rewardCount = d.goodsCount
        info.startTime = d.endTime
        let process = ''
        switch (d.type) {
          case '10':
            process = '进行中'
            break;
          case '20':
            process = '已结束'
            break;
          case '30':
            process = '已取消'
            break;
        }
        info.processName = process
        info.process = d.type
        this.setData({
          info
        })
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    setTimeout(()=>{
      this.tapTip()
    }, 3000)
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
  tapCheckAll: function(e) {
    wx.navigateTo({
      url: '/pages/members/members',
    })
  },
  tapTip: function(e) {
    this.setData({
      showTip: false
    })
  }
})