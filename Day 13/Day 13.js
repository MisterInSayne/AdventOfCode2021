const fs = require('fs')

console.clear();

var file = 'Input.txt';
//var file = 'Example.txt';
var data = null;
try {
	data = fs.readFileSync(file, 'utf8')
} catch (err) {
	console.error(err)
}
var pieces = data.split("\r\n\r\n");
var positionData = pieces[0].split("\r\n");
var foldData = pieces[1].split("\r\n");

var posdata = {};
for (const p in positionData) {
	var posstr = positionData[p].split(",");
	var pos = [parseInt(posstr[0]), parseInt(posstr[1])];
	posdata[pos] = pos;
}

var p1 = 0;
var sizeX = 0;
var sizeY = 0;
for (const f in foldData) {
	var dir = (foldData[f].charAt(11)=="x"?0:1);
	var place = parseInt(foldData[f].substr(13));
	var newposdata = {};
	sizeX = 0;
	sizeY = 0;
	for(const p in posdata){
		var pos = posdata[p];
		if(pos[dir] > place){
			pos[dir] = place - (pos[dir]-place);
		}
		if(pos[0] > sizeX) sizeX = pos[0];
		if(pos[1] > sizeY) sizeY = pos[1];
		newposdata[pos] = pos;
	}
	if(f == 0){
		console.log("Answer Part 1: "+Object.keys(newposdata).length);
	}
}
console.log("Answer Part 2: ");
var Text = Array.from({length: sizeY + 1}, e=>Array(sizeX + 1).fill(" "));
for(const p in posdata){ Text[posdata[p][1]][posdata[p][0]] = "#"; }
for(const t in Text){ console.log(Text[t].join("")); }
