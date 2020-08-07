# Sunrin2020-Hackathon


``` graphql
type Word{
    word: String
    audio: String
}

```


### `translation의 인자는 배열입니다`
### `translation의 반환형은 Word입니다`

>## 쿼리 사용 예제
``` js
`query{
  translation(code:["5","134","45","135","space","6","134","46","234","2356"]){
    word
    audio
  }
}`
```

