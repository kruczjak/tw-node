file = require("file");
fs = require("fs");
var globalCount = 0;
var count = 0;

function countLines(file, callback) {
  fs.createReadStream(file).on('data', function(chunk) {
                count += chunk.toString('utf8')
                .split(/\r\n|[\n\r\u0085\u2028\u2029]/g)
                .length-1;
            }).on('end', function() {
                console.log(file, count);
                callback();
            }).on('error', function(err) {
                console.error(err);
            });
}

function startSync(path) {
  file.walkSync(path, syncCallback);
  console.log("Global: ", globalCount);
}

function syncCallback(dirPath, dirs, files) {
    var next=false;
    count = 0;
    for (var i=0;i<files.length;i++) {
      countLines(dirPath + '/' + files, function () {
        next = true;
      });
      while(!next) {}
    }
    globalCount+=count;
}

function fork (async_calls, shared_callback) {
  var counter = async_calls.length;
  var all_results = [];
  function makeCallback (index) {
    return function () {
      counter --;
      var results = [];
      // we use the arguments object here because some callbacks
      // in Node pass in multiple arguments as result.
      for (var i=0;i<arguments.length;i++) {
        results.push(arguments[i]);
      }
      all_results[index] = results;
      if (counter == 0) {
        shared_callback(all_results);
      }
    }
  }

  for (var i=0;i<async_calls.length;i++) {
    async_calls[i](makeCallback(i));
  }
}

startSync("./PAM08");
