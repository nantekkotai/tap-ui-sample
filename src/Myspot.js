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
}