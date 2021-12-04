using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CardManager : MonoBehaviour {

    private GameObject[,] NumberObj;
    private SpriteRenderer spriteRenderer;

    private int[,] Numbers;


    public int sum = 0;

    public bool won = false;
    private void Awake() {
        spriteRenderer = gameObject.AddComponent<SpriteRenderer>();
        spriteRenderer.enabled = true;
        spriteRenderer.color = new Color(0.7169812f, 0.6153001f, 0.4633322f);
        spriteRenderer.sprite = Resources.Load<Sprite>("Sprites/border_square");

        spriteRenderer.drawMode = SpriteDrawMode.Simple;

        spriteRenderer.sortingOrder = 2;
    }

    void Start() {

    }

    
    void Update() {
        
    }

    public void SetNumbers(int[,] numbers) {
        NumberObj = new GameObject[5, 5];
        Numbers = new int[5, 5];
        System.Array.Copy(numbers, Numbers, numbers.GetLength(0) * Numbers.GetLength(1)); // !!!!!

        for (int x = 0; x < 5; x++) {
            for (int y = 0; y < 5; y++) {
                NumberObj[x, y] = new GameObject(name + "_slot_" + x + "_" + y, typeof(NumberSlot));
                NumberObj[x, y].transform.SetParent(transform);
                NumberObj[x, y].GetComponent<NumberSlot>().nr = Numbers[x, y];
                NumberObj[x, y].transform.position = transform.position + new Vector3(-.8f + (.4f * x), .8f - (.4f * y));
            }
        }
    }

    public bool DrawNumber(int nr) {
        if (won) return true;

        int[] rows = new int[5] { 0, 0, 0, 0, 0 };
        int[] columns = new int[5] { 0, 0, 0, 0, 0 };
        sum = 0;

        for (int x = 0; x < 5; x++) {
            for (int y = 0; y < 5; y++) {
                if (Numbers[x, y] == nr) {
                    Numbers[x, y] = -1;
                    NumberObj[x, y].GetComponent<NumberSlot>().Tag();
                }
                if(Numbers[x, y] == -1) {
                    rows[y]++;
                    columns[x]++;
                    if (rows[y] == 5 || columns[x] == 5) won = true;
                } else {
                    sum += Numbers[x, y];
                }
            }
        }
        if (won) {
            for (int i = 0; i < 5; i++) {
                if (rows[i] == 5) {
                    for (int x = 0; x < 5; x++) {
                        NumberObj[x, i].GetComponent<NumberSlot>().TagWon();
                    }
                }
                if (columns[i] == 5) {
                    for (int y = 0; y < 5; y++) {
                        NumberObj[i, y].GetComponent<NumberSlot>().TagWon();
                    }
                }
            }
        }
        return won;
    }
}
