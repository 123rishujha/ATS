const express = require("express");
const userRouter = express.Router();
//controllers;
const {
  registerController,
  loginController,
  logoutController,
  getUser,
  updateProfile,
} = require("../controllers/user.controllers");
const { authMiddleware } = require("../middlewares/authMiddleware");

//register user -> /api/user/register
userRouter.post("/register", registerController);
//login user -> /api/user/login
userRouter.post("/login", loginController);

//logout user -> /api/user/logout
userRouter.post("/logout", authMiddleware, logoutController);



//get single user -> /api/user/profile
userRouter.get("/profile/:userId", authMiddleware, getUser);

// update user profile -> /api/user/profile
userRouter.put("/profile", authMiddleware, updateProfile);

module.exports = {
  userRouter,
};
