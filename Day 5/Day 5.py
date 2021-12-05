import re

fields = [[[0, 0] for i in range(0,1000)] for j in range(0,1000)]
countP1 = 0;
countP2 = 0;

def processLine(xa, ya, xb, yb):
    global fields
    global countP1
    global countP2
    vector = {'x': (xa-xb)/abs(xa-xb) if xa-xb != 0 else 0, 'y': (ya-yb)/abs(ya-yb) if ya-yb != 0 else 0, 'mag': max(abs(xa-xb), abs(ya-yb)), 'angled': not (xa == xb or ya == yb)}
    for r in range(0, vector['mag']+1):
        pos = {'x': int(xb+(vector['x']*r)), 'y': int(yb+(vector['y']*r))}
        if not vector['angled']:
            if fields[pos['x']][pos['y']][0] == 1:
                countP1 += 1
            fields[pos['x']][pos['y']][0] += 1
        if fields[pos['x']][pos['y']][1] == 1:
                countP2 += 1
        fields[pos['x']][pos['y']][1] += 1

f = open("input.txt", "r")

matches = re.findall(r'(\d*),(\d*) \-\> (\d*),(\d*)', f.read())


for m in matches:
    processLine(int(m[0]), int(m[1]), int(m[2]), int(m[3]))

print("Answer Part 1: " + str(countP1))
print("Answer Part 2: " + str(countP2))