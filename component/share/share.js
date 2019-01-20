// components/share/share.js
import { twx } from '../../twx/twx.js'
var Promise = require('../../utils/lib/promise.js');
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type : Object,
      value: {avatarUrl:'', image:'', nickName: '', time: '', des: ''}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgSize: {
      width: 0,
      height: 0
    },
    tempFilePath:null,
    isImgLoaded:false
  },

  ready() {
    wx.hideLoading()
    wx.showLoading({
      title: '分享图片生成中...',
    })
    
    twx.auth({
      success: (res) => {
        app.globalData.userInfo = res.userInfo
        this.loadImage()
      }
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadImage: function() {
      let that = this
      var imgs = []
      let promises = this.getImageRequestPromises()
      Promise.all(promises).then(function(res) {
        let res1 = res[0]
        let w1 = res1.width
        let h1 = res1.height
        that.setData({
          imgSize: {
            width: w1,
            height: h1
          }
        })
        that.drawImage(res)
      })
    },

    drawImage: function(imgs) {
      let res1 = imgs[0]
      let res2 = imgs[1]
      let res3 = imgs[2]

      let w1 = res1.width
      let h1 = res1.height
      let path1 = res1.path

      let w2 = res2.width * 0.2
      let h2 = res2.height * 0.2
      let path2 = '/' + res2.path

      let w3 = res3.width
      let h3 = res3.height
      let path3 = '/' + res3.path

      var ctx = wx.createCanvasContext('shareCanvas', this)
      const { screenWidth, screenHeight } = wx.getSystemInfoSync()

      ctx.setFillStyle('white')
      ctx.fillRect(10, 120, 220, 240)
      // 背景图
      ctx.drawImage(path1, 100, 10, 40, 40)
      // 二维码
      ctx.drawImage(path2, 60, 145, 120, 80)
      // 商品图
      ctx.drawImage(path3, 80, 260, 80, 80)

      ctx.setTextAlign('center')
      ctx.setFillStyle('#ffffff')

      ctx.setFontSize(14)
      ctx.fillText(getApp().globalData.userInfo.nickName, 120, 70)
      ctx.stroke()

      ctx.setFontSize(16)
      ctx.fillText('送你一次免费抽奖福利', 120, 90)
      ctx.stroke()

      ctx.setFontSize(10)
      ctx.fillText(this.data.info.time, 120, 106)
      ctx.stroke()

      ctx.setTextAlign('left')
      ctx.setFillStyle('#000000')
      ctx.setFontSize(14)
      ctx.fillText(this.data.info.des, 20, 250)
      ctx.stroke()

      ctx.setTextAlign('center')
      ctx.setFontSize(8)
      ctx.fillText('长按或扫码立即参与抽奖', 120, 350)
      ctx.stroke()

      let that = this

      ctx.draw(false, ()=>{
        wx.hideLoading()
        that.setData({
          isImgLoaded: true
        })
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvasId: 'shareCanvas',
            success: function (res) {
              that.setData({
                tempFilePath: res.tempFilePath
              })
              that.saveImage();
            }
          }, that)
        }, 1000)
      })
    },

    saveImage:function (e) {
      const wxSetting = this.wxPromisify(wx.getSetting)
      const wxAutorize = this.wxPromisify(wx.authorize)
      const wxSaveImageToPhotosAlbum = this.wxPromisify(wx.saveImageToPhotosAlbum)
      const path = this.data.tempFilePath
      function save () {
        if (path && path.length > 0) {
          wxSaveImageToPhotosAlbum({
            filePath: path
          }).then(res => {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          }).catch(function(err) {
            wx.showToast({
              title: err.errMsg,
              icon: 'none',
              duration: 2000
            })
          })
        }
      }
      // 获取授权
      wxSetting().then(res => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wxAutorize({
            scope: 'scope.writePhotosAlbum'
          }).then(resp => {
            save()
            }).catch(function (err) {
              wx.showModal({
                title: '授权失败',
                content: '是否去授权',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        if (res.authSetting["scope.writePhotosAlbum"]) {
                          save()
                        }
                      },
                    })
                  }
                }
              })
            })
        } else {
          save()
        }
      })
    },

    hideDialog: function(e) {
      this.triggerEvent('customEvent', { bubbles: true, composed: true })
    },

    getImageRequestPromises: function () {
      let getImageInfoPromisify = this.wxPromisify(wx.getImageInfo)
      let p1 = getImageInfoPromisify({
        src: this.data.info.avatarUrl
      })
      let p2 = getImageInfoPromisify({
        src: '/images/reward.png'
      })
      let p3 = getImageInfoPromisify({
        src: '/component/share/code.jpg'
      })
      return [p1, p2, p3]
    },

    wxPromisify: function(fn) {
      return function(obj = {}) {
        return new Promise((resolve, reject) => {
          obj.success = function(res) {
            resolve(res)
          }
          obj.fail = function(res) {
            reject(res)
          }
          fn(obj)
        })
      }
    }
  }
})