
var input = [16,1,2,0,4,2,7,1,2,14];
var sum = 0;
var countA = [];
var highest = 0;


for(var i = 0; i < input.length; i++){
    //sum += input[i];
    if(countA[input[i]] == null)countA[input[i]]=0;
    countA[input[i]]++;
    if(input[i] > highest)highest = input[i];
}

function Part1(){
	var lowest = 0;
	var lowestc = 0;
	for(var c = 0; c < highest; c++){
		var sum = 0;
		for(const n in countA){
			sum += Math.abs(c-n)*countA[n];
		}
		//console.log(c +": "+sum);
		if(sum < lowest || lowest == 0){
			lowest = sum;
			lowestc = c;
		}else if(lowest != 0){
			break;
		}
	}
	console.log("Answer Part1: "+lowestc+" with "+ lowest+" power.");
}

function sumBef(nr){
	return (nr/2)*(nr+1);
}

function Part2(){
	var lowest = 0;
	var lowestc = 0;
	
	for(var c = 0; c < highest; c++){
		var sum = 0;
		for(const n in countA){
			sum += sumBef(Math.abs(c-n))*countA[n];
		}
		//console.log(c +": "+sum);
		if(sum < lowest || lowest == 0){
			lowest = sum;
			lowestc = c;
		}else if(lowest != 0){
			break;
		}
	}
	console.log("Answer Part1: "+lowestc+" with "+ lowest+" power.");
}

Part1();
Part2();