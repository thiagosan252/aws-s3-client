require('dotenv').config();

const {
  S3Client,
  CreateBucketCommand,
  ListBucketsCommand,
  PutObjectCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
  DeleteBucketCommand
} = require("@aws-sdk/client-s3");
const path = require("path");
const fs = require("fs");

const client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    sessionToken: process.env.aws_session_token
  }
});

/**
 * @param {string} bucketName
 * Name the bucket
 */
const createBucket = async (bucketName) => {

  const bucketParams = { Bucket: bucketName };
  try {
    const data = await client.send(new CreateBucketCommand(bucketParams));
    if (data)
      console.log("Bucket ", data.Location);
  } catch (err) {
    console.error(err);
  }
};

/**
 * @param {string} bucketName
 * Name the bucket
 */
const deleteBucket = async (bucketName) => {

  const bucketParams = { Bucket: bucketName };
  try {
    const data = await client.send(new DeleteBucketCommand(bucketParams));
    if (data)
      console.log("Sucess ", data);
  } catch (err) {
    console.error(err);
  }
};

/**
 * List all buckets in AWS
 */
const listBuckets = async () => {

  try {
    const data = await client.send(new ListBucketsCommand({}));
    if (data)
      data.Buckets.forEach(bucket => {
        console.log('BucketName = ', bucket.Name, ' | BucketCreationDate = ', bucket.CreationDate.toLocaleString())
      })
    else
      console.log('No buckets')
  } catch (err) {
    console.error(err);
  }
}

/**
 * @param {string} file
 * Path and Name the file
 * @param {string} bucketName
 * Bucket Name
 */
const uploadObject = async (file, bucketName) => {

  try {

    const fileStream = fs.createReadStream(file);

    const uploadParams = {
      Bucket: bucketName,
      Key: path.basename(file),
      Body: fileStream,
    };

    const data = await client.send(new PutObjectCommand(uploadParams));
    if (data)
      console.log("Success", data);

  } catch (err) {
    console.error(err);
  }
}

/**
 * @param {string} bucketName
 * Bucket Name
 */
const listObjects = async (bucketName) => {

  const bucketParams = { Bucket: bucketName };
  try {

    const data = await client.send(new ListObjectsCommand(bucketParams));
    if (data)
      data.Contents.forEach(object => {
        console.log("ObjectKey := ", object.Key, " | ObjectLastModified := ", object.LastModified.toLocaleString(), "| ObjectSize := ", object.Size);
      })
    else
      console.log('Not found objects in the buckets')

  } catch (err) {
    console.error(err);
  }
}

/**
 * @param {string} bucketName
 * Bucket Name
 * @param {string} objectKey
 * Object Key
 */
const deleteObject = async (objectKey, bucketName) => {

  const deleteParams = {
    Bucket: bucketName,
    Key: objectKey,
  };

  try {

    const data = await client.send(new DeleteObjectCommand(deleteParams));
    if (data)
      console.log("Success", data);

  } catch (err) {
    console.error(err);
  }
}

/**
 * @param {number} option
 * 1 - Create Bucket
 * 2 - List all buckets
 * 3 - Upload file in bucket
 */
const main = (option) => {

  if (option === 1) createBucket(process.env.BUCKET_NAME);
  if (option === 2) listBuckets();
  if (option === 3) uploadObject("./test.txt", process.env.BUCKET_NAME); // Path to and name of object. For example '../myFiles/test.txt'.
  if (option === 4) listObjects(process.env.BUCKET_NAME);
  if (option === 5) deleteObject('test.txt', process.env.BUCKET_NAME);
  if (option === 6) deleteBucket(process.env.BUCKET_NAME);

}

// change the number or uncomment the lines
main(1);
// main(2);
// main(3);
// main(4);
// main(5);
// main(6);