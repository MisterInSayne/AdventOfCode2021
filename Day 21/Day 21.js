const fs = require('fs');
const { performance } = require('perf_hooks');

console.clear();

var files = ['Input.txt', 'Example.txt'];
var file = 1;
var input = null;
console.log("Using: "+files[file]);
try {
	input = fs.readFileSync(files[file], 'utf8').split("\r\n");
} catch (err) {
	console.error(err)
}
var startTime = performance.now(); answerP1 = 0; answerP2 = 0;
startTime = performance.now();
var position = []
position[0] = parseInt(input[0].match(/: (\d+)/)[1]);
position[1] = parseInt(input[1].match(/: (\d+)/)[1]);

function getRoll(s){
	if(s < 98) return (s*3)+6;
	if(s == 98) return 200;
	if(s == 99) return 103;
}
var points = [0, 0];
var c = 0;
var t = 0;
while(points[0] < 1000 && points[1] < 1000){
	var roll = getRoll(c%100)
	position[t] += roll;
	points[t] += ((position[t]-1)%10)+1;
	c+=3;
	t = t?0:1;
}
console.log("Player 1: "+points[0]);
console.log("Player 2: "+points[1]);
console.log("Total Rolls: "+c);
answerP1 = c*points[t];
console.log("Took "+(performance.now()-startTime)+"ms");
console.log("Answer part 1: "+answerP1);
console.log(" ");

startTime = performance.now();


position[0] = parseInt(input[0].match(/: (\d+)/)[1]);
position[1] = parseInt(input[1].match(/: (\d+)/)[1]);
var chances = [0, 0, 0, 1, 3, 6, 7, 6, 3, 1];
function calculateWins(startA, startB){
	var Wins = [0, 0];
	var t = 0;
	var universes = {};
	universes[startA+","+0+","+startB+","+0] = [[startA, 0], [startB, 0], 1];
	for(var step = 0; step < 19; step++){
		var nextUniverses = {};
		for(const un in universes){
			var u = universes[un];
			for(var x = 3; x <= 9; x++){
				var pos = u[0][0]+x;
				var score = u[0][1]+((pos-1)%10)+1
				if(score >= 21){Wins[t]+=(u[2]*chances[x]); continue;}
				var id = u[1][0]+","+u[1][1]+","+pos+","+score;
				if(nextUniverses[id]){
					nextUniverses[id][2]+=(u[2]*chances[x]);
				}else{ 
					nextUniverses[id] = [[u[1][0], u[1][1]],[pos, score],(u[2]*chances[x])];
				}
			}
		}
		universes = nextUniverses;
		t = t?0:1;
	}
	console.log(Wins);
	return Math.max(Wins[0], Wins[1]);
}

answerP2 = calculateWins(position[0], position[1]);


console.log(" ");
console.log("Took "+(performance.now()-startTime)+"ms");
console.log("Answer part 2: "+answerP2);