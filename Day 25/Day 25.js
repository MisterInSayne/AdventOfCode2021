const fs = require('fs');
const { performance } = require('perf_hooks');

console.clear();

var files = ['Input.txt', 'Example.txt'];
var file = 0;
var input = null;
console.log("Using: "+files[file]);
try {
	input = fs.readFileSync(files[file], 'utf8').split("\r\n");
} catch (err) {
	console.error(err)
}
var startTime = performance.now(); answerP1 = ""; answerP2 = "";
startTime = performance.now();
console.log("");

var sizeX = input.length;
var sizeY = input[0].length;

var grid = [];
for(const l in input){
	grid[l] = [];
	var row = input[l].split("");
	for(const r in row){
		if(row[r] == ">")grid[l][r] = 1;
		if(row[r] == "v")grid[l][r] = 2;
	}
	
}

function printGrid(){
	for(var x = 0; x < sizeX; x++){
		var row = "";
		for(var y = 0; y < sizeY; y++){
			if(grid[x][y] === undefined){row += "."; continue;}
			if(grid[x][y] === 1){row += ">"; continue;}
			if(grid[x][y] === 2){row += "v"; continue;}
		}
		console.log(row);
	}
	console.log("");
}
//printGrid();
var changed = true;
var c = 0;
while(changed){//&& c < 10000
	changed = false;
	var newGrid = [];
	for(var x = 0; x < sizeX; x++){
		newGrid[x] = [];
		for(var y = 0; y < grid[x].length; y++){
			if(grid[x][y] === undefined)continue;
			if(grid[x][y] == 1){
				if(grid[x][(y+1)%sizeY] === undefined && newGrid[x][(y+1)%sizeY] === undefined){
					newGrid[x][(y+1)%sizeY] = 1;
					changed = true;
				}else{
					newGrid[x][y] = 1;
				}
			}
		}
	}
	for(var x = 0; x < sizeX; x++){
		for(var y = 0; y < grid[x].length; y++){
			if(grid[x][y] === undefined)continue;
			if(grid[x][y] == 2){
				if(grid[(x+1)%sizeX][y] != 2 && newGrid[(x+1)%sizeX][y] === undefined){
					newGrid[(x+1)%sizeX][y] = 2;
					changed = true;
				}else{
					newGrid[x][y] = 2;
				}
			}
		}
	}
	grid = newGrid;
	//printGrid();
	c++;
}
answerP1 = c;
//printGrid();

console.log("");
console.log("Part 1 took "+(performance.now()-startTime)+"ms");
console.log("Answer part 1: "+answerP1);
