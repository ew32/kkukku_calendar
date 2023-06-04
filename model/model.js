const {Sequelize} = require("sequelize");

//init postgres db and sequelize
const db = new Sequelize({
    dialect: 'postgres',
    host: 'svc.sel3.cloudtype.app',
    port: 30075,
    username: 'root',
    password: 'rlatpwns1!',
    database: 'postgres'
});

const User = db.define('user', {
    id: {
        type: Sequelize.STRING,
        // autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'user'
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

const Calendar = db.define('calendar', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userid: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'calendar'
    }
});

const CalendarShare = db.define('calendarshare', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    calendarid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Calendar,
            key: 'id'
        }
    },
    userid1: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    userid2: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
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
    },
    calendarid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Calendar,
            key: 'id'
        }
    }
});

// Calendar.hasMany(Schedule, {foreignKey: 'calendarid', sourceKey: 'id'});
Schedule.belongsTo(Calendar, {foreignKey: 'calendarid', targetKey: 'id'});
// User.hasMany(Calendar, {foreignKey: 'userid', sourceKey: 'id'});
Calendar.belongsTo(User, {foreignKey: 'userid', targetKey: 'id'});
// CalendarShare.hasMany(Calendar, {foreignKey: 'calendarid', sourceKey: 'id'});
// Calendar.belongsTo(CalendarShare, {foreignKey: 'calendarid', targetKey: 'id'});
// CalendarShare.hasMany(User, {foreignKey: 'userid1', sourceKey: 'id'});
// CalendarShare.hasMany(User, {foreignKey: 'userid2', sourceKey: 'id'});
// User.hasMany(CalendarShare, {foreignKey: 'userid1', sourceKey: 'id'});
CalendarShare.belongsTo(User, {foreignKey: 'userid1', targetKey: 'id'});
// User.hasMany(CalendarShare, {foreignKey: 'userid2', sourceKey: 'id'});
CalendarShare.belongsTo(User, {foreignKey: 'userid2', targetKey: 'id'});
Calendar.hasMany(CalendarShare, {foreignKey: 'calendarid', sourceKey: 'id'});
CalendarShare.belongsTo(Calendar, {foreignKey: 'calendarid', targetKey: 'id'});


// const db = new Sequelize({
//     dialect: 'sqlite',
//     storage: './database.sqlite'
// });

//db sync force

db.sync(/*{alter: true}*/)
    .then(() => console.log('Database has been synced'))
    .catch((err) => console.error('Unable to sync the database:', err));

module.exports = {
    Schedule,
    User,
    Calendar,
    CalendarShare,
    db
};