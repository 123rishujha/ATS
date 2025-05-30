const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const BUCKET_NAME = "connect-randomly";

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.S3_USER_ACCESS_KEY,
    secretAccessKey: process.env.S3_USER_SECRET_KEY,
  },
});

const awsFuncs = {
  createPresigedPostUrl: async ({ key, contentType, isPrivate }) => {
    const mainKey = isPrivate ? "private/" + key : "public/" + key;
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: mainKey,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 5 * 60,
    });

    const previewLink = `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${mainKey}`;

    return { presignedUrl, previewLink, mainKey };
  },
  getPresigedReadUrl: async ({ key }) => {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 24 * 60 * 60,
    });

    const previewLink = `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${key}`;

    return { presignedUrl, previewLink };
  },
};

module.exports = awsFuncs;
