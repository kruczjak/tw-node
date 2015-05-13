var fs = require('fs');
var file = require('file');
var path = require('path');
var async = require('async');

var walk = function(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) results = results.concat(walk(file));
        else results.push(file)
    });
    return results
};

var countFiles = function(filesList, number, maxCount) {
    var count = 0;
    var file = filesList[number];

    fs.createReadStream(file).on('data', function (chunk) {
        count += chunk.toString('utf8')
            .split(/\r\n|[\n\r\u0085\u2028\u2029]/g)
            .length - 1;
    }).on('end', function () {
        console.log(file, count);

        if (number >= filesList.length -1) {
            console.log('Every line: ', maxCount + count);
            console.timeEnd("Sync");
        } else
            countFiles(filesList, ++number, maxCount + count);

    }).on('error', function (err) {
        console.error(err)
    });
};

function sync(dir) {
    console.time("Sync");
    var filesList = walk(dir);
    countFiles(filesList, 0, 0);
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
