var urlChecker = {
  checkUrl: function (url, port, path) {
    var options = {
        host: url,
        port: port,
        path: path
      },
      start = new Date();

    http.get(options, function(res) {
      var end = new Date(),
          diff = end.getTime() - start.getTime();

      return {
        status: 1,
        time: diff
      };
    }).on('error', function(e) {
      return {
        status: 0,
        time: 0
      };
    });
  }
};
module.exports = function() {
  return urlChecker;
};