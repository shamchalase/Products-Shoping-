const jwt = require("jsonwebtoken");
const model = require("../model/user");
const User = model.User;

exports.createUser = (req, res) => {
  const user = new User(req.body);
  var token = jwt.sign({ email: req.body.email }, process.env.SECRET);
  user.token = token;

  user.save((err, doc) => {
    console.log({ err, doc });
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(201).json(doc);
    }
  });
};
