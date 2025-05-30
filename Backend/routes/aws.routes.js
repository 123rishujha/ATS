const express = require("express");
const { awsCtrl } = require("../controllers/aws.ctrl");
const { authMiddleware } = require("../middlewares/authMiddleware");

const awsRouter = express.Router();

awsRouter.put(
  "/aws-presigned-url-create",
  authMiddleware,
  awsCtrl.createPresignedUrlForPut
);
awsRouter.get(
  "/aws-presigned-url-read",
  authMiddleware,
  awsCtrl.presignedUrlForRead
);

module.exports = { awsRouter };
