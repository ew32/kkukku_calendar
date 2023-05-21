const passport = require('passport')
const LocalStrategy = require('passport-local')
// const authDAO = require('../models/authDAO')
// const bkfd = require('pbkdf2-password')();
const bkfd2Password = require('pbkdf2-password')
const hasher = bkfd2Password();

function encryption(parameters){
    return new Promise((resolve, reject) => {
        hasher({
            password : parameters.password
        }, (err, pass, salt, hash) =>{
            if(err) reject(err)
            const result = {
                salt, hash
            }
            resolve(result) // salt, 암호화된 hash 값을 보내준다.
        })
    })
}

function decryption(password, savedSalt, savedHash){
    return new Promise((resolve, reject) => {
        hasher({
            password : password,
            salt : savedSalt
        }, (err, pass, salt, hash) =>{
            if(savedHash === hash){
                resolve('로그인 성공')
            } else{
                reject('비밀번호 오류')
            }
        })
    })
}

const {User} = require('../model/model');

module.exports = () => {

    passport.serializeUser(function (user, done) {
        done(null, user)
    });
    passport.deserializeUser(function (id, done) {
        done(null, id)
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password'
    }, async (user_id, user_pw, done) => {
        try {
            // salt값, salt된 password값을 가져옵니다.
            const user = await User.findByPk(user_id);

            // const encpwd = await encryption(user_pw, "test1234!@#$", user.password);

            // 입력한 user_pw값과 salt된 user_pw값을 확인후 반환해주는 부분입니다.
            const result = await decryption(user_pw, "test1234!@#$", user.password);
            return done(null, user)
        } catch (error) {
            return done(null, false, { message: error })
        }
    }));
}