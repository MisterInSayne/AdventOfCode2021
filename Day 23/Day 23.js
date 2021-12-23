const fs = require('fs');
const { performance } = require('perf_hooks');

console.clear();

var files = ['Input.txt', 'Example.txt'];
var file = 0;
var input = null;
console.log("Using: "+files[file]);
try {
	input = fs.readFileSync(files[file], 'utf8');
} catch (err) {
	console.error(err)
}
var startTime = performance.now(); answerP1 = 0; answerP2 = 0;
startTime = performance.now();


var match = input.matchAll(/(A|B|C|D)/g);

var letters = [[],[],[],[]];
var i = 0; y = 0;
for(const m of match){
	letters[i%4].push(m[0]);
	i++;
}

var wants = ['A', 'B', 'C', 'D'];
var slot = {'A':0, 'B':1, 'C':2, 'D':3};
var costslot = [1, 10, 100, 1000];
var costletter = {'A':1, 'B':10, 'C':100, 'D':1000};
var holdpos = [0,1,3,5,7,9,10];

function findoption(holdData, p){
	if(holdData[p])return [];
	var out = [];
	
	for(var r = p-1; r >= 0; r--){
		if(!holdpos.includes(r))continue;
		if(holdData[r])break;
		out.push(r);
	}
	for(r = p+1; r < 11; r++){
		if(!holdpos.includes(r))continue;
		if(holdData[r])break;
		out.push(r);
	}
	return out;
}

function canreach(holdData, f, t){
	for(var i = f+((f<t)?1:-1); i!=t; i+=((f<t)?1:-1)){if(holdData[i])return false;}
	return true;
}
function isEmpty(slotData, lttr){
	var empty = 0;
	for(var s = 0; s<slotData.length; s++){
		if(!slotData[s])empty++;
		else if(slotData[s] != lttr)return 0;
	}
	return empty;
}
function cloneSlotData(slotData){ return [slotData[0].slice(), slotData[1].slice(), slotData[2].slice(), slotData[3].slice()];}

function printInfo(holdData, slotData){
	console.log("#############");
	var line = "#";
	for(var i = 0; i < 11; i++){
		if(holdData[i])line += holdData[i];
		else line += ".";
	}
	console.log(line+"#");
	for(var l = 0; l < slotData[0].length; l++){
		line = (l==0)?"###":"  #";
		for(var i = 0; i < 4; i++){
			if(slotData[i][l])line += slotData[i][l];
			else line += ".";
			line += "#";
		}
		if(l==0)line+="##";
		console.log(line);
	}
	console.log("  #########");
	console.log(" ");
}
var lowestFound = 0;
function findPath(holdData, slotData, cost){
	// test if we can move any lose ones.
	var changed = true;
	while(changed){
		changed = false;
		for(var p = 0; p<11; p++){
			//var p = parseInt(pos);
			if(holdData[p]){
				var to = slot[holdData[p]];
				//see if a slot is free
				if(slotData[to][0])continue;
				// see if we can reach the place we want to go.
				if(!canreach(holdData, p, (to*2)+2))continue;//can't reach it.
				var toY = isEmpty(slotData[to], wants[to]);
				if(toY == 0)continue;
				cost += (Math.abs((p-2)-(to*2))+toY)*costslot[to];
				slotData[to][toY-1] = wants[to];
				holdData[p] = null;
				changed = true;
				break;
			}
		}
	}
	if(lowestFound > 0 && lowestFound <= cost)return 0;
	// Now we losen up all possible letters.
	var lowest = 0;
	var correct = 0;
	for(var l = 0; l<4; l++){
		var done = true;
		var wrong = 0;
		for(var t = 0; t<slotData[l].length; t++){ 
			if(!slotData[l][t]){done = false; continue;}
			if(slotData[l][t] != wants[l]){wrong++; done = false; break;} 
		}
		if(done){correct++; continue; }
		if(wrong == 0)continue;
		for(var s = 0; s<slotData[l].length; s++){
			if(slotData[l][s]){
				var place = (l*2)+2;
				var options = findoption(holdData, place);
				for(const o of options){
					var moveCost =(Math.abs(place-o)+(s+1))*costletter[slotData[l][s]];
					var predictedCost = (Math.abs(((slot[slotData[l][s]]*2)+2)-o)+1)*costletter[slotData[l][s]];
					if(lowestFound > 0 && lowestFound <= cost+moveCost+predictedCost)continue;
					var newHold = holdData.slice();
					var newSlots = cloneSlotData(slotData);
					newHold[o] = slotData[l][s];
					newSlots[l][s] = null;
					var pathCost = findPath(newHold, newSlots, cost+moveCost);
					if(pathCost > 0){
						if(lowest == 0 || lowest > pathCost)lowest = pathCost;
					}
				}
				break;
			}
		}
	}
	if(correct == 4){
		console.log("Found a winner! "+cost);
		if(lowestFound == 0 || lowestFound > cost)lowestFound=cost;
		return cost;
	}
	if(lowest == 0 && correct < 4){
		// no more moves :c
		return 0;
	}
	return lowest;
}
//  0  1  2  3  4  5  6  7  8  9  10
// -2 -1  0  1  2  3  4  5  6  7  8
//        0     1     2     4
//        2     4     6     8

printInfo([,,,,,,,,,,], letters);
answerP1 = findPath([,,,,,,,,,,], letters, 0);

console.log("");
console.log("Part 1 took "+(performance.now()-startTime)+"ms");
console.log("Answer part 1: "+answerP1);
startTime = performance.now();
console.log("");

letters[0].splice(1,0,'D','D');
letters[1].splice(1,0,'C','B');
letters[2].splice(1,0,'B','A');
letters[3].splice(1,0,'A','C');
lowestFound = 0;
printInfo([,,,,,,,,,,], letters);
answerP2 = findPath([,,,,,,,,,,], letters, 0);

console.log("");
console.log("Part 2 took "+(performance.now()-startTime)+"ms");
console.log("Answer part 2: "+answerP2);
