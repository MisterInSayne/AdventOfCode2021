<?php
$f = fopen( 'Input.txt', 'r' ) or die("Unable to open file!");
//$f = fopen( 'Example.txt', 'r' ) or die("Unable to open file!");

$grid = array();
$liney = 0;
while( $line = fgets( $f ) ) {
	$grid[$liney] = str_split(substr($line, 0, 10));
	$liney++;
}
fclose($f);

$flashed = array_fill(0, 10, array_fill(0, 10, 0));
$cycle = 0;
$flashes = 0;

function add($x, $y, $cycle){
	global $flashed, $grid, $flashes;
	if($flashed[$x][$y] == $cycle)return;
	$grid[$x][$y]++;
	if($grid[$x][$y] > 9){
		$flashed[$x][$y] = $cycle;
		$grid[$x][$y] = 0;
		$flashes++;
		for($xf = -1; $xf <= 1; $xf++){
			if($x+$xf < 0 || $x+$xf > 9)continue;
			for($yf = -1; $yf <= 1; $yf++){
				if($y+$yf < 0 || $y+$yf > 9)continue;
				add($x+$xf, $y+$yf, $cycle);
			}
		}
	}
}

$time_start = microtime(true); 
$answerP1 = 0;
$answerP2 = 0;
while(!($cycle > 100 && $answerP2 != 0) && $cycle < 1000){
	$cycle++;
	$flashes = 0;
	for($x = 0; $x < 10; $x++){
		for($y = 0; $y < 10; $y++){
			add($x, $y, $cycle);
		}
	}
	if($cycle <= 100) $answerP1 += $flashes;
	if($flashes == 100 && $answerP2 == 0)$answerP2 = $cycle;
}

$time_end = microtime(true);

print_r("Flashes in the firrst 100 cycles : ".$answerP1."\n");
print_r("Cycle where all squids flash: ".$answerP2."\n");
print_r("execution time: ".round(($time_end - $time_start)*1000,3)."ms \n");
?>
