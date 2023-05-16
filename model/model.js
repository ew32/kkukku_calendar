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


// const db = new Sequelize({
//     dialect: 'sqlite',
//     storage: './database.sqlite'
// });

//db sync force

db.sync({alter: true})
    .then(() => console.log('Database has been synced'))
    .catch((err) => console.error('Unable to sync the database:', err));

module.exports = Schedule;