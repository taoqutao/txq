
function throttle(fn, gap) {
    if (gap == null || gap == undefined) {
        gap = 1000
    }
    let _last = null
    return function () {
        let _now = + new Date()
        if (_now - _last > gap || !_last) {
            fn.apply(this, arguments)
            _last = _now
        }
    }
}

export { throttle }