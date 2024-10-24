import AWS from 'aws-sdk'

export async function uploadToS3(file: File | undefined){

  if(!file) {
    return
  }

  try {
       AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
       })

       const s3 = new AWS.S3({
        params: {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME
        },
        region: 'ap-south-1'
       })

       const file_key = 'uploads/' + Date.now().toString() + file?.name.replace(' ', '-')

       const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
        Key: file_key,
        Body: file
       }

       const upload = s3.putObject(params).on('httpUploadProgress', e => {
         console.log('uploading to s3...', parseInt((e.loaded * 100 / e.total).toString()) + '%')
       })
       console.log(upload)
       console.log('in uploadToS3 function')
  } catch(e) {
    console.error(e)
  }
}

export function getS3Url(file_key: string) {
   const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`
   return url
}
