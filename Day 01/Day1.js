var fs = require("fs");
var input = fs.readFileSync(0).toString(); // STDIN
//var input = fs.readFileSync("input.txt").toString();

var inputdata = input.split("\n");

function Part1(data){
	var last = data[0];
	var count = 0;
	for(var i in data){
		if(parseInt(data[i],10) > parseInt(last,10)){
			count++
		}
		last = data[i];
	}
	console.log("Part 1: "+count);
}

function getCombined3(index, data){
	return parseInt(data[index],10)+parseInt(data[index+1],10)+parseInt(data[index+2],10)
}
function Part2(data){
	var last = getCombined3(0, data);
	var count = 0;
	for(var i=1; i<data.length-2; ++i){
		var current = getCombined3(i, data);
		if(current > last){
			count++
		}
		last = current;
	}
	console.log("Part 2: "+count);
}

Part1(inputdata);
Part2(inputdata);