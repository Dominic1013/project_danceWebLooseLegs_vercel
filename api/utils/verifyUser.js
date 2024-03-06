import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

// this is verify middleware,if success, pass to next function.like user.route.js update
export const verifyToken = (req, res, next) => {
  console.log("into JWT verify");
  const token = req.cookies.access_token;

  if (!token) return errorHandler(401, "Unauthorized"); // maybe we can navigate user to login page(in frontEnd to mutate)(clear localStorage)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // 正確名稱應該是err, payload
    if (err) return next(errorHandler(403, "Forbidden"));

    // 導入的這個user，是來自於jwt sign的時候，也就是const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    // 這個user只是一個validUser的 id而已
    req.user = user;
    // console.log(user);
    next();
  });
};
