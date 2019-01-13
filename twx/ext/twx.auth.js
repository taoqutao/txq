//拼券, 用户信息授权的检验和请求逻辑集合

function checkAndReqAuth(obj) {
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: obj.success
        })
      } else {
        wx.authorize({
          scope: "scope.userInfo",
          success: (res) => {
            wx.getUserInfo({
              success: obj.success
            })
          },
          fail: () => _showModal(obj)
        })
      }
    }
  })

}

function _showModal(obj) {
  wx.showModal({
    title: '微信授权提示',
    content: '需要获取您的公开信息（昵称、头像等），请到小程序的设置中打开用户信息授权',
    cancelText: '取消',
    confirmText: '设置',
    success: function(res) {
      if (res.confirm) {
        _openSetting(obj)
      } else if (obj.fail) {
        obj.fail()
      }
    },

    fail: function(res) {
      if (obj.fail) {
        obj.fail()
      }
    }

  })
}

function _openSetting(obj) {
  wx.openSetting({
    success: (res) => {
      if (res.authSetting["scope.userInfo"]) {
        obj.authorized()
      } else if (obj.fail) {
        obj.fail()
      }
    }
  })
}

module.exports = {
  checkAndReqAuth
}