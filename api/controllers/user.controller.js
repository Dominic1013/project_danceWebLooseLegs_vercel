import bcryptjs from "bcryptjs";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({
    message: "API Route is working",
  });
};

export const updateUser = async (req, res, next) => {
  //如果token拿回來驗證的req.user.id跟網址上req.params.id不一樣的話。
  //這裡的user是req的user，不是mongodb的user，所以id不用加上_
  //req的user的id
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));
  try {
    // if user to change password,we hash it
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // 這種更新盡量都把全部的內容寫出來，不用...req.body，因為user可以用postman等等網站將自己寫成admin，一同展開。
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
          introPic: req.body.introPic,
          stageName: req.body.stageName,
          teacherDesc: req.body.teacherDesc,
          styles: req.body.styles,
        },
      },
      { new: true } // get a new info, otherwise, you would get a prev onn info
    );

    const { password, ...rest } = updateUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    // mongoose deleteone
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token"); // delete cookie
    res.status(200).json("User has been deleted"); //delete account
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

//不是req.user哦，這邊req.user是現在請求的user，這個人並不是創造頁面的user。
// 這裡的req.params.id是 listing的userRef
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found!"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
