import logger from "../middleware/logger";

const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require("dotenv").config();
// 1. Setup AWS S3 client
const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// 2. Generate Pre-signed URL
export async function generateSignedURL(Key:string) {

    const command = new GetObjectCommand({
        Bucket: 'tushar-nodeupload',
        Key: Key,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 30 }); // valid for 1 hour
    logger.info('Pre-Signed URL:', signedUrl);
    return signedUrl;
}

export async function uploadPhoto(folderName: string, fileName: string, content: any) {
    try {
        const parmas = {
            Bucket: 'tushar-nodeupload',
            Key: `${folderName}/${fileName}`,
            Body: content.buffer,
            ContentType: 'image/jpeg'
        };
        const command = new PutObjectCommand(parmas);
        const Response = s3.send(command);
        return await Response;        
    } catch (err) {
        logger.error(err);
    }
}
