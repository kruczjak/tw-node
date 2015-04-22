async = require("async");
function printAsync(s, cb) {
   var delay = Math.floor((Math.random()*1000)+500);
   setTimeout(function() {
       console.log(s);
       if (cb) cb();
   }, delay);
}

function task1(cb) {
    printAsync("1", function() {
        task2(cb);
    });
}

function task2(cb) {
    printAsync("2", function() {
        task3(cb);
    });
}

function task3(cb) {
    printAsync("3", cb);
}

// wywolanie sekwencji zadan
//task1(function() {
//    console.log('done!');
//});


/* 
** Zadanie:
** Napisz funkcje loop(n), ktora powoduje wykonanie powyzszej 
** sekwencji zadan n razy.
** 
*/

// loop(4);

function water(n) {
  var x = n;

  var waterA = async.waterfall([
    function (callback) {
	task1(function() {
    		callback(null);
	});	
  }, function (callback) {
    waterA();
  }

  ], function(err, result) {
  //err
  });
}

water(4);
