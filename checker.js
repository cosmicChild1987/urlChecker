var http = require('http'),
    urlChecker = {
      checkLoop: function (url, port, path, outputFile) {
        var stream = require('stream'),
          fs = require('fs'),
          responseStream = new stream.Readable({objectMode:true}),
          urlChecker = require('../urlChecker/checker.js');

        if (!outputFile) {
          outputFile = new Date().getTime() + '.csv';
        }


        fs.writeFile(outputFile, 'RequestDuration,Start,End\r\n', function(err) {
          if(err && err !== null) {
                console.log(err);
              }
        });
        var WebSocketServer = require('ws').Server,
            wss = new WebSocketServer({host:'localhost', port:8001});

        wss.broadcast = function(data) {
          for (var i in this.clients)
            this.clients[i].send(data);
        };
        responseStream._write = function(data,end,done) {
          this.push(data);
          done();
        };
        responseStream._read = function(){};

        responseStream.on('data', function(response) {
            var stringToAppend = response.time + ',' + response.start.getTime() + ',' + response.end.getTime() + '\r\n';
            wss.broadcast(response.time.toString());
            fs.appendFile(outputFile, stringToAppend, function (err) {
              if(err && err !== null) {
                console.log(err);
              }
            });
        });
        this.runStreamCheck(url, port, path, responseStream);
          
      },
      runStreamCheck: function (url, port, path, stream) {
        var _this = this;
        urlChecker.checkUrl(url, port, path, function (object) {
          stream.push(object);
          _this.runStreamCheck(url, port, path, stream);
          return;
        });
      },
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
                request: options,
                start: start,
                end: end
              }
            );
          }
          res.resume();
        }).on('error', function(e) {
          if (callback) {
            callback(
              {
                status: 0,
                time: 0,
                start: start,
                end: end
              }
            );
          }
        });
      }
    };
module.exports = (function() {
  return urlChecker;
}());