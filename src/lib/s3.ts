import { Client, Storage } from "appwrite";
import { toast } from "sonner";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('678214740011efc3b8ec');

const storage = new Storage(client);

export async function uploadFile(file: File | undefined) {

    if(!file) throw new Error('File is undefined')

    const fileKey = Date.now().toString() + "_" + file.name.replace(' ', '-')
 
    const res = await storage.createFile('6782148a002e26893ddb', fileKey.slice(0,15) , file, [] ,(progress) => console.log(progress.progress))
    console.log(res)
    return { fileName: res.name, fileKey}
}

export const getFileURL = (fileKey: string) => storage.getFilePreview('6782148a002e26893ddb', fileKey)

export async function deleteAllFiles(bucketId: string) {
    try {
        const files = await storage.listFiles(bucketId);
        
        for (const file of files.files) {
            await storage.deleteFile(bucketId, file.$id);
            toast.success(`Deleted file: ${file.name}`);
        }

        toast.success('All files deleted successfully!');
    } catch (error) {
        toast.error('Error deleting files:')
        console.error(error)
    }
}

// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// export async function uploadToS3(file: File | undefined){

//   if(!file) {
//     return
//   }

//   try {

//     const S3 = new S3Client({
//         region: 'ap-south-1',
//         credentials: {
//             accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
//             secretAccessKey:  process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string
//         }
//     })

//     const file_key = 'uploads/' + Date.now().toString() + " " +  file?.name.replace(' ', '-')

//     const upload = await S3.send(new PutObjectCommand({
//         Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
//         Key: file_key,
//         Body: file
//     }))
//     return {fileKey: file_key, fileName: file.name}
    
//   } catch(e: any) {
//     console.error('Error uploading to S3', e)
//     // return {error: 'Something went wrong. Try again !'}
//   }
// }

// export function getS3Url(file_key: string) {
//    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`
//    return url
// }

// // const upload = s3.putObject(params).on('httpUploadProgress', e => {
// //  console.log('uploading to s3...', parseInt((e.loaded * 100 / e.total).toString()) + '%')
