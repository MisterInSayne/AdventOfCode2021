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

function sum(data){
	if(Array.isArray(data)){
		return (sum(data[0])*3)+(sum(data[1])*2);
	}else{
		return data;
	}
}
function add(data, side, n){
	if(Array.isArray(data[side])){
		add(data[side], side, n);
	}else{
		data[side] += n;
	}
}

function explode(data, lvl){
	if(Array.isArray(data)){
		if(lvl == 4){
			if(exploded)[-1,-1];
			return [data[0], data[1]];
		}else{
			var out = [-1, -1];
			var left = explode(data[0], lvl+1);
			if(Array.isArray(left)){
				out[0] = left[0];
				if(left[1] != -1){
					if(Array.isArray(data[1])){
						if(Array.isArray(data[1][0])){
							add(data[1], 0, left[1]);
						}else{
							data[1][0]+=left[1];
						}
					}else{
						data[1]+=left[1];
					}
					left[1] = -1;
					if(lvl == 3){data[0] = 0; exploded = true;}
				}
			}
			
			var right = explode(data[1], lvl+1);
			if(Array.isArray(right)){
				out[1] = right[1];
				if(right[0] != -1){
					if(Array.isArray(data[0])){
						if(Array.isArray(data[0][1])){
							add(data[0], 1, right[0]);
						}else{
							data[0][1]+=right[0];
						}
					}else{
						data[0]+=right[0];
					}
					right[0] = -1;
					if(lvl == 3){data[1] = 0; exploded = true;}
				}
			}
			return out;
		}
	}
}

function chop(data){
	if(chopped)return;
	if(Array.isArray(data[0])){
		chop(data[0]);
	}else{
		if(data[0] > 9){
			data[0] = [Math.floor(data[0]/2), Math.ceil(data[0]/2)];
			chopped = true;
		}
	}
	if(chopped)return;
	if(Array.isArray(data[1])){
		chop(data[1]);
	}else{
		if(data[1] > 9){
			data[1] = [Math.floor(data[1]/2), Math.ceil(data[1]/2)];
			chopped = true;
		}
	}
}

var Data = [];
var exploded = false;
var chopped = false;
for(const l of input){
	var line = JSON.parse(l);
	//console.log(sum(line));
	if(Data.length > 0){ Data = [Data, line]; }else{ Data = line; }
	chopped = true;
	while(chopped || exploded){
		exploded = false;
		chopped = false;
		explode(Data, 0);
		chop(Data, 0);
	};
}

console.log("Answer part 1: "+sum(Data));

var highest = 0;
for(const l in input){
	for(const l2 in input){
		if(l2 != l){
			var testData = [JSON.parse(input[l]), JSON.parse(input[l2])]
			chopped = true;
			while(chopped || exploded){
				exploded = false;
				chopped = false;
				explode(testData, 0);
				chop(testData, 0);
			};
			var result = sum(testData);
			if(result > highest)highest = result;
		}else continue;
	}
}
console.log("Answer part 2: "+highest);
