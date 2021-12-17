const fs = require('fs')

console.clear();

var files = ['Input.txt', 'Example.txt'];
var file = 0;
var data = null;
console.log("Using: "+files[file]);
try {
	data = fs.readFileSync(files[file], 'utf8').match(/^target area: x\=(.+)\.\.(.+)\, y\=(.+)\.\.(.+)$/);
} catch (err) {
	console.error(err)
}

var xMin = parseInt(data[1]); xMax = parseInt(data[2]); yMin = parseInt(data[3]); yMax = parseInt(data[4]);
console.log("Target Area; "+xMin+", "+xMax+" by "+yMin+", "+yMax);

function getAnswer1(){ return ((-1-yMin)*((-1-yMin)+1))/2; }
function sum(n){return (n*(n+1))/2;}
function sumSteps(n, step){ return ((n-step)*step)+(step*(step+1))/2;}
function unSum(n){ return Math.round(Math.sqrt(n*2)); }
var xlowest = unSum(xMin);
var xhighest = unSum(xMax+1)-1;


function findXfor(s){
	return [(s >= xlowest)?xlowest:Math.ceil((xMin-sum(s))/s)+s, (s >= xhighest)?xhighest:Math.floor((xMax-sum(s))/s)+s];
}

var posibilities = new Set();
var ylimit = (0-yMin)*2;
for(var s=1; s<=ylimit; s++){
	var min = Math.ceil((yMin-sum(s))/s)+s;
	var max = Math.floor((yMax-sum(s))/s)+s;
	if(sumSteps(min, s) >= yMin && sumSteps(min, s) <= yMax){
		var xoptions = findXfor(s);
		for(var y = min; y <= max; y++){
			for(var x = xoptions[0]; x <= xoptions[1]; x++){
				posibilities.add(x+","+y);
			}
		}
	}
}

console.log("Answer Part 1: ["+xlowest+","+(-1-yMin)+"] with "+getAnswer1()+" as the highest y");
console.log("Answer Part 2: "+posibilities.size);
	