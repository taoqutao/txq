var twx = require('../twx.js').twx;

function initAddr() {
  startLocation()
}

function startLocation(callBack) {
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.userLocation']) {
        wx.authorize({
          scope: 'scope.userLocation',
          fail(err) {
            wx.reportAnalytics('authorize_location', {
              'error_info': JSON.stringify(err)
            })
          },
          complete() {
            startGis(callBack);
          },
        })
      } else {
        startGis(callBack)
      }
    },
    fail(err) {
      startGis(callBack)
    }
  })
}

function startGis(callBack) {
  wx.getLocation({
    type: 'wgs84',
    success: function(res) {
      twx.globalData.lng = res.longitude || '';
      twx.globalData.lat = res.latitude || '';
    },
    complete: function() {
      startLBSRequest(callBack);
    }
  })
}

function startLBSRequest(callBack) {
  // do request
}

module.exports = {
  initAddr
};