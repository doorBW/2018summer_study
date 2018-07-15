const express=require("express");
const app=express();
const port=3000;
const bodyParser=require('body-parser');

const crawlNaver=require('./api/crawlNaver.js');
const crawlDaum=require('./api/crawlDaum.js');
const mongoose=require('mongoose');
const Webtoon=require('./model/webtoons.js');
const daumWebtoon=require('./model/daum_webtoons.js');

const secret="12345";
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.end("hello");
});

app.get('/test_json',(req,res)=>{
    res.json({
        path: '/test_json',
        asdf: 'qwer',
    });
});

app.post('/crawl_naver',(req,res)=>{
    if(req.body.secret === secret){
        crawlNaver().then(()=>{
            res.json({
                path: '/crawl_naver',
                crawl: 'doing'
            })
        });
        
    }else{
        res.json({
            path: '/crawl_naver'
        })
    }
}).get('/crawl_naver',(req,res)=>{
    res.json({
        path: '/crawl_naver GET'
    })
})

app.get('/list_naver',(req,res)=>{
    Webtoon.find((err,data)=>{
        if(err)console.error(err);
        else{
            res.json(data);
        }
    })
})

app.post('/crawl_daum',(req,res)=>{
    if(req.body.secret === secret){
        crawlDaum().then(()=>{
            res.json({
                path: '/crawl_daum',
                crawl: 'doing'
            })
        });
        
    }else{
        res.json({
            path: '/crawl_daum'
        })
    }
}).get('/crawl_daum',(req,res)=>{
    crawlDaum().then(()=>{
        res.json({
            path: '/crawl_daum GET'
        })
    })
})

app.get('/list_daum',(req,res)=>{
    daumWebtoon.find((err,data)=>{
        if(err)console.error(err);
        else{
            res.json(data);
        }
    })
})

app.listen(port,()=>{
    console.log(`server is listening on port ${port}.`)

});

//frontend : ejs

mongoose.connect("mongodb://admin:1234qwer@ds133041.mlab.com:33041/seongbin",{useNewUrlParser:true});