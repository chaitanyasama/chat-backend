const express = require("express");
const cors = require("cors");
const io = require("socket.io");
const http = require("http");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodeMailer = require("nodemailer");


const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_PORT = parseInt(process.env.SERVER_PORT);
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = parseInt(process.env.MONGO_PORT);
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASSWORD;
const MONGO_DBNAME = process.env.MONGO_DBNAME;
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT);
const EMAIL_USER = process.env.EMAIL_USERNAME;
const EMAIL_PASS = process.env.EMAIL_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM;
const SECRET = process.env.JWT_SECRET;


const dbRoute = "mongodb://" + MONGO_USER + ":" + MONGO_PASS + "@" + MONGO_HOST + ":" + MONGO_PORT + "/" + MONGO_DBNAME;
mongoose.connect(dbRoute, {useNewUrlParser: true});

let db = mongoose.connection;
db.once("open", () => console.log("Connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const http_server = http.Server(app);
const io_server = io(http_server);
const mailer =
          nodeMailer.createTransport(
              {host: EMAIL_HOST, port: EMAIL_PORT, secure: true,
                  auth: {user: EMAIL_USER, pass: EMAIL_PASS}});

require("./src/routes/api")(app, SECRET);
require("./src/routes/messages")(io_server, SECRET);
require("./src/routes/email").initializeMailer(mailer, EMAIL_FROM);

http_server
    .listen(
        SERVER_PORT, SERVER_HOST,
        () =>
        {
            console.log("Listening on host: " + SERVER_HOST + " and port: " + SERVER_PORT)
        });
