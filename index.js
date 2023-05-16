//express init
const express = require("express");
const bodyParser = require ("body-parser");

const route = require('./route/route');

const app = express();
const port = 3000;

//user body-parser
// var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', route);

//server
app.listen(port, function(){
    console.log('Server On!');
});


// view 파일이 위치한 폴더를 지정합니다.
app.set('views', './views');
app.set('js', './js');
app.set('/', './');
// view 엔진으로 ejs를 사용합니다.
app.set('view engine', 'ejs');

// app.get('/download', function (req, res) {
//     res.download('./database.sqlite');
// });

//static
// app.use(express.static('public'));

//insert data to schedule
// Schedule.create({
//     title: 'test',
//     content: 'test',
//     date: '2022-01-01',
//     time: '12:00'
// });


