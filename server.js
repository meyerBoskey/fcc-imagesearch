const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 3000;
var GoogleSearch = require('google-search');
var keys = require('./config/keys');
var googleSearch = new GoogleSearch({
  key: keys.key,
  cx: keys.cx
});
// const searchEngineId = "010844983517532271491:xnuwvuapoz4";
// const key = "AIzaSyBPYWOYEeKgIN7E2Q76MG-l6XcQhA2y1aM";
const SearchTerm = require('./models/searchTerm');

app.use(bodyParser.json());
app.use(cors());

// Connect to mLab
mongoose.connect('mongodb://testUser:testPassword@ds157584.mlab.com:57584/cpsulli', {useMongoClient:true});

// app.get('/', (req, res, next) => {
//     res.render('hello');
// })

app.get('/api/imagesearch/:searchVal*', (req, res, next) => {
    let {searchVal} = req.params;
    let {offset} = req.query;

    if(!offset) offset = 1;
    else offset = offset * 10 - 9;

    let data = new SearchTerm({
        searchVal,
        searchDate: new Date()
    });

    data.save(err => {
        if(err) res.send("Error saving to database");
    });

    googleSearch.build({
        q: searchVal,
        num: 10,
        start: offset,
        searchType: "image"
    }, function(error, response){
        let googleData = [];
        for(let i = 0; i < 10; i++){
            googleData.push({
                title: response.items[i].title,
                imageUrl: response.items[i].image.thumbnailLink,
                siteUrl: response.items[i].image.contextLink
            })
        }
        // console.log(googleData);
        res.json(googleData);
    });
});

app.get('/api/recentsearches', (req, res, next) => {
    SearchTerm.find({}, (err, data) => {
        res.json(data);
    });
});

const server = app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
