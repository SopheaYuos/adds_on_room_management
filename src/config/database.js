const mysql = require('mysql2');

const { bookingSchema } = require('../model/bookingSchema');
const { roomSchema } = require('../model/roomSchema');
const { subRoomSchema } = require('../model/subRoomSchema');
const { userSchema } = require('../model/userSchema');
const { equipmentSchema } = require('../model/equimentSchema');
const { roomHasEquipmentSchema } = require('../model/roomHasEquipment');
const { notificationSchema } = require('../model/noticationSchema');


const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
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
        if (err) return console.log('bookingSchema database exists or error');
        console.log("bookingSchema created");

    })
    con.query(equipmentSchema, function (err) {
        if (err) return console.log('equimentSchema database exists or error');
        console.log("equimentSchema created ");

    })
    con.query(notificationSchema, function (err) {
        if (err) return console.log('notifications database exists or error');
        console.log("notifications created ");

    })
    con.query(roomHasEquipmentSchema, function (err) {
        if (err) return console.log('roomHasEquipmentSchema database exists or error\n_________________________________');
        console.log("roomHasEquipmentSchema created\n_________________________________");

    })
});

module.exports = con;