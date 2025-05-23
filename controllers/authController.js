const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
  try {
    let { email, password, fullname } = req.body;

    let user = await userModel.findOne({ email: email });
    if (user) {
      req.flash("error", " You already have an account");
      res.redirect("/");
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          if (err) return res.send(err.message);
          else {
            let user = await userModel.create({
              email,
              password: hash,
              fullname,
            });

            let token = generateToken(user);

            res.cookie("token", token);

            req.flash("success", "User Created Successfully");
            res.redirect("/");
          }
        });
      });
    }
  } catch (err) {
    res.send(err.message);
  }
};

module.exports.loginUser = async (req, res) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email: email });

  if (!user) {
    req.flash("error", "Email or password Incorrect");
    res.redirect("/");
  } else {
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        let token = generateToken(user);
        res.cookie("token", token);
        res.redirect("/shop");
      } else {
        req.flash("error", "Email or password Incorrect");
        res.redirect("/");
      }
    });
  }
};

module.exports.logout = (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
};

module.exports.profile = async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  res.render("profile", { user });
};
