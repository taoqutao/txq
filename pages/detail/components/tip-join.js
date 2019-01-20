// pages/detail/components/tip-join.js
Component({
  /**
   * Component properties
   */
  properties: {

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
    tapClose: function (e) {
      this.triggerEvent('customevent', {
      }, {
          bubbles: true,
          composed: true
        })
    }
  }
})
