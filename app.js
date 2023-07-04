require('dotenv').config();
require('./src/config/database');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
// app.use(express.urlencoded({ extended: true }))
app.use(cors());

const cloudinaryConfig = cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPIKEY,
    api_secret: process.env.CLOUDINARYSECRET,
    secure: true
})
app.get("/get-signature", (req, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp: timestamp
        },
        cloudinaryConfig.api_secret
    )
    res.json({ timestamp, signature })
})
// 
// https://github.com/LearnWebCode/cloudinary-finished-reference/blob/main/public/client-side.js
app.post("/upload/image", async (req, res) => {
    // based on the public_id and the version that the (potentially malicious) user is submitting...
    // we can combine those values along with our SECRET key to see what we would expect the signature to be if it was innocent / valid / actually coming from Cloudinary
    const expectedSignature = cloudinary.utils.api_sign_request({ public_id: req.body.public_id, version: req.body.version }, cloudinaryConfig.api_secret)

    // We can trust the visitor's data if their signature is what we'd expect it to be...
    // Because without the SECRET key there's no way for someone to know what the signature should be...
    if (expectedSignature === req.body.signature) {
        // Do whatever you need to do with the public_id for the photo
        // Store it in a database or pass it to another service etc...
        await fse.ensureFile("./data.txt")
        const existingData = await fse.readFile("./data.txt", "utf8")
        await fse.outputFile("./data.txt", existingData + req.body.public_id + "\n")
    }
})

app.get("/view/photos", async (req, res) => {
    await fse.ensureFile("./data.txt")
    const existingData = await fse.readFile("./data.txt", "utf8")
    res.send(`<h1>Hello, here are a few photos...</h1>
  <ul>
  ${existingData
            .split("\n")
            .filter(item => item)
            .map(id => {
                return `<li><img src="https://res.cloudinary.com/${cloudinaryConfig.cloud_name}/image/upload/w_200,h_100,c_fill,q_100/${id}.jpg">
      <form action="delete-photo" method="POST">
        <input type="hidden" name="id" value="${id}" />
        <button>Delete</button>
      </form>
      </li>
      `
            })
            .join("")}
  </ul>
  <p><a href="/">Back to homepage</a></p>
  `)
});


const http = require('http');
const httpServer = http.createServer(app)

const io = new socketio.Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    }
})

httpServer.listen(PORT)

// app.get('/', (req, res) => {
//     res.status(200).send('Hello from io');

// })

//call to routes
require('./src/api/routes/bookingRoutes')(app, io);
require('./src/api/routes/roomRoutes')(app);
require('./src/api/routes/userRoutes')(app);
require('./src/api/routes/sendMailRoutes')(app);
require('./src/auth/loginService')(app);
require('./src/api/routes/otpRoutes')(app)
require('./src/api/routes/roomEquipmentRoutes')(app);
require('./src/api/routes/notificationsRoutes')(app);


// console.log('All routes: ')
app._router.stack          // registered routes
    .filter(r => r.route)    // take out all the middleware
    .map(r => console.log(r.route.path))  // get all the paths

console.log('_________________')




// app.listen(PORT, (error) => {
//     if (!error) {
//         console.log("Group16: Server running:) on http://localhost:" + PORT)
//     }
//     else console.log("Error occurred, server can't start", error);
// })