import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  //   console.log(req.body);
  const { username, email, password } = req.body;
  const hashPassword = bcryptjs.hashSync(password, 10);
  const user = new User({ username, email, password: hashPassword }); // 屬性簡寫

  try {
    await user.save();
    res.status(201).json("User created successfully!");
  } catch (err) {
    // res.status(500).json(err.message);
    next(err); // to index.js error catch
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //check email exist
    const validUser = await User.findOne({ email }); // found User data
    if (!validUser) return next(errorHandler(404, "User Not Found!")); //use our own error to pass

    //check password
    const validPassword = bcryptjs.compareSync(password, validUser.password); // sync操作
    if (!validPassword) return next(errorHandler(401, "Wrong cridential!")); // use our own error to pass

    // sign the JWT for user browser
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); // 第一個是確認使用者獨一無二token，第二個是確認網站JWT獨一無二

    // prevent password(even hashed) in res info to user, this is more safe.
    const { password: pass, ...rest } = validUser._doc; // User data 都在 _doc下方

    // create a cookie with JWT & User message
    res
      .cookie("access_token", token, {
        // httpOnly: true, // 第三方網站不能使用cookie 不給JS訪問
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json(rest); //  rest也包含_id,都會被前端一並用dispatch()，將currentUser,loading,error存入localStorage裡面。
  } catch (error) {
    next(error);
  }
};

// google auth
export const google = async (req, res, next) => {
  try {
    // if db doesn't have this user, create it
    // if db have this user, login it

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // have this user
      // jwt.sign(payload, secret, options)
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, {
          // httpOnly: true,
        })
        .status(200)
        .json(rest); // info turn to Json to client side
    } else {
      // create a new User
      // because google Auth user Doesn't have password, we need to create one
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      // google username like this YiTi Huang, we dont want white space,so join() it.
      // add some random numbers
      // make it like YiTiHuang1125
      const newUser = new User({
        username:
          req.body.name.split("").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      // create a user
      await newUser.save();

      // and also login it, give user JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, {
          // httpOnly: true,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
