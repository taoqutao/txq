// 判断是否为登录状态 
// jumpLogin 参数传 true 表示非登录状态会自动弹出登录页面
// pageObejct 当前页面对象
// example.
// isLogin(true, this)
function isLogin(jumpLogin, pageObejct) {
  var key = wx.getStorageSync('twxlogin_userId');
  if (key) {
    return true;
  } else {
    if (jumpLogin) {
      this.jumpLogin(pageObejct);
    }
    return false;
  }
}

// 调起登陆页
// pageObejct 当前页面对象
function jumpLogin(obj) {
  wx.removeStorageSync('twxlogin_userId');
  var returnpage = '';
  if (obj.data.returnpage)
    returnpage = encodeURIComponent(obj.data.returnpage);

  //增加来自页面类型，没有传值表示来自正常页面，
  //传值switchTab表示来自switchTab页面，在做往回跳转时需要单独处理
  var fromPageType; //switchTab or other
  if (obj.data.fromPageType)
    fromPageType = encodeURIComponent(obj.data.fromPageType);
  //增加来自页面层级数，为1代表是第一层页面，采用可返回跳转navigateTo
  var fromPageLevel;
  if (obj.data.fromPageLevel)
    fromPageLevel = obj.data.fromPageLevel;

  setTimeout(function () {
    //为1代表是第一层页面，采用可返回跳转navigateTo
    if (fromPageLevel && fromPageLevel == 1) {
      wx.navigateTo({
        url: '/pages/other/login?returnpage=' + returnpage + (fromPageType ? '&fromPageType=' + fromPageType : '')
      })
    } else {
      wx.redirectTo({
        url: '/pages/other/login?returnpage=' + returnpage + (fromPageType ? '&fromPageType=' + fromPageType : '')
      })
    }

  }, 500)
}

export {
  isLogin,
  jumpLogin
}