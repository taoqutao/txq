// pages/detail/coponents/tip-success.js
Component({
  /**
   * Component properties
   */
  properties: {
    type: {
      type: String,
      value : null
    }
  },

  /**
   * Component initial data
   */
  data: {

  },

  ready: function() {

  },
  /**
   * Component methods
   */
  methods: {
    tapClose: function(e) {
      this.setData({
        type: null
      })
    },
    tapBtn: function(e) {
      switch (this.data.type) {
        case '0':
        break;
        case '2':
          wx.switchTab({
            url: '/pages/index/index'
          })
          break;
        case '1':
          wx.switchTab({
            url: '/pages/index/index'
          })
          break;
      }
      this.tapClose()
    },
  }
})