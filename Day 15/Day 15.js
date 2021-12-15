const fs = require('fs')

console.clear();

var files = ['Input.txt', 'Example.txt'];
var file = 0;
var data = null;
console.log("Using: "+files[file]);
try {
	data = fs.readFileSync(files[file], 'utf8');
} catch (err) {
	console.error(err)
}

var lines = data.split("\r\n");
var riskmap = [];
console.log("Creating riskmap.");
for(const l in lines){
	riskmap[l] = [];
	var numbrs = lines[l].split("");
	for(const n in numbrs){
		riskmap[l][n] = +numbrs[n];
	}
}
console.log("Finding best path.");

var sizeX = riskmap.length-1;
var sizeY = riskmap[sizeX].length-1;
var maxSizeX = ((sizeX+1)*5)-1;
var maxSizeY = ((sizeY+1)*5)-1;
var floodmap = Array.from({length: (maxSizeX+1)}, e=>Array((maxSizeY+1)).fill(-1));
var processqueue = [[[0,1],[1,0]]];
floodmap[0][0] = 0;
var neighbours = [[-1, 0], [1, 0], [0, -1], [0, 1]];
function findLowestNeighbour(x, y){
	var lowest = 10000;
	for(const n in neighbours){
		var [xs, ys] = neighbours[n];
		if(x+xs < 0 || x+xs > maxSizeX || y+ys < 0 || y+ys > maxSizeY)continue;
		var nr = floodmap[x+xs][y+ys];
		if(nr == -1 || nr > lowest)continue;
		lowest = nr;
	}
	return lowest;
}

while(processqueue.length){
	var q = processqueue.shift();
	for(const p in q){
		var [x, y] = q[p];
		var risk = (((riskmap[x%(sizeX+1)][y%(sizeY+1)]+Math.floor(x/(sizeX+1))+Math.floor(y/(sizeY+1)))-1)%9)+1;
		var nr = findLowestNeighbour(x, y)+risk;
		if(floodmap[x][y] == -1 || floodmap[x][y] > nr){
			floodmap[x][y] = nr;
			if(processqueue[risk] == null)processqueue[risk] = [];
			for(const n in neighbours){
				var [xs, ys] = neighbours[n];
				if(x+xs < 0 || x+xs > maxSizeX || y+ys < 0 || y+ys > maxSizeY)continue;
				if(floodmap[x+xs][y+ys] == -1){
					processqueue[risk].push([x+xs, y+ys]);
				}
			}
		}
	}
}

console.log("Answer part 1: "+floodmap[sizeX][sizeY]);
console.log("Answer part 2: "+floodmap[maxSizeX][maxSizeY]);
