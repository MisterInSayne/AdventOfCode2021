using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEngine.UI;

public class FieldManager : MonoBehaviour {

    //public GameObject CardPrefab;

    private int CardAmmount = 1;

    private GameObject[] Cards;

    private Vector3 screenPoint;
    private Vector3 offset;

    public int[] Numbers;

    private int spawnedCards = 0;

    private int numbersDrawn = 0;


    private GameObject PartOne;
    private GameObject PartTwo;

    private bool haswon = false;
    private int wonCards = 0;

    void Start() {

        PartOne = GameObject.Find("WinText1");
        PartTwo = GameObject.Find("WinText2");

        //TextAsset txt = (TextAsset)Resources.Load("example", typeof(TextAsset));
        //TextAsset txt = (TextAsset)Resources.Load("input", typeof(TextAsset));
        //string content = txt.text;
        StreamReader sr = new StreamReader(Application.dataPath + "/../input.txt");
        string content = sr.ReadToEnd();
        sr.Close();
        //Debug.Log(content);
        string[] splitArray = content.Split(char.Parse("\n"));
        //Debug.Log(splitArray[0]);

        string[] numberArray = splitArray[0].Split(char.Parse(","));
        int l = numberArray.Length;
        Numbers = new int[l];
        for(int i = 0; i < l; i++) {
            Numbers[i] = int.Parse(numberArray[i]);
        }
        //Debug.Log(Numbers[0]);
        CardAmmount = splitArray.Length / 6;
        //Debug.Log(CardAmmount);
        // 10x10
        Cards = new GameObject[CardAmmount];

        int[,] CardNumbers = new int[5,5];

        l = splitArray.Length;
        for (int i = 2; i < l; i++) {
            int ind = (i - 1) % 6;
            if (ind == 0) continue;
            
            //Debug.Log(i + ", " + ind + ": " + splitArray[i]);
            string[] rowArray = splitArray[i].Split(new char[] { ' ' }, options: System.StringSplitOptions.RemoveEmptyEntries);
            int nl = rowArray.Length;
            for (int n = 0; n < 5; n++) {
                //Debug.Log(rowArray[n]);
                CardNumbers[ind-1,n] = int.Parse(rowArray[n]);
            }
            if (ind == 5) {
                //Debug.Log("Spawning Card");
                spawnCard(CardNumbers);
            }
            //CardNumbers
        }


        //Cards[spawnedCards] = (GameObject)Instantiate(CardPrefab, transform);

        //DrawNumber();
    }


    void Update() {
        if(Input.mouseScrollDelta.y != 0) {
            Vector3 curScreenPoint = Camera.main.ScreenToWorldPoint(new Vector3(Input.mousePosition.x, Input.mousePosition.y, screenPoint.z));
            //Vector3 befPnt = transform.InverseTransformPoint(new Vector3(0, 0));
            Vector3 befPnt = transform.InverseTransformPoint(curScreenPoint);
            //transform.position = new Vector3(0, 0);
            transform.position = -curScreenPoint;
            if(transform.localScale.x + (.1f * Input.mouseScrollDelta.y) > .1f) {
                transform.localScale += new Vector3(.1f, .1f) * Input.mouseScrollDelta.y;
            }
            transform.position = -transform.TransformPoint(befPnt);
        }
        
    }

    void OnMouseDown() {
        screenPoint = Camera.main.WorldToScreenPoint(gameObject.transform.position);

        offset = gameObject.transform.position - Camera.main.ScreenToWorldPoint(new Vector3(Input.mousePosition.x, Input.mousePosition.y, screenPoint.z));

    }

    private void OnMouseDrag() {
        Vector3 curScreenPoint = new Vector3(Input.mousePosition.x, Input.mousePosition.y, screenPoint.z);

        Vector3 curPosition = Camera.main.ScreenToWorldPoint(curScreenPoint) + offset;
        transform.position = curPosition;
    }

    private void spawnCard(int[,] numbers) {
        //Cards[spawnedCards] = (GameObject)Instantiate(CardPrefab, transform);
        Cards[spawnedCards] = new GameObject("Card_" + spawnedCards, typeof(Canvas), typeof(CardManager));
        Cards[spawnedCards].GetComponent<CardManager>().SetNumbers(numbers);
        Cards[spawnedCards].GetComponent<Canvas>().renderMode = RenderMode.WorldSpace;
        Cards[spawnedCards].GetComponent<Canvas>().sortingOrder = 5;
        Cards[spawnedCards].transform.SetParent(transform);
        float rootNr = Mathf.Ceil(Mathf.Sqrt((float) CardAmmount));
        
        float offsetX = 2.5f * (spawnedCards % rootNr);
        float offsetY = 2.5f * Mathf.Floor(spawnedCards / rootNr);
        float startX = -(rootNr * 1.25f) / 2f;
        float startY = (rootNr * 1.25f) / 2f;
        Cards[spawnedCards].transform.position += new Vector3(startX+offsetX, startY-offsetY);
        spawnedCards++;
    }
    
    public string DrawNumber() {
        if (numbersDrawn >= Numbers.Length) return "";
        int nr = Numbers[numbersDrawn];
        int won = -1;
        int lastwon = -1;
        for(int i = 0; i < CardAmmount; i++) {
            if (Cards[i].GetComponent<CardManager>().won) continue;
            if (Cards[i].GetComponent<CardManager>().DrawNumber(nr)) {
                won = i;
                wonCards++;
                if(wonCards == CardAmmount) {
                    lastwon = i;
                }
            }
        }
        numbersDrawn++;
        
        if (won != -1) {
            if (!haswon) {
                haswon = true;
                int answer = nr * Cards[won].GetComponent<CardManager>().sum;
                PartOne.GetComponent<Text>().text =  "[Card " + won + " Won!] Answer is: " + answer;
            }
        }
        if(lastwon != -1) {
            int answer = nr * Cards[lastwon].GetComponent<CardManager>().sum;
            PartTwo.GetComponent<Text>().text = "[Card " + lastwon + " is last] Answer is: " + answer;
        }
        return nr.ToString();
    }
}
