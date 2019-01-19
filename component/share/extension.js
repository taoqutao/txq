import {twx} from '../../twx/twx.js'

Promise.prototype.finally = function (callBack) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callBack()).then(() => value),
    reason => P.resolve(callBack()).then(() => {
      throw reason
    })
  );
}

function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }
      obj.fail = function (res) {
        reject(res)
      }
      fn(obj)
    })
  }
}

function getImageInfoPromisify(){
  return wxPromisify(wx.getImageInfo)
}

export {getImageInfoPromisify};