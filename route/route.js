const express = require('express');
const {Sequelize, where} = require("sequelize");
const {Schedule, Calendar, CalendarShare, db} = require('../model/model');

// const passport = require('../passport/local-login');
const passport = require('passport')

const router = express.Router();

router.get('/test', function (req, res) {
    res.send('test2');
});


// '/' 경로로 GET 요청이 오면 index.ejs 파일을 렌더링하여 클라이언트에게 전송합니다.
router.get('/', async function (req, res) {

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const user = req.user;

    if (!user)
    {
        res.render('login');
        return;
    }
/*
    //Schedule.findAll order by date and create date > now
    let schedules = await Schedule.findAll({

        //today yyyy-MM-dd
        // var today = new Date().toISOString().slice(0, 10);
        // console.log(today);

        order: [
            ['date', 'ASC']
        ],
        where: {
            date: {
                [Sequelize.Op.gte]: new Date().toISOString().slice(0, 10)
            },
        },
        include: [{
            model: Calendar,
            where: {
                userid: req.user.id
            }
        }]
    });

    const schedules2 = await Schedule.findAll({

        order: [
            ['date', 'ASC']
        ],
        where: {
            date: {
                [Sequelize.Op.gte]: new Date().toISOString().slice(0, 10)
            },
        },
        include: [{
            required: true,
            model: Calendar,
            include: [{
                required: true,
                model: CalendarShare,
                where: {
                    userid2: req.user.id
                }
                // include: [{
                //     required: true,
                //     model: Calendar,
                //     where: {
                //         userid: req.user.id
                //     }
                // }]
            }]
        }]
    });
    schedules = schedules.concat(schedules2);
    */

    // schedules = await Promise.all([
    //     schedules, schedules2
    // ]).then((schedules) => {
    //     return schedules[0].concat(schedules[1]);
    // });

    let schedules = await db.query('SELECT * FROM vw_all_schedules WHERE date >= :date AND userid = :userid OFFSET :offset LIMIT :limit', {
        replacements: {date: new Date().toISOString().slice(0, 10), userid: req.user.id, offset: (page-1) * limit, limit: (page) * limit},
        mapToModel: true,
        model: Schedule
        // type: Sequelize.QueryTypes.SELECT
    });

    // if(req.user.id == 'sejunkim') {
    res.render('index', {schedules: schedules, page: parseInt(page)});
    // } else {
    //     res.render('index', {schedules: schedules2, calendarid: "1"});
    // }

    // .then((schedules) => {
    //     console.log(schedules);
    //     res.render('index', {schedules: schedules, calendarid: "1"});
    // }).catch((err) => {
    //     console.log(err);
    // });

});


router.get('/edit', async function (req, res) {

    // console.log(req.query.calendarid);

    //Schedule.findAll order by date
    // Schedule.findAll({
    //     order: [
    //         ['date', 'ASC']
    //     ]
    // }).then((schedules) => {
    //     console.log(schedules);
    //     res.render('edit', {schedules: schedules});
    // });

    calendars = await Calendar.findAll({
        attributes: ['id', 'name'],
        where: {
            userid: req.user.id
        }
    });

    calendars2 = await Calendar.findAll({
        attributes: ['id', 'name'],
        include: [{
            required: true,
            model: CalendarShare,
            where: {
                userid2: req.user.id
            }
        }]
    });

    calendars = calendars.concat(calendars2);

    res.render('edit', {schedule: [], calendars: calendars});
});

//router.get /edit parameter
router.get('/edit/:id', function (req, res) {
    Schedule.findByPk(req.params.id).then(async (schedule) => {
        console.log(schedule);

        var caendars = await schedule.getCalendar();

        res.render('edit', {schedule: schedule, calendars: [caendars]});
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
            time: req.body.time,
            calendarid: req.body.calendarid
        });
    } else {
        Schedule.update({
            // id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            date: req.body.date,
            time: req.body.time
        }, {
            where: {
                id: req.body.id
            }
        });
    }

    res.redirect('/');
});

router.post('/login', function (req, res) {
    if (!req.body.keepLogIn) { //자동 로그인이 아니라면 session과 cookie 생성
        passport.authenticate('local-login', (err, user, message) => {
            if (!user) res.send(message);
            return req.login(user, loginError => {
                if (loginError) (loginError);
                else {
                    let date = new Date();
                    date = date.toISOString().slice(0, 10);
                    res.cookie('omg_last_login', date, {
                        expires: new Date(Date.now() + 24 * 60 * 60 * 30),
                        httpOnly: true,
                    });

                    req.session.save(() => {
                        // res.send("SUCCESS");
                        res.redirect('/');
                    });
                    // res.send(baseResponse.SUCCESS);
                }
            });
        })(req, res);
    } else { //자동 로그인 시 session값만 생성
        passport.authenticate('local-login', (err, user, message) => {
            if (!user) res.send(message);
            return req.login(user, loginError => {
                if (loginError) (loginError);
                else res.send(baseResponse.SUCCESS);
            });
        })(req, res);
    }
});

router.get('/login', function (req, res) {
        if (req.cookies.omg_last_login) {
            let date = new Date();
            date = date.toISOString().slice(0, 10);	 //ex)2022-02-10
            if (date == req.cookies.omg_last_login) { //omg_last_login 이 오늘인 경우
                if (req.user) res.redirect('/');        //session 값이 존재하는 경우
                else res.render('login');   //session 값이 존재하지 않는 경우
            } else { //omg_last_login cookie가 오늘 날짜가 아닌 경우 (로그인 시간 만료)
                if (req.user) { //로그인 시간이 만료되었으나 session 값이 남아 있는 경우
                    req.logout();   //session 값 파기 후 login 페이지로 이동
                    req.session.destroy(() => {
                        req.session;
                    });
                }
                res.render('login'); //로그인 시간도 만료되었고 session 값도 없으므로 login 페이지 이동
            }
        } else if (req.user) res.redirect('/'); //omg_last_login cookie가 없고 session값만 있는 경우 (=자동 로그인으로 로그인)
        else res.render('login'); //그 외의 경우는 로그인 시도가 없던 것이므로 로그인 페이지로 이동
    },
);


module.exports = router;
