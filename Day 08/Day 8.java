import java.io.*;
import java.util.Scanner;
import java.util.Arrays;

public class Main {
	
	public static int matchCodes(String s1, String s2){
		int m = 0; for (int i = 0; i < s1.length(); i++)if(s2.indexOf(s1.charAt(i)) > -1)m++; return m;
	}
	
	public static int testNr(String[] codes, String test){
		switch(test.length()){
			case(2): return 1;
			case(3): return 7;
			case(4): return 4;
			case(5): if(matchCodes(codes[0], test) == 2) return 3; else if(matchCodes(codes[2], test) == 3)return 5; else return 2;
			case(6): if(matchCodes(codes[0], test) == 2){ if(matchCodes(codes[2], test) == 4)return 9; else return 0; }else return 6;
			default: return 8;
		}
	}
	
    public static void main(String[] args) {
        File file=new File("Input.txt");
		//File file=new File("Example.txt");
		
		int[] Occurences = new int[10];
		int part2 = 0;
		try {
            Scanner inputData = new Scanner(file);
            while (inputData.hasNextLine()) {
				String[] data = inputData.nextLine().split(" \\| ");
				
				String[] Codes = data[0].split(" ", 0);
				Arrays.sort(Codes, (a, b)->Integer.compare(a.length(), b.length()));
				
				String[] inputCodes = data[1].split(" ", 0);
				int l = inputCodes.length;
				for(int i = 0; i < l; i++){
					int n = testNr(Codes, inputCodes[i]);
					Occurences[n]++;
					part2 += n*Math.pow(10, (l-1)-i);
				}
            }
            inputData.close();
        }catch (FileNotFoundException e) { e.printStackTrace(); }
		
		System.out.println("Answer Part 1: "+(Occurences[1]+Occurences[4]+Occurences[7]+Occurences[8]));
		System.out.println("Answer Part 2: "+part2);
    }
}