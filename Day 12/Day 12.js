const fs = require('fs')

class place {
	big; name; connects = {};;
	constructor(name){
		this.name = name;
		this.big = (name == name.toUpperCase());
	}
	connect(other, obj){ this.connects[other] = obj; }
	trace(path, hasPassedSmallTwice){
		if(!this.big && path.includes(this.name)){
			if(hasPassedSmallTwice || this.name == 'start')return;
			hasPassedSmallTwice = true;
		}
		var nextpath = path.slice();
		nextpath.push(this.name);
		if(this.name == "end"){ paths.push(nextpath); return; }
		for(const p in this.connects){
			this.connects[p].trace(nextpath, hasPassedSmallTwice);
		}
	}
}

var files = ['Input.txt', 'Example.txt', 'Example2.txt', 'Example3.txt'];
var file = 0;
var data = null;
console.log("Using: "+files[file]);
try {
	data = fs.readFileSync(files[file], 'utf8').split("\r\n");
} catch (err) {
	console.error(err)
}

var map = {};
for(const d of data){
	var p = d.split("-");
	if(!map[p[0]])map[p[0]] = new place(p[0]);
	if(!map[p[1]])map[p[1]] = new place(p[1]);
	map[p[0]].connect(p[1], map[p[1]]);
	map[p[1]].connect(p[0], map[p[0]]);
}

var paths = [];
map['start'].trace([], true);
console.log("Answer part 1: "+paths.length);
paths = [];
map['start'].trace([], false);
console.log("Answer part 2: "+paths.length);
