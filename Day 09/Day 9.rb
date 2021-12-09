#content = File.new("Example.txt", "r").sysread(256)
content = File.new("Input.txt", "r").sysread(10240)

$map = Hash.new(0);
chars = content.split('');

x = y = 0
chars.each { |c|
	if c == "\n"
		x=0; y +=1
	else 
		if c.ord != 13;
			$map[[x,y]] = c.ord-48
			x +=1
		end
	end
}
$maxx = x-1;
$maxy = y;

part1 = 0;
part2 = [0, 0, 0];

$checked = Hash.new(false);

def flood(startx, starty)
	size = 1;
	$checked[[startx, starty]] = true;
	nextToCheck = [[startx,starty]];
	while pos = nextToCheck.shift do
		x, y = pos;
		(-1..1).each{ |xs|
			if x+xs < 0 || x+xs > $maxx; next; end
			(-1..1).each{ |ys|
				if xs == ys || xs == -ys || y+ys < 0 || y+ys > $maxy || $checked[[x+xs,y+ys]] == true; next; end
				$checked[[x+xs,y+ys]] = true;
				if $map[[x+xs,y+ys]] < 9; size+=1; nextToCheck.push [x+xs,y+ys] end
			}
		}
	end
	
	return size;
end

lasty = 0;
$map.each_key { |pos|
	x, y = pos;
	if lasty < y; lasty=y; end
	n = $map[[x,y]];
	lowest = true;
	(-1..1).each{ |xs|
		if x+xs < 0 || x+xs > $maxx; next; end
		(-1..1).each{ |ys|
			if xs == ys || xs == -ys || y+ys < 0 || y+ys > $maxy; next; end
			n2 = $map[[x+xs,y+ys]];
			if n2 <= n; lowest = false; break; end
		}
		if !lowest; break; end
	}
	if lowest; 
	    if n < 9 && $checked[[x,y]] == false; part2.push(flood(x, y)); end
		part1 += n+1; 
	end
}

puts "Answer part 1: #{part1}"
part2 = part2.sort_by{ |a| a }.reverse
puts "Answer part 2: #{part2[0]}, #{part2[1]} and #{part2[2]} = #{part2[0]*part2[1]*part2[2]}"
