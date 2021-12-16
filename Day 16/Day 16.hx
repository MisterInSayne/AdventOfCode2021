using Lambda;
using haxe.Int64;

class Day16 {
	static public var versionSum:Int = 0;
	
	static public function main():Void {
		var line:String;
		var bits = ["0" => "0000", "1" => "0001", "2" => "0010", "3" => "0011", "4" => "0100", "5" => "0101", "6" => "0110", "7" => "0111", "8" => "1000", "9" => "1001", "A" => "1010", "B" => "1011", "C" => "1100", "D" => "1101", "E" => "1110", "F" => "1111"];
		var bitData:String = "";
		try {
			while (true) {
				line = Sys.stdin().readLine();
				var arr = line.split('');
				for(a in arr){
					bitData += bits[a];
				}
			}
		} catch (e:haxe.io.Eof) {}
		var result = readData(bitData, 0, "000");
		trace('Answer part 1: $versionSum');
		trace('Answer part 2: ${result[1]}');
	}
	
	static public function readData(data:String, subPackets:Int, type:String):Array<Int64> {
		var pos:Int = 0;
		var foundPackets:Int = 0;
		var outData:Array<Int64> = [];
		while(pos < data.length-7 && (subPackets == 0 || foundPackets < subPackets)){
			versionSum += toNumber(data.substr(pos, 3)).low;
			pos+=3;
			var typeID:String = data.substr(pos, 3);
			pos+=3;
			if(typeID == "100"){
				var foundEnd:Bool = false;
				var numberData:String = "";
				while(!foundEnd){
					if(data.charAt(pos) == "0")foundEnd=true;
					pos+=1;
					numberData += data.substr(pos, 4);
					pos+=4;
				}
				outData.push(toNumber(numberData));
			}else{
				var sizeIndicator = data.charAt(pos);
				var size:Int = (sizeIndicator == "0")?15:11;
				pos+=1;
				var length:Int = toNumber(data.substr(pos, size)).low;
				pos+=size;
				var packet = (sizeIndicator == "0")?readData(data.substr(pos, length), 0, typeID):readData(data.substr(pos), length, typeID);
				pos+=packet[0].low;
				outData.push(packet[1]);
			}
			foundPackets++;
		}
		var out:Int64 = 0;
		switch type{
			case "000": out = outData.fold(function(num, total) return total += num, 0);
			case "001": out = outData.fold(function(num, total) return total *= num, 1);
			case "010": out = outData.fold(function(num, total) return total = (num < total || total == 0)?num:total, 0);
			case "011": out = outData.fold(function(num, total) return total = (num > total)?num:total, 0);
			case "101": out = outData[0] > outData[1]?1:0;
			case "110": out = outData[0] < outData[1]?1:0;
			case "111": out = outData[0] == outData[1]?1:0;
		}
		return [Int64.make(0, pos), out];
	}
	
	public static function toNumber(binary:String):Int64 {
		var value:Int64 = 0;
		var l:Int = (binary.length-1);
		for(power in 0...l+1) {
			if(binary.charAt(l-power) == '1') {
				value += haxe.Int64.fromFloat(Math.pow(2, power));
			}
		}
		return value;
	}
}
