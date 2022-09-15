const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const configs = require('./config/config');
const loginRoute = require("./routes/login_route");
const toolRoute = require("./routes/tools_routes");
const actorRoutes = require("./routes/actors/main_routes");
const objectRoutes = require("./routes/object/main_routes");
const cronFunction = require("./utils/cron_functions");

require('dotenv').config()

mongoose
    .connect(
        process.env.MONGODB_URI || configs.MONGO_URI + "/" + "yourock",
        {useNewUrlParser: true}
    )
    .then(() => {
        console.log("MongoDB database connection established successfully");
    })
    .catch(err => {
        console.log(err.message);
    });

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) =>{
    res.send('test')
})
app.use("/login", loginRoute);
app.use("/tools", toolRoute);
app.use("/actors", actorRoutes);
app.use("/object", objectRoutes);

app.use(express.static('public'));

//Cron method
cronFunction.startCron();

const server = app.listen(process.env.PORT || configs.BACKEND_PORT, function () {
    console.log("Student management system backend server is running on port : " + (process.env.PORT || configs.BACKEND_PORT));
});