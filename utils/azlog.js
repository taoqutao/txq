!
  function (n, t) {
    if ("object" == typeof exports && "undefined" != typeof module) {
      module.exports = t()
    } else if ("function" == typeof define && define.amd) {
      define(t)
    } else {
      n.AZLog = t()
    }
  }(this,
    function () {
      function newApp(app) {
        this.app = app
      }
      function wrapper(origObj, tarName, hook) {
        if (origObj[tarName]) {
          var origFunc = origObj[tarName];
          origObj[tarName] = function (_origObj) {
            hook.call(this, _origObj, tarName),
              origFunc.call(this, _origObj)
          }
        } else {
          origObj[tarName] = function (_origObj) {
            hook.call(this, _origObj, tarName)
          }
        }
      }
      function _onLoad(obj) {
        let app = getApp()
        this.setData({
          returnpage: '/'+this.route
        })
        app.currentPage = this
      }
      return function (n) {
        !
          function () {
            var _Page = Page;
              Page = function (origObj) {
                wrapper(origObj, "onLoad", _onLoad),
                _Page(origObj)
              }
          }()
      }()
    });