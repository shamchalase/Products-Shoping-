const jwt = require("jsonwebtoken");
const model = require("../model/user");
const User = model.User;
const fs = require("fs");
const bcrypt = require("bcrypt");
const path = require("path");
const privateKey = fs.readFileSync(
  path.resolve(__dirname, "../private.key"),
  "utf-8"
);

//signin
exports.signUp = (req, res) => {
  const user = new User(req.body);
  var token = jwt.sign({ email: req.body.email }, privateKey, {
    algorithm: "RS256",
  });
  //use bcrypt
  const hash = bcrypt.hashSync(req.body.password, 10);

  user.token = token;
  user.password = hash;

  user.save((err, doc) => {
    console.log({ err, doc });
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(201).json(token);
    }
  });
};

//login
exports.login = async (req, res) => {
  try {
    const doc = await User.findOne({ email: req.body.email });
    const isAuth = bcrypt.compareSync(req.body.password, doc.password);
    if (isAuth) {
      var token = jwt.sign({ email: req.body.email }, privateKey, {
        algorithm: "RS256",
      });
      doc.token = token;
      doc.save(() => {
        res.json({ token });
      });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.status(401).json(error);
  }
};
