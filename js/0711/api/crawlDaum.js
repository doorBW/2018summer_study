const fetch=require('isomorphic-fetch');
const cheerio=require('cheerio');
const mongoose=require('mongoose');

mongoose.promise=require("bluebird");

const daumWebtoon=require('../model/daum_webtoons.js');


// then - javascript promise
const crawlDaum=()=>{
    return new Promise((resolve,reject)=>{
        fetch('http://webtoon.daum.net/#day=fri&tab=day')
        .then(res=>{
            res.text().then(html=>{
                const $=cheerio.load(html);
                const objects=$('ul.list_wt');
                const daumTitles = objects.map((i,e)=>{ // i,e 순서 유의
                    const lists=$(e);
                    //console.log(lists)
                    return lists.map((i,e)=>{
                        console.log($(e).children())
                        const list=$(e).children('li').children('span').children().val();
                        const imgsrc=$(e).children('li').children('a').children('img').attr('src');

                        const webtoon={
                            title: list,
                            imgsrc: imgsrc,
                        }
                        return webtoon;
                    })
                });
                return daumTitles;
            }).then(data=>{
                //initialize
                console.log("Initializing_daum");
                daumWebtoon.find((err,toons)=>{
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
                        let newtoon = new daumWebtoon();
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
mongoose.connect("mongodb://root:root123@ds137601.mlab.com:37601/daum",{useNewUrlParser:true});

module.exports=crawlDaum;