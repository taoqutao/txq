// plugin/components/table/table.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataSource: {
      type:Array,
      value:[],
      observer:'itemsChange'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  attached: function () {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    itemsChange: function(newVal, oldVal) {
      // console.log(newVal)
    },

    tapItem: function(e) {
      this.triggerEvent('customevent', {
        "index": e.target.id
      }, {
          bubbles: true,
          composed: true
        })
    }
  }
})
