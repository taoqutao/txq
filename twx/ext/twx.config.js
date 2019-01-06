// twx.config.js 
var debug = false
var envConfig = ["production", "stg", "test"];
var envSelIdx = 0;
if (debug) {
  wx.setStorageSync('envSelectedIdx', envSelIdx);
  let storageEnvSelIdx = wx.getStorageSync('envSelectedIdx');
  if (typeof(storageEnvSelIdx) != 'undefined' && isNaN(parseInt(storageEnvSelIdx)) == false) {
    envSelIdx = parseInt(storageEnvSelIdx);
  }
}
var env = envConfig[envSelIdx];
var config = {
  env: env,
  debug: debug,
  appId: 'wx2669fc45a313f669', //独立小程序的APPID
  host: function() {
    if (env == 'production') {
      return 'm.taoqutao.com';
    } else if (env == 'stg') {
      return 'm.taoqutao.com';
    } else if (env == 'test') {
      return '192.168.0.107:8011';
    } else {
      return 'm.taoqutao.com';
    }
  },

  // debugSetupConfig: function() {
  //   var app = getApp();
  //   let envSelectedIdx = parseInt(wx.getStorageSync('envSelectedIdx'))
  //   let newEnv = envConfig[isNaN(envSelectedIdx) ? 0 : envSelectedIdx];
  //   if (envSelectedIdx) {
  //     app.globalRequestUrl = 'https://wxapp.m.tqt.com'
  //   } else {
  //     app.globalRequestUrl = 'https://wxapp.m.tqt.com'
  //   }
  //   env = newEnv;
  // }
}
module.exports = config;