// stub
function Myspot() {

  function _requestToken(success, error) {
    setTimeout(function(){
      if (success && typeof success == 'function') success({ data: 'request-token' });
    }, 500);
  }

  return {
    add: function (data, success, error) {
      _requestToken(function () {
        setTimeout(function () {
          if (success && typeof success == 'function') success();
        }, 500);
      });
    },
    remove: function (data, success, error) {
      _requestToken(function () {
        setTimeout(function () {
          if (success && typeof success == 'function') success();
        }, 500);
      });
    }
  }
};function Star(elm, addFunc, removeFunc) {
  if (!elm) return;
  elm = $(elm);

  var offset = elm.offset(),
      size = { width: elm.innerWidth(), height: elm.innerHeight() },
      effectiveRange = {
        minX: offset.left,
        maxX: offset.left + size.width,
        minY: offset.top,
        maxY: offset.top + size.height
      };

  function isEffective(x, y) {
    return !!(effectiveRange.minX <= x
            && x <= effectiveRange.maxX
            && effectiveRange.minY <= y 
            && y <= effectiveRange.maxY);
  }

  function throttle(ms) {
    var _before,
        timerId;

    return function (func) {
      _before = func;
      if (timerId) {
        clearTimeout(timerId);
        delete timerId;
      }
      timerId = setTimeout(_before, ms);
    }
  }
  var thr = throttle(300);

  elm
  .bind('touchstart', function () {
     $(this).addClass('on');
  })
  .bind('touchmove', function (e) {
    if (isEffective(event.changedTouches[0].pageX, event.changedTouches[0].pageY)) {
       $(this).addClass('on');
    } else {
       $(this).removeClass('on');
    }
  })
  .bind('touchend', function () {
    $(this).removeClass('on');
    if (!isEffective(event.changedTouches[0].pageX, event.changedTouches[0].pageY)) return;

    var $star = $($(this).find('i'));
    if ($star.hasClass('fa-star-o')) {
      $star.removeClass('fa-star-o').addClass('fa-star');
      if (addFunc && typeof addFunc == 'function') {
        thr(addFunc);
      }

    } else {
      $star.removeClass('fa-star').addClass('fa-star-o');
      if (removeFunc && typeof removeFunc == 'function') {
        thr(removeFunc);
      }
    }
  });

  this.elm = elm;
}
Star.prototype = {
  check: function () {

  },

  toggle: function () {

  },

  on: function () {

  },

  off: function () {

  }
};
var requestQue = (function(){

  var _ques = [],
      _maxCount = 0,
      _isLocked = false,
      _subscribe = null;

  return {
    subscribe: function (func) {
      _subscribe = func;
    },

    notice: function () {
      if (_subscribe && typeof _subscribe == 'function') {
        _subscribe({
          currentQueLength: this.count(),
          maxCount: _maxCount
        });
      }
    },

    count: function () {
      return _ques.length;
    },

    lock: function (flag) {
      if (flag === true || flag === false) _isLocked = flag;
      return _isLocked;
    },

    addMyspot: function (data, cb) {
      var self = this;

      _maxCount += 1;
      _ques.push(function(){
        Myspot().add(data, function() {
          self.lock(false);
          self.notice();
          if (cb && typeof cb == 'function') cb();
          self.next();
        });
      });
      this.notice();

      if (this.lock() !== true) this.next();

      return this;
    },

    removeMyspot: function (data, cb) {
      var self = this;

      _maxCount += 1;
      _ques.push(function(){
        Myspot().remove(data, function() {
          self.lock(false);
          self.notice();
          if (cb && typeof cb == 'function') cb();
          self.next();
        });
      });
      this.notice();

      if (this.lock() !== true) this.next();

      return this;
    },

    next: function () {
console.log("[NEXT]", this.lock());
      if (this.lock() === true) return;
      this.lock(true);

      var next = _ques.shift();
      if (next && typeof next == 'function') {
        next();
      
      } else {
        this.clear();
        this.notice();
      }

      return this;
    },

    clear: function () {
      _ques = [];
      this.lock(false);
      _maxCount = 0;

      return this;
    }
  };

})();

