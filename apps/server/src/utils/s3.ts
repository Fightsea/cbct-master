import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';

const bucketName = process.env.S3_BUCKET!;

const s3 = new S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
  useAccelerateEndpoint: Boolean(process.env.S3_USE_ACCELERATE)
});

/**
 * Upload a file to S3.
 * @param key - The key to upload the file under.
 * @param path - The path to the file to upload.
 */
export const uploadFile = async (key: string, path: string) => {
  const params: S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: key,
    Body: fs.createReadStream(path)
  };

  await s3.upload(params).promise();
};

/**
 * Upload a file to S3.
 * @param key - The key to upload the file under.
 * @param path - The path to the file to upload.
 */
export const uploadBinary = async (key: string, data: BinaryData) => {
  const params: S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: key,
    Body: data
  };

  await s3.upload(params).promise();
};

/**
 * List files in a bucket with a prefix.
 * @param prefix - The prefix to list files for.
 * @param max - The maximum number of files to list.
 * @returns An object containing the keys and count of the files.
 */
export const listFiles = async (prefix: string, max: number) => {
  let totalCount = 0;
  const firstKeys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const params: S3.ListObjectsV2Request = {
      Bucket: bucketName,
      Prefix: prefix,
      MaxKeys: 1000,
      ContinuationToken: continuationToken
    };

    const result = await s3.listObjectsV2(params).promise();

    // Increment total count
    totalCount += result.Contents?.length || 0;

    // Collect the first few keys if they haven't been retrieved yet
    if (firstKeys.length < max) {
      firstKeys.push(...result.Contents?.slice(0, max - firstKeys.length).map(item => item.Key!) || []);
    }

    // Continue if more objects exist
    continuationToken = result.IsTruncated ? result.NextContinuationToken : undefined;
  } while (continuationToken);

  return {
    keys: firstKeys,
    count: totalCount
  };
};

/**
 * Delete a file from S3.
 * @param key - The key of the file to delete.
 */
export const deleteFile = async (key: string) => {
  const params: S3.DeleteObjectRequest = {
    Bucket: bucketName,
    Key: key
  };

  await s3.deleteObject(params).promise();
};
