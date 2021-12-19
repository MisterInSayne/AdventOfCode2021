const fs = require('fs');
const { performance } = require('perf_hooks');

console.clear();

var files = ['Input.txt', 'Example.txt', 'Example2.txt', 'Example3.txt'];
var file = 0;
var input = null;
console.log("Using: "+files[file]);
try {
	input = fs.readFileSync(files[file], 'utf8').split("\r\n\r\n");
} catch (err) {
	console.error(err)
}
var startTime = performance.now();

class Beacon {
	x; y; z; relPos; overlaps;
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.relPos = [];
		this.overlaps = [];
	}
	
	testMatch(other, key){
		var matching = 0;
		var l = this.relPos.length;
		var tested = 0;
		for(const p of this.relPos){
			for(const r of other.relPos){
				if(p[0] == r[keys[key][0]] && p[1] == r[keys[key][1]] && p[2] == r[keys[key][2]]){
					matching++;
					break;
				}
			}
			if(matching > 5)return true;
			if((++tested)-matching > other.relPos.length-13)return false;
		}
	}
	
	rotpos(flip, r){
		var out = [this.x, this.y, this.z];
		return [(flip[0]?-out[keys[r][0]]:out[keys[r][0]]), (flip[1]?-out[keys[r][1]]:out[keys[r][1]]), (flip[2]?-out[keys[r][2]]:out[keys[r][2]])];
	}
	relpos(flip, r, p){
		var out = this.rotpos(flip, r);
		return [out[0]+p[0], out[1]+p[1], out[2]+p[2]];
	}
}

function diff(n1, n2){return Math.max(n1,n2)-Math.min(n1,n2);}
function distance(posa, posb){ return diff(posb[0],posa[0])+diff(posb[1],posa[1])+diff(posb[2],posa[2]); }


var keys = [[0, 1, 2], [1, 2, 0], [2, 0, 1], [1, 0, 2], [0, 2, 1], [2, 1, 0]];
var keymap = [[ 0, 1, 2, 3, 4, 5 ],[ 1, 2, 0, 4, 5, 3 ],[ 2, 0, 1, 5, 3, 4 ],[ 3, 5, 4, 0, 2, 1 ],[ 4, 3, 5, 1, 0, 2 ],[ 5, 4, 3, 2, 1, 0 ]]
class Sensor {
	x; y; z; beacons; matchedkeys; id; flips; pos; relRot = 0; done;
	constructor(id){
		this.id = id;
		this.beacons = [];
		this.matchedkeys = [];
		this.flips = [false, false, false];
		this.pos = [0,0,0];
		this.done = false;
	}
	
	addBeacon(x, y, z){
		this.beacons.push(new Beacon(x, y, z));
	}
	
	linkBeacons(){
		var l = this.beacons.length;
		for(var a = 0; a < l; a++){
			for(var b = a+1; b < l; b++){
				var relPos = [Math.abs(this.beacons[a].x-this.beacons[b].x), Math.abs(this.beacons[a].y-this.beacons[b].y), Math.abs(this.beacons[a].z-this.beacons[b].z)];
				this.beacons[a].relPos.push(relPos);
				this.beacons[b].relPos.push(relPos);
			}
		}
	}
	
	findTwoBeacons(other){
		var outBeacons = [];
		var otherBeacons = [];
		var tested = 0;
		for(const a of this.beacons){
			for(const b of other.beacons){
				for(var i = 0; i < keys.length; i++){
					if(a.testMatch(b, i)){
						outBeacons.push(a);
						otherBeacons.push(b);
						if(outBeacons.length == 2)return [i, outBeacons, otherBeacons];
						break;
					}
				}
			}
			if(++tested > 3 && outBeacons.length == 0)return;
		}
	}
	
	findMatchAndPosition(other){
		var lData = this.findTwoBeacons(other);
		if(lData){
			Sensors[other.id].relRot = keymap[this.relRot][lData[0]];
			console.log("Found match for "+this.id+" and "+other.id);
			var posa = lData[1][0].relpos(this.flips, this.relRot, this.pos);
			var posb = lData[1][1].relpos(this.flips, this.relRot, this.pos);
			var oposa = lData[2][0].rotpos([false, false, false], Sensors[other.id].relRot);
			var oposb = lData[2][1].rotpos([false, false, false], Sensors[other.id].relRot);
			var flipx = (posa[0]-posb[0] != oposa[0]-oposb[0]);
			var flipy = (posa[1]-posb[1] != oposa[1]-oposb[1]);
			var flipz = (posa[2]-posb[2] != oposa[2]-oposb[2]);
			Sensors[other.id].flips = [flipx, flipy, flipz];
			oposa = lData[2][0].rotpos(Sensors[other.id].flips, Sensors[other.id].relRot);
			var actualpos = [(posa[0]-oposa[0]), (posa[1]-oposa[1]), (posa[2]-oposa[2])];
			console.log("Position for sensor "+other.id+": "+actualpos);
			Sensors[other.id].pos = actualpos;
			Sensors[other.id].findOthers();
		}
	}
	
	findOthers(){
		this.done = true;
		for(const s in Sensors){
			if(s == this.id || Sensors[s].done)continue;
			this.findMatchAndPosition(Sensors[s]);
		}
	}
	
	mapAllBeacons(){
		for(const b of this.beacons){
			beaconMap.add(b.relpos(this.flips, this.relRot, this.pos).toString());
		}
	}
}

var reg = /(.+)\,(.+)\,(.+)/gm;
var Sensors = [];
for(const l in input){
	var dataset = input[l].matchAll(reg);
	Sensors.push(new Sensor(Sensors.length));
	for(const i of dataset){
		Sensors[l].addBeacon(parseInt(i[1]),parseInt(i[2]),parseInt(i[3]));
	}
	Sensors[l].linkBeacons();
}

Sensors[0].findOthers();

var beaconMap = new Set();
var l = Sensors.length;
for(var i = 0; i<l; i++){
	Sensors[i].mapAllBeacons();
}

console.log("Took "+(performance.now()-startTime)+"ms");
console.log("Answer part 1: "+beaconMap.size);


startTime = performance.now();
var highest = 0;
for(var i = 0; i<l; i++){
	for(var j = i+1; j<l; j++){
		var dist = distance(Sensors[i].pos, Sensors[j].pos);
		if(dist > highest)highest = dist;
	}
}

console.log("Took "+(performance.now()-startTime)+"ms");
console.log("Answer part 2: "+highest);
