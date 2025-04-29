const AWS = require('aws-sdk');
const sharp = require('sharp');

const s3 = new AWS.S3();

exports.handler = async (event) => {
    const sourceBucket = 'tushar-nodeupload';
    const destinationBucket = 'tushar-lambdaupload';
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    try {
        const originalImage = await s3.getObject({
            Bucket: sourceBucket,
            Key: key
        }).promise();

        const resizedImage = await sharp(originalImage.Body).resize(200, 200).toBuffer();

        await s3.putObject({
            Bucket: destinationBucket,
            Key: key,
            Body: resizedImage,
            ContentType: 'image/jpeg'
        }).promise();
        console.log('Image resized and uploaded successfully');
        return {
            statusCode: 200,
            body: JSON.stringify('Image resized and uploaded successfully')
        };

    } catch (err) {
        console.error('Error processing image:', error);
        return {
            statusCode: 500,
            body: JSON.stringify(error),
        };
    }


};