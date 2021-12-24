const fs = require('fs');
const { performance } = require('perf_hooks');

console.clear();

var files = ['Input.txt', 'Example.txt', "Example 2.txt", "Input2.txt"];
var file = 0;
var input = null;
console.log("Using: "+files[file]);
try {
	input = fs.readFileSync(files[file], 'utf8');
} catch (err) {
	console.error(err)
}
var startTime = performance.now(); answerP1 = ""; answerP2 = "";
startTime = performance.now();
console.log("");

var ranges = [];
var top = [];
var adds = [];
var c = 0;
var chunks = input.split("inp w\r\n").slice(1);

for(const ch in chunks){
	adds.push(parseInt((chunks[ch].match(/add y w\r\nadd y (.+)\r\n/))[1]));
	var tadd = parseInt((chunks[ch].match(/add x (.+)\r\neql x w/))[1]);
	var topadd = 0;
	if(top.length > 0)topadd = adds[top[top.length-1]];
	if(topadd+9>26){
		console.log("Uh oh. That doesn't seem right...");
	}else{
		if(topadd+tadd < 9 && topadd+tadd > -9){
			var diff = topadd+tadd;
			ranges[c] = [];
			ranges[top[top.length-1]] = [];
			if(diff < 0){
				for(var r = 1; r<=9+diff; r++){
					ranges[top[top.length-1]].push(r-diff);
					ranges[c].push(r);
				}
			}else{
				for(var r = 1+diff; r<=9; r++){
					ranges[top[top.length-1]].push(r-diff);
					ranges[c].push(r);
				}
			}
			top.pop();
		}
	}
	if(chunks[ch].indexOf("div z 26")==-1) top.push(c);//Not a divider!
	c++;
}
console.log("Ranges for each number: ");
for(var i = 0; i < 14; i++){
	console.log(i+": "+ranges[i]);
	answerP1 += ranges[i][ranges[i].length-1];
	answerP2 += ranges[i][0];
}

console.log("");
console.log("Part 1 took "+(performance.now()-startTime)+"ms");
console.log("Answer part 1: "+answerP1);
console.log("Answer part 2: "+answerP2);
