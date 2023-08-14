const User = require("../model/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const saltRound = 10;
const salt = await bcrypt.genSalt(saltRound);

const allUser = async (req, res) => {
  res.json("hello world");
};

const registerUser = async (req, res, next) => {
  // validate schema
  const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    // reference to password
    repeat_password: Joi.ref("password"),
  });

  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.json(error);
  }
  try {
    const exist = await User.findOne({ email: req.body.email });
    if (exist) {
      return res.json("user already exist");
    } else {
      // bcrypt the password
      const bcryptPassword = await bcrypt.hash(req.body.password, salt);
      console.log(bcryptPassword);
      const newUser = new User({
        UserName: req.body.name,
        Email: req.body.email,
        Password: bcryptPassword,
        Profile: req.file.filename,
      });
      const registerUser = await newUser.save();
      //   console.log(registerUser);
      return await res.status(201).json("register ");
    }
  } catch (error) {
    res.status(500).json(error, "something wrong");
  }
};

const userProfile = async (req, res) => {
  try {
    const { email, password } = req.body;
    let findUser = await User.findOne({ email: email });
    console.log(findUser);
    if (findUser) {
      const validPassword = await bcrypt.compare(password, findUser.Password);
      bcrypt.compare(validPassword, hash, function (err, res) {
        // res === true
      });
      console.log(validPassword);
      res.send(validPassword);
    } else {
      res.status(401).json("user not found");
    }
  } catch (error) {
    res.status(500).json(error + "  server is down");
  }
};
const userLogin = async (req, res) => {};

module.exports = {
  allUser,
  registerUser,
  userProfile,
};
