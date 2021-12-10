package main

import (  
	"fmt"
	"io/ioutil"
	"strings"
	"regexp"
	"sort"
)

func stripComplete(line string) string{
	m2 := regexp.MustCompile(`(\<\>|\(\)|\[\]|\{\})`)
	hasMatches := true;
	for hasMatches {
		newline := m2.ReplaceAllString(line, "")
		if(newline == line){hasMatches = false;}
		line = newline;
	}
	return line;
}

func processLine(line string) (int, int){
	points := 0;
	pointsP2 := 0;
	m1 := regexp.MustCompile(`(\<|\(|\[|\{)(\>|\)|\]|\})`)
	hasMatches := true;
	for hasMatches {
		newline := stripComplete(line);
		matches := m1.FindAllStringSubmatch(newline, -1)
		for _, s := range matches {
			if(s[2] == ")"){points += 3;}
			if(s[2] == "]"){points += 57;}
			if(s[2] == "}"){points += 1197;}
			if(s[2] == ">"){points += 25137;}
		}
		newline = m1.ReplaceAllString(newline, "")
		if(newline == line){hasMatches = false;}
		line = newline;
	}
	if(points == 0){
		l := len(line);
		for i := 0; i < l; i++ {
			pointsP2 *= 5;
			c := string(line[l-(i+1)]);
			if(c == "("){pointsP2 += 1;}
			if(c == "["){pointsP2 += 2;}
			if(c == "{"){pointsP2 += 3;}
			if(c == "<"){pointsP2 += 4;}
		}
	}
	return points, pointsP2;
}


func main() {
	pointsP1 := 0;
	var pointsAP2 []int;
	pointsCP2 := 0;
	
	textData, err := ioutil.ReadFile("Input.txt")
	//textData, err := ioutil.ReadFile("Example.txt")
	
	if err != nil {
		fmt.Println("File reading error", err)
		return
	}else{
		pieces := strings.Split(string(textData),"\n")
		for _, s := range pieces {
			p1, p2 := processLine(s);
			pointsP1 += p1;
			if(p2 > 0){
				pointsCP2++;
				pointsAP2 = append(pointsAP2,p2);
			}
		}
	}
	fmt.Println("Answer Part 1",pointsP1)
	sort.Ints(pointsAP2)
	fmt.Println("Answer Part 2",pointsAP2[(pointsCP2-1)/2])
}
