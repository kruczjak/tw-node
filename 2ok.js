var fs = require('fs');
var file=require('file');
var path = require('path'); 
var async = require('async');


function synch(dir){
  var totalCount=0;
  var dirs = fs.readdirSync(dir);
  var callbacksD=dirs.length;
  console.time("Synctime:");
  file.walkSync(dir,function(dirPath, dirs, files){
    var callbacks=files.length;
    async.eachSeries(files,function(file,callback){
      var count=0;
      file = path.join(dirPath,'/',file);
      //COUNTING LINES
      fs.createReadStream(file).on('data', function(chunk) {
        count += chunk.toString('utf8')
        .split(/\r\n|[\n\r\u0085\u2028\u2029]/g)
        .length-1;
      }).on('end', function() {
        totalCount+=count;
        console.log(file,count);
        callbacks--;
        if(callbacks==0){callbacksD--;}
        if(callbacksD==0){
          console.log('total count is: ',totalCount);
          console.timeEnd("Synctime:");
        }
      callback();
    }).on('error', function(err) {
      console.error(err);
    });

  },function (err) {
    if (err) { throw err; }}
    );
  } );     
}



function asynch(dir){
  var totalCount=0;
  var dirs = fs.readdirSync(dir);
  var callbacksD=dirs.length;
  c,,,,,,onsole.time("time:");
  file.walk(dir,function(nul,dirPath, dirs, files){
    var callbacks=files.length;
    files.forEach(function(file){
      var count=0;
      fs.createReadStream(file).on('data', function(chunk) {

        count += chunk.toString('utf8')
        .split(/\r\n|[\n\r\u0085\u2028\u2029]/g)
        .length-1;
      }).on('end', function() {
        totalCount+=count;
        console.log(file,count);
        callbacks--;
        if(callbacks==0) {callbacksD--;}
        if(callbacksD==0) {
          console.log('total count is: ',totalCount);
          console.timeEnd("time:");
        }
      }).on('error', function(err) {
        console.error(err);
      });

    });

  });
}


//asynch('./PAM08');
synch('./PAM08');
