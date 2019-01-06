var twx = require('../twx.js').twx;
const util = require('../../utils/util.js')

var requestd = {};
var _requestID = 1;
var __kMaxRequestCount = 6;
var _requestQueue = []; //await queue
var _runQueue = []; //requesting queue

function _generateRequestID() {
  return _requestID++;
}

function _formatRequestURL(url) {
  if (url.indexOf('https://') == 0) {
    return url;
  } else if (url.indexOf("/") == 0) {
    return "https://" + twx.config.host() + url;
  } else {
    console.warn('url invalid');
  }
}

function __createHeader(header) {
  var _header = header || {};
  try {
    var headerCookie = getCookies();
    
    var selfCookie = _header.Cookie;
    selfCookie && (headerCookie += selfCookie);
    if (!_header['content-type']) {
      // _header['content-type'] = 'application/x-www-form-urlencoded';
    }
    _header["UserAgent"] = "tqt-servicewechat";
    _header["wechatAppId"] = twx.appId;
    _header['Cookie'] = headerCookie;
    _header['userId'] = wx.getStorageSync('twxlogin_userId') || ''
    var netType = ['wifi', '2g', '3g', '4g', 'none', 'unknown'].indexOf(twx.networkType);
    netType = netType == -1 ? 6 : netType + 1;
    _header["clientInfo"] = JSON.stringify({
      clientSystem: twx.systemInfo.platform || 'other',
      "clientVersion": twx.systemInfo.system || 'unknown',
      "netType": netType,
      "phoneType": twx.systemInfo.model || 'unknown',
      "wechatVersion": twx.systemInfo.version || 'unknown',
    });
  } catch (e) {

  }
  return _header;
}

//
function cancel(requestID) {
  if (requestID > 0) {
    //等待中移除
    for (var i = 0; i < _requestQueue.length; i++) {
      var obj = _requestQueue[i];
      if (obj.requestID == requestID) {
        _requestQueue.splice(i, 1);
        return 1;
      }
    }
  }

  return 0;
}

//
function request(object) {
  var header = __createHeader(object.header);
  object.header = header;

  if (!object.data) {
    object.data = {};
  }
  var data = object.data;

  object.url = _formatRequestURL(object.url);
  object.method = object.method || 'POST';
  object.requestID = _generateRequestID();

  var oSuccess = object.success || function() {};

  var nSuccess = ({data}) => {
    // setCookies(res.data);
    if (data && data.code == 999) {
      let app = getApp()
      twx.jumpLogin(app.currentPage)
    } else {
      oSuccess(data);
    }
  }
  object.success = nSuccess;

  var oComplete = object.complete || function() {};
  var nComplete = function(res) {
    // remove request
    for (var i = 0; i < _runQueue.length; i++) {
      var obj = _runQueue[i];
      if (obj.requestID == nComplete.requestID) {
        _runQueue.splice(i, 1);
        break;
      }
    }

    if (oComplete) {
      oComplete(res);
    }
    setTimeout(function() {
      //await queue pop request
      if (_requestQueue.length > 0) {
        var nextRequestObject = _requestQueue.splice(0, 1)[0];
        _runQueue.push(nextRequestObject);
        wx.request(nextRequestObject);
      }
    }, 0);
  }

  nComplete.startTime = +new Date();
  nComplete.requestID = object.requestID;
  object.complete = nComplete;

  // add queue
  if (_runQueue.length >= __kMaxRequestCount) {
    _requestQueue.push(object);
  } else {
    _runQueue.push(object);
    wx.request(object);
  }

  return object.requestID;
}

function getCookies() {
  let app = getApp();
  var value = '';
  try {
    var key = wx.getStorageSync('login_key')
    if (key) {
      value = value + 'key=' + key + ';';
    }
    var globalWxappStorageName = wx.getStorageSync('wxappStorageName');
    var appSign = wx.getStorageSync(globalWxappStorageName);
    if (appSign && appSign.wxversion) {
      value = value + 'appkey=' + appSign.wxversion + ';';
    }
    
    // appId
    let appId = wx.getStorageSync('appid');
    if (appId) {
      value = value + `appid=${appId};`
    }
    // openid
    let opkey = wx.getStorageSync('openid_key');
    if (opkey) {
      value = value + `oikey=${opkey};`
    }

  } catch (e) {
    console.log(e);
  }
  return value;
}

function setCookies(data) {
  try {
    if (data) {

    }
  } catch (e) {
    console.log(e);
  }
}

requestd.request = util.wxPromisify(request);
requestd.cancel = cancel;

module.exports = requestd;