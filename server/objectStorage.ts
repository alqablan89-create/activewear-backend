import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_ENDPOINT = process.env.R2_ENDPOINT!;

export class ObjectStorageService {
  private client = new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  async getPublicUploadURL(fileName?: string) {
    const id = randomUUID();
    const ext = fileName?.split(".").pop() || "jpg";
    const objectKey = `products/${id}.${ext}`;

    // Generate signed URL for PUT upload
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: objectKey,
      ContentType: `image/${ext}`,
    });

    const uploadURL = await getSignedUrl(this.client, command, { expiresIn: 900 });

    // Public URL (after upload completed)
    const publicURL = `${R2_ENDPOINT}/${objectKey}`;

    return { uploadURL, publicURL };
  }

  async getPrivateUploadURL() {
    const id = randomUUID();
    const objectKey = `private/${id}.dat`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: objectKey,
    });

    const uploadURL = await getSignedUrl(this.client, command, { expiresIn: 900 });

    return { uploadURL, path: objectKey };
  }

  async getSignedGetURL(objectKey: string) {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: objectKey,
    });

    return getSignedUrl(this.client, command, { expiresIn: 3600 });
  }
}