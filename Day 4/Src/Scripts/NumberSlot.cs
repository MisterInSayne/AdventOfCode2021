using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class NumberSlot : MonoBehaviour
{
    // Start is called before the first frame update
    private SpriteRenderer spriteRenderer;
    public Text textObj;
    public int nr = 0;

    private void Awake() {
        spriteRenderer = gameObject.AddComponent<SpriteRenderer>();
        spriteRenderer.enabled = true;
        spriteRenderer.color = new Color(0.7169812f, 0.6153001f, 0.4633322f);
        spriteRenderer.sprite = Resources.Load<Sprite>("Sprites/Square");
        
        spriteRenderer.drawMode = SpriteDrawMode.Simple;
        //spriteRenderer.size = new Vector2(100f, 100f);

        spriteRenderer.sortingOrder = 3;
    }

    void Start() {
        textObj = gameObject.AddComponent<Text>();
        textObj.text = nr.ToString();
        textObj.color = Color.black;
        textObj.font = Resources.GetBuiltinResource<Font>("Arial.ttf");
        textObj.fontSize = 42;
        textObj.alignment = TextAnchor.MiddleCenter;
        gameObject.GetComponent<RectTransform>().sizeDelta = new Vector2(80f, 80f);
        gameObject.transform.localScale = new Vector3(.005f, .005f);
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void Tag() {
        spriteRenderer.color = new Color(0.7924528f, 0.4074404f, 0.4074404f);
    }

    public void TagWon() {
        spriteRenderer.color = new Color(0.3948008f, 0.6792453f, 0.3876824f);
    }
}
