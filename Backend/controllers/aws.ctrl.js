const awsFuncs = require("../utils/s3");

const awsCtrl = {
  createPresignedUrlForPut: async (req, res) => {
    const { key, contentType, isPrivate } = req.body;
    try {
      const { presignedUrl, previewLink, mainKey } =
        await awsFuncs.createPresigedPostUrl({ key, contentType, isPrivate });

      if (presignedUrl && previewLink) {
        return res.status(200).json({
          success: true,
          data: {
            presignedUrl,
            previewLink,
            mainKey,
          },
        });
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, msg: "Internal server error", err: err });
    }
  },
  presignedUrlForRead: async (req, res) => {
    const { key } = req.query;
    try {
      const { presignedUrl, previewLink } = await awsFuncs.getPresigedReadUrl({
        key,
      });

      if (presignedUrl && previewLink) {
        return res.status(200).json({
          success: true,
          data: {
            presignedUrl,
            previewLink,
          },
        });
      }
    } catch (err) {
      let tokenExpiredError = checkTokenExpiryErr(err);
      console.log("error while getting read signed url", err);
      if (tokenExpiredError) {
        res.status(400).json(tokenExpiredError);
      } else {
        res
          .status(500)
          .json({ success: false, msg: "Internal server error", err: err });
      }
    }
  },
};

module.exports = { awsCtrl };
