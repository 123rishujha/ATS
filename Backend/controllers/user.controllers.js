require("dotenv").config();

const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
const registerController = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return next(new Error("Please fill all the fields"));
  }

  try {
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      const error = new Error("User already exists with the provided email");
      error.statusCode = 401;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.json({
      success: true,
      msg: "Registration successful.",
    });
  } catch (err) {
    console.log("Error in registerController:", err);
    return next(err);
  }
};

// LOGIN
const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userFound = await UserModel.findOne({ email });
    if (!userFound) {
      const err = new Error("User Not Found! Wrong Credentials");
      err.statusCode = 404;
      return next(err);
    }

    const match = await bcrypt.compare(password, userFound.password);
    if (!match) {
      const err = new Error("Wrong Credentials");
      err.statusCode = 401;
      return next(err);
    }

    const token = jwt.sign(
      { userId: userFound._id },
      process.env.JWT_SECRET || "your-secret-key"
    );

    const tempUser = userFound.toObject();
    delete tempUser.password;

    res.send({
      success: true,
      data: { user: { ...tempUser, token } },
      msg: "Login successful",
    });
  } catch (err) {
    console.log("Error in loginController:", err);
    err.statusCode = 400;
    return next(err);
  }
};

// LOGOUT
const logoutController = async (req, res, next) => {
  const user = req.user;

  if (!user || !user._id) {
    const error = new Error("User not authorized");
    error.statusCode = 401;
    return next(error);
  }

  res.status(200).json({ success: true, msg: "Logout successful", user });
};


// GET SINGLE USER
const getUser = async (req, res, next) => {
  const userId = req.params.userId || req.user._id;

  if (!userId) {
    const error = new Error("Forbidden");
    error.statusCode = 403;
    return next(error);
  }

  try {
    const userFound = await UserModel.findById(userId).select("-password");

    if (!userFound) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json({
      success: true,
      user: userFound,
    });
  } catch (err) {
    console.log("Error in getUser:", err);
    return next(err);
  }
};


// UPDATE PROFILE
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // Allow update of common fields
    if (req.body.name) {
      user.name = req.body.name;
    }

    if(req.body.userPhoto){
      user.userPhoto = req.body.userPhoto;
    }

    if(req.body.description){
      user.description = req.body.description;
    }

    // Optionally allow other common fields here (e.g., email) with validation

    // Role-specific updates
    if (user.role === "jobseeker") {
      if (req.body.resume) {
        if (!user.resume) user.resume = {};
        Object.assign(user.resume, req.body.resume);
        // Always set uploadedAt if not provided
        // if (!user.resume.uploadedAt) 
        user.resume.uploadedAt = (new Date()).toISOString();
      }
      if (req.body.jobPreferences) {
        if (!user.jobPreferences) user.jobPreferences = {};
        Object.assign(user.jobPreferences, req.body.jobPreferences);
      }
    } else if (user.role === "recruiter") {
      if (req.body.company) {
        if (!user.company) user.company = {};
        Object.assign(user.company, req.body.company);
      }
    } else {
      const error = new Error("Invalid user role");
      error.statusCode = 400;
      return next(error);
    }

    await user.save();
    const updatedUser = user.toObject();
    delete updatedUser.password;

    // Format date fields as ISO 8601
    if (updatedUser.resume && updatedUser.resume.uploadedAt) {
      updatedUser.resume.uploadedAt = new Date(updatedUser.resume.uploadedAt).toISOString();
    }
    if (updatedUser.createdAt) {
      updatedUser.createdAt = new Date(updatedUser.createdAt).toISOString();
    }
    if (updatedUser.updatedAt) {
      updatedUser.updatedAt = new Date(updatedUser.updatedAt).toISOString();
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key"
    );

    res.json({
      success: true,
      msg: "Profile updated successfully",
      data: {...updatedUser,token},
    });
  } catch (err) {
    console.log("Error in updateProfile:", err);
    return next(err);
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  getUser,
  updateProfile,
};
