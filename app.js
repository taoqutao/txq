//app.js
import {twx} from '/twx/twx.js'
App({
  onLaunch: function () {
    twx.login();
    
    twx.request({
      url: '/api/info/config',
      method: 'GET'
    }).then((data)=>{
      if (data.code) {
        this.globalData.config = data.data;
      }
    })
  },
  globalData: {
    userInfo: null
  }
})