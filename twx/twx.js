var config = require('./ext/twx.config.js')
var systemInfo = wx.getSystemInfoSync();
var networkType = '';


var twx = (function() {
  var globalData = {
    openId: '',
    userId: '',
    systemInfo: systemInfo,
  };

  var twx = Object.create(wx, {
    globalData: {
      get: function() {
        return globalData;
      },
      enumerable: true
    },
    env: {
      get: function() {
        return config.env;
      },
      enumerable: true
    },
    config: {
      get: function() {
        return config;
      },
      enumerable: true
    },
    appId: {
      enumerable: true,
      value: config.appId
    },
    request: {
      get: function() {
        return require('./ext/twx.request.js').request;
      },
      enumerable: true
    },
    cancel: {
      get: function() {
        return require('./ext/twx.request.js').cancel;
      },
      enumerable: true
    },
    isLogin: {
      get: function() {
        return require('./ext/twx.loginUtil.js').isLogin;
      },
      enumerable: true
    },
    jumpLogin: {
      get: function() {
        return require('./ext/twx.loginUtil.js').jumpLogin;
      },
      enumerable: true
    },
    Observer: {
      get: function() {

      },
      enumerable: true
    },
    initAddr: {
      get: function() {
        return require('./ext/twx.address.js').initAddr;
      },
      enumerable: true
    },
    throttle: {
      get: function() {
        return require('./ext/twx.throttle.js').throttle
      }
    }
  });

  Object.keys(globalData).forEach(function(key) {
    twx[key] = globalData[key]
  })

  return twx;
})();

export default twx;
export {
  twx
};