// pages/redPacketDetail/component/home/source/comps/timer/beanTimer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    remain: {
      type: null,
      value: {
        seconds: 0
      },
      observer: 'remainChange'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    remainTime: 0,
    hour: '00',
    minute: '00',
    second: '00',
    timer: null
  },

  attached: function() {

  },
  ready: function() {

  },

  moved: function() {
    clearInterval(this.data.timer)
  },
  detached: function() {
    clearInterval(this.data.timer)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    remainChange: function(newVal, oldVal) {
      this.setData({
        remainTime: newVal && newVal.seconds > 0 ? newVal.seconds : 0
      })
      this.startTimer()
    },

    startTimer: function() {
      clearInterval(this.data.timer)
      var timer = setInterval(function() {
        if (this.data.remainTime >= 0) {
          this.setData({
            remainTime: this.data.remainTime - 1
          })
          this.updateTime()
        } else {
          this.postNotification()
          clearInterval(this.data.timer);
        }
      }.bind(this), 1000);
      this.setData({
        timer: timer
      })
    },

    postNotification: function() {
      this.triggerEvent('customevent')
    },

    updateTime() {
      let remain = this.data.remainTime
      if (remain >= 0) {
        var hour = parseInt(remain / 3600);
        var minute = parseInt((remain - 3600 * hour) / 60);
        var second = parseInt((remain - 3600 * hour - 60 * minute));
        var dateFormat = function(num) {
          if (num < 10) {
            return '0' + num.toString();
          } else {
            return num.toString();
          }
        }
        this.setData({
          hour: dateFormat(hour),
          minute: dateFormat(minute),
          second: dateFormat(second),
        });
      }
    }
  }
})