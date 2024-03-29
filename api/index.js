import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// routers
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";

const app = express();

app.use((req, res, next) => {
  console.log(`收到來自 ${req.headers.origin} 的請求`);
  next();
});

// middleware
// app.use(
//   cors({
//     credentials: true,
//     origin: true,
//   })
// );
// app.use(
//   cors({
//     origin: "https://project-looselegs-v-client.vercel.app",
//     credentials: true, // 允許跨域請求發送cookies
//     methods: ["GET", "POST", "PUT", "DELETE"], // 允許的 HTTP 方法
//   })
// );
app.use(
  cors({
    origin: true,
    credentials: true, // 允許跨域請求發送cookies
    methods: ["GET", "POST", "PUT", "DELETE"], // 允許的 HTTP 方法
  })
);

app.use((req, res, next) => {
  console.log(`通過！`);
  next();
});

// app.use(cors());
// app.use(
//   cors({
//     origin: ["https://project-looselegs-v-client.vercel.app"],
//     methods: ["POST", "GET"],
//     credentials: true,
//   })
// );

dotenv.config();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded());

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

// ---------------
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

//error catch
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    // return or not，使用者都會看到，但return可以讓代碼停止。
    success: false,
    statusCode, // statusCode: statusCode
    message, // message: message
  });
});
