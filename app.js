const express = require("express");

const path = require("path");

const app = express();

const fs = require("fs");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/users");
let db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to mongodb");
});

db.on("error", err => {
  console.log(err);
});

app.use(express.static(path.join(__dirname, "pages")));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

let Users = require("./authentication/users");

app.set("pages", path.join(__dirname, "pages"));
app.set("view engine", "html");

app.get("/", (req, res) => {
  fs.readFile("./pages/examlogin.html", null, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.write(data);
    }
    res.end();
  });
});

app.get("/register", (req, res) => {
  fs.readFile("./pages/register.html", null, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.write(data);
    }
    res.end();
  });
});

app.get("/AdressBook", (req, res) => {
  Users.find({}, (err, users) => {
    if (err) {
      console.log(err);
    } else {
      res.render("./pages/AdressBook", {
        users: users
      });
    }
  });
});

app.post("/", (req, res) => {
  res.redirect("/AdressBook");
});

app.post("/register", (req, res) => {
  let user = new Users();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  //user.pno = req.body.pno;

  user.save(err => {
    if (err) {
      console.log(err);
    } else {
      console.log(req.body.name);
      res.redirect("/AdressBook");
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000...");
});
