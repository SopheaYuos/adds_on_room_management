const express = require('express');
const cors = require('cors');
const con = require('./src/config/database');
const app = express();
const PORT = 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).send('Hello from server');
})

//call to routes
require('./src/api/routes/bookingRoutes')(app);
require('./src/api/routes/roomRoutes')(app);
require('./src/api/routes/userRoutes')(app);
require('./src/api/routes/sendMailRoutes')(app);
require('./src/auth/loginService')(app);

console.log('All routes: ')
app._router.stack          // registered routes
    .filter(r => r.route)    // take out all the middleware
    .map(r => console.log(r.route.path))  // get all the paths

console.log('_________________')

app.listen(PORT, (error) => {
    if (!error) {
        console.log("Group16: Server running:) on http://localhost:" + PORT)
    }
    else console.log("Error occurred, server can't start", error);
})