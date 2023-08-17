const User = require("../model/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const secretKey = "secretKey";
const errorHandler = require("../middleware/errorHandler");
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
    return res.json(
      errorHandler(
        "server is not running",
        false,
        error.details[0].message,
        500
      )
    );
  }
  try {
    const exist = await User.findOne({ email: req.body.email });
    if (exist) {
      return res.json("user already exist");
    } else {
      // bcrypt the password
      const bcryptPassword = await bcrypt.hash(req.body.password, saltRounds);
      // console.log(bcryptPassword);

      const newUser = new User({
        UserName: req.body.name,
        Email: req.body.email,
        Password: bcryptPassword,
        Profile: req.file.filename,
      });

      const registerUser = await newUser.save();
      jwt.sign(
        { id: registerUser._id },
        secretKey,
        { expiresIn: "2h" },
        (err, token) => {
          res.json(
            errorHandler(
              "login successful",
              true,
              {
                token: token,
                data: registerUser,
              },
              200
            )
          );
        }
      );
      //   console.log(registerUser);
      // return res.json(
      //   errorHandler("register success", true, registerUser, 201)
      // );
    }
  } catch (error) {
    res.json(errorHandler("server is down", false, error.message, 500));
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let findUser = await User.findOne({ Email: email });
    if (findUser) {
      const validPassword = await bcrypt.compare(password, findUser.Password);
      if (validPassword) {
        // first add user detail like id and email,second security key or secret key and third expire time
        jwt.sign(
          { id: findUser._id },
          secretKey,
          { expiresIn: "2h" },
          (err, token) => {
            res.json(
              errorHandler(
                "login successful",
                true,
                {
                  token: token,
                  data: findUser,
                },
                200
              )
            );
          }
        );
        // res.status(201).json({ message: "login successful", data: findUser });
      } else {
        res.json(
          errorHandler("Password is wrong", false, "password is wrong", 401)
        );
      }
    } else {
      res.json(errorHandler("User not found", false, "User is not found", 401));
    }
  } catch (error) {
    res.json(errorHandler("something wrong", false, error, 500));
  }
};
const userProfile = async (req, res) => {
  try {
    jwt.verify(req.token, secretKey, async (err, authData) => {
      if (err) {
        return res.json(
          errorHandler("Invalid token", true, "Enter a valid token", 401)
        );
      } else {
        const findProfile = await User.findOne({ _id: authData.id });
        if (findProfile) {
          return res.json(
            errorHandler(
              "User found",
              true,
              { findProfile: findProfile, token: authData },
              200
            )
          );
        }
      }
    });
  } catch (error) {
    res.json(errorHandler("something wrong", false, error, 500));
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json(errorHandler("enter a id", false, "enter a id", 202));
    }
    const findProfile = await User.findOne({ _id: id });
    // validate schema
    const updateSchema = Joi.object({
      email: Joi.string().email(),
      profile: Joi.string(),
    });
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return res.json(
        errorHandler(
          "server is not running",
          false,
          error.details[0].message,
          500
        )
      );
    }
    if (findProfile) {
      const updateProfile = await User.findByIdAndUpdate(
        { _id: id },
        { Profile: req.file.filename, Email: req.body.email },
        { new: true }
      );
      // console.log(updateProfile);
      return res.json(
        errorHandler("profile updated", true, updateProfile, 200)
      );
    } else {
      return res.json(
        errorHandler("enter valid id", false, "enter a valid id", 401)
      );
    }
  } catch (error) {
    res.json(errorHandler("something wrong", false, error, 500));
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json(errorHandler("enter a id", false, "enter a id", 400));
    }
    const deleteUser = await User.findByIdAndDelete({ _id: id });
    if (deleteUser) {
      return res.json(errorHandler("user is deleted", true, deleteUser, 200));
    } else {
      return res.json(
        errorHandler("enter a valid Id", false, "enter a valid id", 401)
      );
    }
  } catch (error) {
    res.json(errorHandler("something wrong", false, error, 500));
  }
};
module.exports = {
  allUser,
  registerUser,
  userProfile,
  userLogin,
  updateProfile,
  deleteUser,
};
