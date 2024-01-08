const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const credentials = require("./middlewares/credentials");
const corsOptions = require("./config/corsOptions");
const routes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(credentials);
app.use(cors(corsOptions));

const sessionConfig = {
  secret: "egeGBTCTEcgwrtgc54cg66666666h.b/3/3.b/[g[er2",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: Date.now() + 1000 + 60 * 60 * 24 * 7,
    maxAge: 1000 + 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

app.use(routes);

app.use(errorMiddleware);

module.exports = app;
