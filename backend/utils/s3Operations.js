import {S3Client , PutObjectCommand,DeleteObjectCommand} from "@aws-sdk/client-s3";


const uploadToS3 = async (file,id) => {
    const s3 = new S3Client({
    region : "ap-south-1",
    credentials : {
        accessKeyId : process.env.AWS_ACCESS_KEY,
        secretAccessKey : process.env.AWS_SECRET_KEY
    }
});
  const params = {
    Bucket: "probleminputfiles",
    Key: `${id}`+"/"+file.fieldname,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  await s3.send(new PutObjectCommand(params));

  return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
};

export const deleteFromS3 = async (file,id)=>{
const client = new S3Client({ region: "ap-south-1" });

const deleteParams = {
  Bucket: "probleminputfiles",
  Key: `${id}`+"/"+file, // The full path inside the bucket
};

try {
  const response = await client.send(new DeleteObjectCommand(deleteParams));
  console.log("Success", response);
} catch (err) {
  console.error("Error", err);
}
}

export default uploadToS3;