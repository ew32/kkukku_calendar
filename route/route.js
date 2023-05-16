const express = require('express');
const {Sequelize} = require("sequelize");
const Schedule = require('../model/model');

const router = express.Router();

router.get('/test', function (req, res) {
    res.send('test2');
});


// '/' 경로로 GET 요청이 오면 index.ejs 파일을 렌더링하여 클라이언트에게 전송합니다.
router.get('/', function(req, res) {

    //Schedule.findAll order by date and create date > now
    Schedule.findAll({

        //today yyyy-MM-dd
        // var today = new Date().toISOString().slice(0, 10);
        // console.log(today);

        order: [
            ['date', 'ASC']
        ],
        where: {
            date: {
                [Sequelize.Op.gte]: new Date().toISOString().slice(0, 10)

            }
        }
    }).then((schedules) => {
        console.log(schedules);
        res.render('index', {schedules: schedules});
    });

    // Schedule.findAll({
    //     order: [
    //         ['date', 'ASC']
    //     ]
    // }).then((schedules) => {
    //     console.log(schedules);
    //     res.render('index', {schedules: schedules});
    //
    // });

});

router.get('/edit', function(req, res) {

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

//router.get /edit parameter
router.get('/edit/:id', function (req, res) {
    Schedule.findByPk(req.params.id).then((schedule) => {
        console.log(schedule);
        res.render('edit', {schedule: schedule});
    });
});

//router.post /delete parameter
router.post('/delete/:id', function (req, res) {
    Schedule.findByPk(req.params.id).then((schedule) => {
        schedule.destroy();
        // res.location('/');
        res.redirect('/');
    });
});

router.post('/save', function (req, res) {
    console.log(req.body);

    //chk req.body.id
    if(req.body.id === ''){
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

module.exports = router;
