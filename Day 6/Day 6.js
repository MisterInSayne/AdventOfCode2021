

var input = [3,4,3,1,2];
/*
var fs = require("fs");
var input = fs.readFileSync(0).toString(); // STDIN
//var input = fs.readFileSync("input.txt").toString();

var inputdata = input.split("\n");
*/


var maturedays = 2;
var spawndays = 14;

function CalcPopulation(days){
    var spawners = [{s:0,b:0},{s:0,b:0},{s:0,b:0},{s:0,b:0},{s:0,b:0},{s:0,b:0},{s:0,b:0}];
    for(var i = 0; i < input.length; i++){
        spawners[input[i]].s++;
    }
    for(var d = 0; d < days; d++){
        spawners[(d+2)%7].b += spawners[d%7].s;
        spawners[d%7].s += spawners[d%7].b;
        spawners[d%7].b = 0;
    }
    var spawned = 0;
    for(var i = 0; i < spawners.length; i++){
        spawned += spawners[i].s+spawners[i].b;
    }
    console.log("Answer after "+days+" Days: "+spawned);
}

CalcPopulation(18);
CalcPopulation(80);
CalcPopulation(256);