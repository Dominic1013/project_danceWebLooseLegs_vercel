import express from "express";
import {
  deleteUser,
  test,
  updateUser,
  getUserListings,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
// router.get("/listings/:id", verifyToken, getUserListings);
router.get("/listings/:id", getUserListings); // 在user的頁面呈現 所有的listings or teacherInfo頁面上呈現，應該不需要驗證
router.get("/:id", getUser); // Contact
// router.get("teacher/:id", getTeacher);
export default router;
