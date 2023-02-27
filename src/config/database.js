const mysql = require('mysql2');

const { bookingSchema } = require('../model/bookingSchema');
const { roomSchema } = require('../model/roomSchema');
const { subRoomSchema } = require('../model/subRoomSchema');
const { userSchema } = require('../model/userSchema');


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
})

con.connect(function (err) {
    if (err) throw err;
    console.log("*****IN Database.js file***** MySQL Connected!");
    con.query("CREATE DATABASE room_management;", function (err) {
        if (err) return console.log('database exists');
        console.log("Database created");
    });
    con.query('USE room_management;');
    con.query(userSchema, function (err) {
        if (err) return console.log('users database exists or error');
        console.log("users table created");
    });
    con.query(roomSchema, function (err) {
        if (err) return console.log('rooms database exists or error');
        console.log("rooms table created");
    })
    con.query(subRoomSchema, function (err) {
        if (err) return console.log('sub_room database exists or error');
        console.log("sub_room created");
    })
    con.query(bookingSchema, function (err) {
        if (err) return console.log('bookingSchema database exists or error \n_________________________________');
        console.log("bookingSchema created \n_________________________________");

    })
});

module.exports = con;