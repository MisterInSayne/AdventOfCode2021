const fs = require('fs');
const { performance } = require('perf_hooks');

console.clear();

var files = ['Input.txt', 'Example.txt'];
var file = 0;
var input = null;
console.log("Using: "+files[file]);
try {
	[algData, input] = fs.readFileSync(files[file], 'utf8').split("\r\n\r\n");
} catch (err) {
	console.error(err)
}
var startTime = performance.now();
startTime = performance.now();

var algData = algData.split("\r\n").join("");
var algorithm = [];
for(var i = 0; i < algData.length; i++){
	algorithm[i] = algData[i]=='#'?1:0;
}

var rawImgData = input.split("\r\n");

var imgSizeX = rawImgData[0].length;
var imgSizeY = rawImgData.length;

var cycle = 0;

var img = [];
for(var x = 0; x < imgSizeX; x++){
	img[x] = [];
	for(var y = 0; y < imgSizeY; y++){
		img[x][y] = (rawImgData[x].charAt(y)=='#')?1:0;
	}
}

function decodePixel(imgData, xin, yin){
	var bits = "";
	for(var x = -1; x <= 1; x++){
		for(var y = -1; y <= 1; y++){
			if(Array.isArray(imgData[x+xin]) && imgData[x+xin][y+yin] != null)bits += imgData[x+xin][y+yin]?"1":"0";
			else if(algorithm[0] && cycle%2) bits += "1";
			else bits += "0";
		}
	}
	return algorithm[parseInt(bits, 2)];
}

function ENHANCE(imgData){
	imgSizeX = imgData.length;
	imgSizeY = imgData[0].length;
	var g = 1;
	var newImg = [];
	for(var x = -g; x < imgSizeX+g; x++){
		newImg[x+g] = [];
		for(var y = -g; y < imgSizeY+g; y++){
			newImg[x+g][y+g] = decodePixel(imgData, x, y);
		}
	}
	return newImg;
}

function countPixels(imgData){
	var out = 0;
	for(var x = 0; x < imgData.length; x++){
		for(var y = 0; y < imgData[0].length; y++){ out += imgData[x][y]; }
	}
	return out;
}

var cycles = 50;
var answerP1 = 0;
for(cycle = 0; cycle<cycles; cycle++){
	img = ENHANCE(img);
	if(cycle == 1)answerP1 = countPixels(img);
}

var answerP2 = countPixels(img);

console.log("Took "+(performance.now()-startTime)+"ms");
console.log("Answer part 1: "+answerP1);
console.log("Answer part 2: "+answerP2);