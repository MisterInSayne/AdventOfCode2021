using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class DoStuff : MonoBehaviour
{
    private GameObject playField;
    private GameObject NumberOutPut;
    void Start() {
        playField = GameObject.Find("Playfield"); //.GetComponent<FieldManager>()
        NumberOutPut = GameObject.Find("Numbers");

        NumberOutPut.GetComponent<Text>().text = "";

        gameObject.GetComponent<Button>().onClick.AddListener(TaskOnClick);
    }


    void Update() {
        
    }
    
    private void TaskOnClick() {
        string number = playField.GetComponent<FieldManager>().DrawNumber();
        if(number != "") {
            NumberOutPut.GetComponent<Text>().text += number + " ";
        }
        
    }
}
