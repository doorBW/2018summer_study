const fetch=require('isomorphic-fetch');
const cheerio=require('cheerio');

// console.log("hi");
// setTimeout(()=>console.log('hi2'),1000);
// console.log("hi3");
// // hi -> hi3 -> hi2 순으로 출력된다.
// // setTimeout 그 뒤의 함수를 실행하고, 바로 다음 구문으로 넘어가게 된다.

// then - javascript promise
fetch('https://comic.naver.com/webtoon/weekday.nhn')
.then(res=>{
    res.text().then(html=>{
        const $=cheerio.load(html);
        const objects=$('div.col');
        
        const naverTitles = objects.map((i,e)=>{ // i,e 순서 유의
            const lists=$(e).children().children('ul').children();
            return lists.map((i,e)=>{
                const list=$(e).children('a').attr('title');
                const imgsrc=$(e).children('div').children('a').children('img').attr('src');

                const webtoon={
                    title: list,
                    imgsrc: imgsrc,
                }
                return webtoon;
            })
        })
        console.log(naverTitles);
    })
});