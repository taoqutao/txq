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
    showTip: true,
    showShare: false,
    showPicker: false,
    members: [],
    lucky_members: [],
    userInfo: null,
    shareInfo:{},
    prize_state: null,
    showJoin: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    this.data.activityId = options.id
    this.request()
  },

  request: function() {
    let activityId = this.data.activityId
    wx.showLoading()
    twx.request({
      url: '/api/activity/query/' + activityId,
      method: 'GET',
    }).then(data => {
      if (data.code) {
        let info = {}
        let d = data.data.activity

        info.members_count = data.data.total_count
        info.order_state = data.data.user_join //只表示用户是否参与
        info.name = d.goods_name + ' x ' + d.goods_count
        info.state = new Date(d.end_time).getTime() - new Date().getTime()
        info.description = d.activity_desc
        info.rewardCount = d.goods_count
        info.startTime = d.end_time
        info.amount = d.amount
        info.author = d.mobile
        info.sponsor = d.shop_name
        info.imgs = d.goods_img.split(',').filter((item, idex) => {
          return !!item
        }).map((item, idx) => {
          return getApp().globalData.config.image_url + '/' + item
        }) || []
        info.activity_imgs = d.activity_img.split(',').filter((item, idex) => {
          return !!item
        }).map((item, idx) => {
          return getApp().globalData.config.image_url + '/' + item
        }) || []
        let map = getApp().globalData.config.activity_status || {
          10: '进行中',
          20: '已结束',
          30: '已取消'
        }
        let process = map[parseInt(d.type)]
        info.processName = process
        info.process = d.type
        this.setData({
          info
        })
      }
    }).finally(() => {
      wx.hideLoading()
    })

    // twx.request({
    //   url: '/api/activity/user/join/' + 'activityId',
    //   method: 'GET'
    // }).then((data) => {
    //   if (data.code) {
    //     const {data: {
    //       user_join
    //     } = {}} = data
    //     this.setData({
    //       order_state: user_join
    //     })
    //   }
    // })
    //参与活动列表
    twx.request({
      url: '/api/activity/order/' + activityId,
      method: 'GET'
    }).then((res) => {
      if (res.code) {
        const { data: {
          orders = []
        } = {} } = res
        let list = orders.slice(0, 8)
        this.setData({
          members: list,
          members_count: orders.length
        })
      }
    })
    //中奖订单
    twx.request({
      url: '/api/activity/order/prize/' + activityId,
      method: 'GET'
    }).then((res) => {
      if (res.code) {
        const { data: {
          orders = []
        } = {} } = res
        let list = orders.slice(0, 8)
        this.setData({
          lucky_members: list
        })
      }
    })
    twx.request({
      url: '/api/activity/user/prize/' + activityId,
      method: 'GET'
    }).then((data)=>{
      if(data.code) {
        this.setData({
          prize_state: data.data.user_prize
        })
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {
    setTimeout(() => {
      this.tapTip()
    }, 3000)
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
    this.setData({
      showPicker: false
    })
    return {
      title: this.data.info.author + '送你免费' + this.data.info.name + '抽奖福利',
      imageUrl: this.data.info.goods_img[0] || ''
    }
  },

  tapCheckAll: function(e) {
    wx.navigateTo({
      url: '/pages/members/members?activityId=' + this.data.activityId,
    })
  },
  tapTip: function(e) {
    this.setData({
      showTip: false
    })
  },
  tapClip: function() {
    wx.setClipboardData({
      data: this.data.info.author,
      success(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none'
        })
      }
    })
  },
  tapShareButton: function(e) {
    this.setData({
      showShare: false
    })
  },
  tapShare: function(e) {
    this.setData({
      showPicker: true
    })
  },
  tapDo: function(e) {
    if (e.detail.userInfo) {
      const {
        gender,
        nickName,
        avatarUrl
      } = e.detail.userInfo
      twx.request({
        url: '/api/user/modify',
        data: {
          sex: gender,
          nick_name: nickName,
          avatar_url: avatarUrl
        }
      }).then((data) => {
        return !!data.code
      }).then((isSynchronized) => {
        if (isSynchronized) {
          return twx.request({
            url: '/api/order/add',
            data: {
              activity_id: this.data.activityId
            }
          })
        }
        throw '同步失败'
      }).then((data) => {
        if(data.code) {
          this.request()
          this.setData({
            showJoin: true
          })
        }
      }).catch(() => {
        wx.showToast({
          title: '参与失败',
          icon: 'none'
        })
      })
      getApp().globalData.userInfo = e.detail.userInfo
    } else {

    }
  },
  tapPictureShare: function(e) {  
    if (e.detail.userInfo) {
      const { avatarUrl, nickName} = e.detail.userInfo
      const { startTime, name, imgs} = this.data.info
      this.setData({
        showPicker: false,
        showShare: true,
        shareInfo: { 
          avatarUrl,
          nickName, 
          time: startTime +' 自动开奖',
          des: '奖品：' + name,
          image: imgs[0]
        }
      })
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'none'
      })
    }
  },
  tapJoin: function() {
    this.setData({
      showJoin: false
    })
  }
})