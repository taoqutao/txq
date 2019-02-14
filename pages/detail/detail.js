// pages/detail/detail.js
import {
  twx
} from '../../twx/twx.js'
var Promise = require('../../utils/lib/promise.js');
var lock = false

Page({

  /**
   * Page initial data
   */
  data: {
    imgUrls: [
      '/images/banner.jpg',
    ],
    info: null,
    showTip: true,
    showShare: false,
    showPicker: false,
    members: [],
    lucky_members: [],
    userInfo: null,
    shareInfo: {},
    prize_state: null,
    showJoin: false,
    showError: false
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

        info.isFavorite = data.data.user_point
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
        info.goods_name = d.goods_name
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
        let process = map[parseInt(d.status)]
        info.processName = process
        info.process = d.status
        this.setData({
          info: info,
          showError: false
        })
        let interval = new Date(info.startTime).getTime() - new Date().getTime()
        interval > 0 && (this.data.timer = setTimeout(() => {
          clearTimeout(this.data.timer)
          this.request()
        }, interval))
      } else {
        this.setData({
          showError: true
        })
      }
    }).catch((err)=>{
      this.setData({
        showError: true
      })
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
        const {
          data: {
            orders = []
          } = {}
        } = res
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
        const {
          data: {
            orders = []
          } = {}
        } = res
        let list = orders.slice(0, 8)
        this.setData({
          lucky_members: list
        })
      }
    })
    twx.request({
      url: '/api/activity/user/prize/' + activityId,
      method: 'GET'
    }).then((data) => {
      if (data.code) {
        this.setData({
          prize_state: data.data.user_prize
        })
      }
    })
    // twx.request({
    //   url: '/api/activity/user/point/' + activityId,
    // }).then((data) => {
    //   if (data.code) {
    //     this.setData({
    //       isFavorite: data.data.user_point
    //     })
    //   }
    // })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {
    this.data.showTip && setTimeout(() => {
      this.tapTip()
    }, 10000)
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
      title: '送你免费领取 ' + this.data.info.name + ' 福利!',
      path: '/pages/index/index?activitiId=' + `${this.data.activityId}`
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
    if (e.detail.userInfo && !lock) {
      lock = true
      wx.showLoading({
        mask: true
      })

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
              activity_id: this.data.activityId,
              form_id: this.data.formId
            }
          })
        }
        throw '同步失败'
      }).then((data) => {
        if (data.code) {
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
      }).finally(() => {
        wx.hideLoading()
        lock = false
      })
      getApp().globalData.userInfo = e.detail.userInfo
    } else {

    }
  },
  tapPictureShare: function(e) {
    if (e.detail.userInfo) {
      const {
        avatarUrl,
        nickName
      } = e.detail.userInfo
      const {
        startTime,
        name,
        imgs,
        author
      } = this.data.info
      let title = '送你免费领取 ' + name + ' 福利!'
      let des = '奖品：' + name
      if (title.length > 14) {
        title = title.slice(0, 14) + '...'
      }
      if (des.length > 14) {
        des = des.slice(0, 14) + '...'
      }
      this.setData({
        showPicker: false,
        showShare: true,
        shareInfo: {
          avatarUrl,
          nickName: '淘趣星球',
          time: startTime + ' 自动开奖',
          des: des,
          image: imgs[0],
          title: title
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
  },
  tapFavotite: function(e) {
    if (this.data.info.isFavorite == 1) {
      return;
    }
    twx.request({
      url: '/api/activity/user/save/point/' + this.data.activityId,
    }).then((data) => {
      if (data.code) {
        let info = this.data.info
        this.data.info.amount += 1
        this.data.info.isFavorite = 1
        this.setData({
          info: info
        })
      }
    })

  },
  submitInfo: function(e) {
    this.data.formId = e.detail.formId
  },

  tapDescription: function(e) {
    wx.setClipboardData({
      data: this.data.info.description,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none'
        })
      }
    })
  },

  tapDesImgs: function(e) {
    const {
      target: {
        dataset: {
          path = ''
        }
      }
    } = e

    path && wx.showLoading()
    let wxSettingPromisify = new Promise((resolve, reject) => {
      wx.getSetting({
        success: function(res) {
          resolve(res)
        },
        fail: function(res) {
          reject(res)
        }
      })
    })

    let wxAuthPromisify = function(obj = {}) {
      return new Promise((resolve, reject) => {
        obj.success = function(res) {
          resolve(res)
        }
        obj.fail = function(res) {
          reject(res)
        }
        wx.authorize(obj)
      })
    }

    let wxImagePromisify = function(obj = {}) {
      return new Promise((resolve, reject) => {
        obj.success = function(res) {
          resolve(res)
        }
        obj.fail = function(res) {
          reject(res)
        }
        wx.getImageInfo(obj)
      })
    }

    let wxWriteImagrPromisify = function(obj = {}) {
      return new Promise((resolve, reject) => {
        obj.success = function(res) {
          resolve(res)
        }
        obj.fail = function(res) {
          reject(res)
        }
        wx.saveImageToPhotosAlbum(obj)
      })
    }


    function save(path) {
      if (path && path.length > 0) {
        wxImagePromisify({
          src: path
        }).then((res) => {
          return wxWriteImagrPromisify({
            filePath: res.path
          })
        }).then(res => {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
        }).catch(function(err = {}) {
          wx.showToast({
            title: err.errMsg || '保存失败',
            icon: 'none',
            duration: 2000
          })
        }).finally(()=>{
          wx.hideLoading()
        })
      } else {
        wx.hideLoading()
      }
    }

    wxSettingPromisify.then(res => {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        wxAuthPromisify({
          scope: 'scope.writePhotosAlbum'
        }).then(resp => {
          save(path)
        }).catch(function(err) {
          wx.showModal({
            title: '授权失败',
            content: '是否去授权',
            success: function(res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting["scope.writePhotosAlbum"]) {
                      save(path)
                    }
                  },
                })
              }
            },
            fail: function(){
              wx.hideLoading()
            }
          })
        })
      } else {
        save(path)
      }
    })
  },
  tapError: function (e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.request()
  }
})