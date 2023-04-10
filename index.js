//express init
import express from "express";
import {Sequelize} from "sequelize";
import bodyParser from "body-parser";

var app = express();
var port = 3000;

//user body-parser
// var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// '/' 경로로 GET 요청이 오면 index.ejs 파일을 렌더링하여 클라이언트에게 전송합니다.
app.get('/', function(req, res) {

    //Schedule.findAll order by date
    Schedule.findAll({
        order: [
            ['date', 'ASC']
        ]
    }).then((schedules) => {
        console.log(schedules);
        res.render('index', {schedules: schedules});

    });
});

app.get('/edit', function(req, res) {

    //Schedule.findAll order by date
    // Schedule.findAll({
    //     order: [
    //         ['date', 'ASC']
    //     ]
    // }).then((schedules) => {
    //     console.log(schedules);
    //     res.render('edit', {schedules: schedules});
    // });

    res.render('edit', {schedule: [] });
});

//app.get /edit parameter
app.get('/edit/:id', function (req, res) {
    Schedule.findByPk(req.params.id).then((schedule) => {
        console.log(schedule);
        res.render('edit', {schedule: schedule});
    });
});

//app.post /delete parameter
app.post('/delete/:id', function (req, res) {
    Schedule.findByPk(req.params.id).then((schedule) => {
        schedule.destroy();
        // res.location('/');
        res.redirect('/');
    });
});

app.post('/save', function (req, res) {
    console.log(req.body);

    //chk req.body.id
    if(req.body.id == ''){
        //insert
        Schedule.create({
            title: req.body.title,
            content: req.body.content,
            date: req.body.date,
            time: req.body.time
        });
    } else {
        Schedule.upsert({
            id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            date: req.body.date,
            time: req.body.time
        });
    }

    res.redirect('/');
});

app.get('/download', function (req, res) {
    res.download('./database.sqlite');
});

//static
// app.use(express.static('public'));

//init sqlite db and sequelize
const db = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

//define model schedule
const Schedule = db.define('schedule', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false
    },
    time: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

//init model
db.sync()
    .then(() => console.log('Database has been synced'))
    .catch((err) => console.error('Unable to sync the database:', err));


//insert data to schedule
// Schedule.create({
//     title: 'test',
//     content: 'test',
//     date: '2022-01-01',
//     time: '12:00'
// });


