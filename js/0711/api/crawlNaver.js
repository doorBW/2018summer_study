const fetch=require('isomorphic-fetch');
const cheerio=require('cheerio');
const mongoose=require('mongoose');

mongoose.promise=require("bluebird");

const Webtoon=require('../model/webtoons.js');


// then - javascript promise
const crawlNaver=()=>{
    return new Promise((resolve,reject)=>{
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
                });
                return naverTitles;
            }).then(data=>{
                //initialize
                console.log("Initializing");
                Webtoon.find((err,toons)=>{
                    if(err)console.error(err);
                    toons.map(toon=>{
                        toon.remove({_id:toon._id},(err,datas)=>{
                            if(err)console.error(err);
                        })
                    })
                })
                .then(()=>{
                    console.log("Initialized");
                    console.log("SAVING . . .");
                    let filtered=[{}];
                    data.map((i,e)=>{
                        e.map((j,f)=>{
                            const idx=filtered.findIndex(e=>{return e.title===f.title});
                            if(idx>=0){
                                filtered[idx].day=[...filtered[idx].day,i];
                            }else{
                                filtered.push({
                                    day:[i],
                                    title: f.title,
                                    imgsrc: f.imgsrc,
                                })
                            }
                        })
                    })
                    let len=filtered.length;
                    let idx=0;

                    filtered.map((e,i)=>{
                        let newtoon = new Webtoon();
                        newtoon.day = e.day;
                        newtoon.title=e.title;
                        newtoon.imgsrc=e.imgsrc;
                        newtoon.save((err)=>{
                            if(err)console.error(err);
                            idx++;
                            if(len===idx){
                                console.log(". . . SAVED");
                                resolve();
                            }
                        })
                    })
                })
            })
        });
    })
}
mongoose.connect("mongodb://admin:1234qwer@ds133041.mlab.com:33041/seongbin",{useNewUrlParser:true});

module.exports=crawlNaver;