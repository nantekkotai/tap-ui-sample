function Star(elm, addFunc, removeFunc) {
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
}