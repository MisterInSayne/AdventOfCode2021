const fs = require('fs');
const { performance } = require('perf_hooks');

console.clear();

var files = ['Input.txt', 'Example.txt', 'Example2.txt', 'Example3.txt'];
var file = 0;
var input = null;
console.log("Using: "+files[file]);
try {
	input = fs.readFileSync(files[file], 'utf8').split("\r\n");
} catch (err) {
	console.error(err)
}
var startTime = performance.now(); answerP1 = 0; answerP2 = 0;
startTime = performance.now();

class Area{
	subAreas = [];
	deleted = false;
	constructor(on, startpos, endpos) {
		this.startpos = startpos;
		this.endpos = endpos;
		this.on = on;
	}
	
	testOverlap(other){
		if(this.deleted)return false;
		//return (this.startpos[0] <= other.endpos[0] && other.startpos[0] >= this.endpos[0]) && (this.startpos[1] <= other.endpos[1] && other.startpos[1] >= this.endpos[1]) && (this.startpos[2] <= other.endpos[2] && other.startpos[2] >= this.endpos[2]);
		return (Math.max(this.startpos[0], other.startpos[0]) <= Math.min(this.endpos[0], other.endpos[0])) && (Math.max(this.startpos[1], other.startpos[1]) <= Math.min(this.endpos[1], other.endpos[1])) && (Math.max(this.startpos[2], other.startpos[2]) <= Math.min(this.endpos[2], other.endpos[2]))
	}
	
	sliceUp(other){
		var xin = Math.max(this.startpos[0], other.startpos[0]);
		var xax = Math.min(this.endpos[0], other.endpos[0]);
		var yin = Math.max(this.startpos[1], other.startpos[1]);
		var yax = Math.min(this.endpos[1], other.endpos[1]);
		var zin = Math.max(this.startpos[2], other.startpos[2]);
		var zax = Math.min(this.endpos[2], other.endpos[2]);
		if(xin == this.startpos[0] && yin == this.startpos[1] && zin == this.startpos[2] && xax == this.endpos[0] && yax == this.endpos[1] && zax == this.endpos[2]){this.deleted = true; return;}
		var testArea = new Area(false, [xin, yin, zin], [xax, yax, zax]);
		for(const sa in this.subAreas){
			if(this.subAreas[sa].testOverlap(testArea)){
				this.subAreas[sa].sliceUp(testArea);
			}
		}
		this.subAreas.push(testArea);
	}
	
	getSize(){
		if(this.deleted)return 0;
		var size = ((this.endpos[0]-this.startpos[0])+1)*((this.endpos[1]-this.startpos[1])+1)*((this.endpos[2]-this.startpos[2])+1);
		//console.log("Area: size "+size+" "+this.startpos[0]+".."+this.endpos[0]+" "+this.startpos[1]+".."+this.endpos[1]+" "+this.startpos[2]+".."+this.endpos[2]);
		for(const sa in this.subAreas){
			size -= this.subAreas[sa].getSize();
		}
		return size;
	}
	
	getSize50(other){
		if(this.deleted)return 0;
		var xin = Math.max(this.startpos[0], other.startpos[0]);
		var xax = Math.min(this.endpos[0], other.endpos[0]);
		var yin = Math.max(this.startpos[1], other.startpos[1]);
		var yax = Math.min(this.endpos[1], other.endpos[1]);
		var zin = Math.max(this.startpos[2], other.startpos[2]);
		var zax = Math.min(this.endpos[2], other.endpos[2]);
		var testArea = new Area(false, [xin, yin, zin], [xax, yax, zax]);
		//console.log(testArea);
		var sum = testArea.getSize();
		for(const sa in this.subAreas){
			if(this.subAreas[sa].testOverlap(testArea)){
				sum -= this.subAreas[sa].getSize50(testArea);
			}
		}
		return sum;
	}
}

function testSize(){
	var sum = 0;
	for(const a in areas){
		sum += areas[a].getSize();
	}
	return sum;
}
function testSize50(){
	var sum = 0;
	var area50 = new Area(false, [-50, -50, -50], [50, 50, 50]);
	for(const a in areas){
		if(areas[a].testOverlap(area50)){
			sum += areas[a].getSize50(area50);
		}
	}
	return sum;
}

var areas = [];
for(const l in input){
	[_,on, xmin, xmax, ymin, ymax, zmin, zmax] = area = input[l].match(/(on|off) x=(.+)\.\.(.+),y=(.+)\.\.(.+),z=(.+)\.\.(.+)/);
	console.log("Adding: "+on+" "+xmin+".."+xmax+" "+ymin+".."+ymax+" "+zmin+".."+zmax);
	var newArea = new Area(on == "on", [parseInt(xmin), parseInt(ymin), parseInt(zmin)], [parseInt(xmax), parseInt(ymax), parseInt(zmax)]);
	for(const a in areas){
		if(areas[a].testOverlap(newArea)){
			areas[a].sliceUp(newArea);
		}
	}
	if(on == "on")areas.push(newArea);
}
answerP1 = testSize50();
answerP2 = testSize();

console.log("");
console.log("Took "+(performance.now()-startTime)+"ms");
console.log("Answer part 1: "+answerP1);
console.log("Answer part 2: "+answerP2);