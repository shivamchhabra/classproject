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

//app.set("pages", path.join(__dirname, "pages"));
app.set("view engine", "pug");

let Users = require("./authentication/users");

//login
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

app.post("/", (req, res) => {
  Users.findOne(
    { email: req.body.email, password: req.body.password },
    (err, users) => {
      if (users) {
        console.log(users);
        res.redirect("/AdressBook/users/" + users.id);
      } else {
        console.log("Wrong Credentials");
        res.redirect("/");
      }
    }
  );
});

//register
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

app.post("/register", (req, res) => {
  let user = new Users();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;

  user.save(err => {
    if (err) {
      console.log(err);
    } else {
      console.log(req.body.name);
      res.redirect("/AdressBook");
    }
  });
});

//singleAdress showcase
app.get("/AdressBook/users/:id", (req, res) => {
  Users.findById(req.params.id, (err, users) => {
    console.log("work");
    res.render(__dirname + "/pages/singleadress.pug", {
      users: users
    });
  });
});

//update user
app.get("/AdressBook/users/update/:id", (req, res) => {
  Users.findById(req.params.id, (err, users) => {
    res.render(__dirname + "/pages/update.pug", {
      users: users
    });
  });
});

app.post("/AdressBook/users/update/:id", (req, res) => {
  let user = {};
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;

  let query = { _id: req.params.id };

  Users.update(query, user, err => {
    if (err) {
      console.log(err);
    } else {
      console.log(req.body.name);
      res.redirect("/AdressBook");
    }
  });
});

//final AdressBook
app.get("/AdressBook", (req, res) => {
  Users.find({}, (err, users) => {
    if (err) {
      console.log(err);
    } else {
      //console.log(users);
      res.render(__dirname + "/pages/AdressBook.pug", { users: users });
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000...");
});
