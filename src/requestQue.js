
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

