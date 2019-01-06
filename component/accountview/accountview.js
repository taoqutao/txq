// component/accountview/accountview.js
Component({
  /**
   * Component properties
   */
  properties: {
    list: {
      type: Array,
      value: [],
      observer: 'valueChange'
    }
  },

  /**
   * Component initial data
   */
  data: {
    status: false,
    selectedId: null
  },

  /**
   * Component methods
   */
  methods: {
    valueChange: function(newVal, oldVal) {
      if (newVal.length > 0) {
        this.setData({
          selectedId: newVal[0].id
        })
      }
    },

    modelClose: function() {
      this.setData({
        status: "hide"
      })
    },

    setStatus: function(status) {
      this.setData({
        status: status
      })
    },

    tapRadio: function(e) {
      this.setData({
        selectedId: e.detail.value
      })
    },

    tapConfim: function(e) {
      this.triggerEvent('customevent', {
        id: this.data.selectedId
      }, {
        bubbles: true,
        composed: true
      })
    }
  }
})