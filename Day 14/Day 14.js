const fs = require('fs')
const { performance } = require('perf_hooks');

console.clear();

var files = ['Input.txt', 'Example.txt'];
var file = 1;
var data = null;
console.log("Using: "+files[file]);
try {
	data = fs.readFileSync(files[file], 'utf8');
} catch (err) {
	console.error(err)
}

var [template, rulestring] = data.split("\r\n\r\n");
console.log("Using template: "+template);

var rules = {};
var letters = {};

function combine(a, b){
	for(const k in b){
		if(a[k] == null){
			a[k] = b[k];
		}else{
			a[k] += b[k];
		}
	}
	return a;
}

class rule {
	name; next; connectiona; connectionb; testcache; lettercache;
	constructor(name, next){
		this.name = name.split("");
		this.next = next;
		letters[next] = 0;
	}
	link(){
		this.connectiona = rules[this.name[0]+this.next];
		this.connectionb = rules[this.next+this.name[1]];
	}
	grow(steps){
		if(steps >= precachesize){
			for(const k in this.lettercache){
				letters[k] += this.lettercache[k];
			}
			if(steps > precachesize){
				for(const c of this.testcache){
					c.grow(steps-precachesize);
				}
			}
		}
	}
	
	precache(){
		this.testcache = this.testgrowth(precachesize);
		this.lettercache = this.testletters(precachesize);
	}
	
	testgrowth(steps){
		if(steps == 0){
			return [this];
		}else{
			return this.connectiona.testgrowth(steps-1).concat(this.connectionb.testgrowth(steps-1));
		}
	}
	
	testletters(steps){
		var a = {};
		var b = {};
		if(steps > 1){
			a = this.connectiona.testletters(steps-1);
			b = this.connectionb.testletters(steps-1);
		}
		if(a[this.next] == null)a[this.next]=0;
		a[this.next]++;
		return combine(a, b);
	}
}

var ruledata = rulestring.split("\r\n");

var start = template.split("");

for(const r of ruledata){
	var [name, next] = r.split(" -> ");
	rules[name] = new rule(name, next);
}
console.log("Linking rules.");

var startTime = performance.now();
var precachesize = 20;
for(const r in rules){ rules[r].link(); }
console.log("Precaching rules.");
for(const r in rules){ rules[r].precache(); }
console.log("Took "+(performance.now()-startTime)+"ms");
console.log("Starting process.");
startTime = performance.now();
var cycles = 40;
var ends = (2**(cycles-1));
var finished = 0;
var partOneLetters = {};
for(var i = 0; i < start.length-1; i++){
	combine(partOneLetters, rules[start[i]+start[i+1]].testletters(10));
}
for(const l of start)partOneLetters[l]++;
for(const l of start)letters[l]++;
for(var i = 0; i < start.length-1; i++){
	console.log("Processing: "+start[i]+start[i+1]);
	finished = 0;
	rules[start[i]+start[i+1]].grow(cycles);
}
console.log("Took "+(performance.now()-startTime)+"ms");

var most = 0, least = 100000000000000000000000000000;
var mostb = 0, leastb = 100000000000000000000000000000;
for(const l in letters){
	if(partOneLetters[l] < least)least = partOneLetters[l];
	if(partOneLetters[l] > most)most = partOneLetters[l];
	if(letters[l] < leastb)leastb = letters[l];
	if(letters[l] > mostb)mostb = letters[l];
}
console.log("Answer part 1: "+(most-least));
console.log("Answer part 2: "+(mostb-leastb));



