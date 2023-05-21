//express init
const express = require("express");
const bodyParser = require ("body-parser");

const cookieParser = require('cookie-parser');
const session = require('express-session');

const passport = require('passport');

const passportConfig = require('./passport/local-login')

const route = require('./route/route');

const app = express();
const port = 3000;

passportConfig();

//user body-parser
// var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser()); //Cookie 값을 읽기 위한 setting
app.use( //session을 저장하기 위한 setting

    session({
        secret: "test1234!@#$",
        resave: false, //request 마다 session값이 변경이 없으면 resave 하지 않음.
        saveUninitialized: true, //초기화 되지 않은 session의 강제 저장 여부
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 30 }, //보안: false, maxAge: 30일
    }),
);
app.use(passport.initialize());
app.use(passport.session());

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


