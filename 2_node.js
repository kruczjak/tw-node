var fs = require('fs');
var file = require('file');
var path = require('path');
var async = require('async');


function sync(dir) {
    var maxCallbacks = fs.readdirSync(dir).length;
    var maxCount = 0;
    console.time("Sync");

    file.walkSync(dir, function (dirPath, dirs, files) {
        var callbacksInside = files.length;

        async.eachSeries(files, function (file, callback) {
            var count = 0;
            file = path.join(dirPath, '/', file);

            fs.createReadStream(file).on('data', function (chunk) {
                count += chunk.toString('utf8')
                    .split(/\r\n|[\n\r\u0085\u2028\u2029]/g)
                    .length - 1;
            }).on('end', function () {
                maxCount += count;
                console.log(file, count);
                callbacksInside--;
                if (callbacksInside == 0)
                    maxCallbacks--;
                if (maxCallbacks == 0) {
                    console.log('Every line: ', maxCount);
                    console.timeEnd("Sync");
                }
                callback();

            }).on('error', function (err) {
                console.error(err)
            });
        }, function (err) {
            if (err) {
                throw err;
            }
        });
    });
}


function async_method(dir) {
    var maxCallbacks = fs.readdirSync(dir).length;
    var maxCount = 0;
    console.time("Async");

    file.walk(dir, function (nul, dirPath, dirs, files) {
        var callbacksInside = files.length;
        files.forEach(function (file) {
            var count = 0;
            fs.createReadStream(file).on('data', function (chunk) {

                count += chunk.toString('utf8')
                    .split(/\r\n|[\n\r\u0085\u2028\u2029]/g)
                    .length - 1;
            }).on('end', function () {
                maxCount += count;
                console.log(file, count);
                callbacksInside--;
                if (callbacksInside == 0)
                    maxCallbacks--;
                if (maxCallbacks == 0) {
                    console.log('Every line: ', maxCount);
                    console.timeEnd("Async");
                }
            }).on('error', function (err) {
                console.error(err)
            });

        });

    });
}


//async_method('PAM08');
sync('PAM08');
