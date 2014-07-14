var http = require('http'),
  urlChecker = {
    checkUrl: function (url, port, path, callback) {
      var options = {
          host: url,
          port: port,
          path: path
        },
        start = new Date();

      http.get(options, function(res) {
        var end = new Date(),
            diff = end.getTime() - start.getTime();
        if (callback) {
          callback(
            {
              status: 1,
              time: diff,
              httpStatus: res.statusCode,
              request: options
            }
          );
        }
      }).on('error', function(e) {
        if (callback) {
          callback(
            {
              status: 0,
              request: options
            }
          );
        }
      });
    }
  };
module.exports = (function() {
  return urlChecker;
}());