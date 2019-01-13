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
      this.tapClose()
    },
  }
})