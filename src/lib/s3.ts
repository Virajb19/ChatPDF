import { Client, Storage } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('678214740011efc3b8ec');

const storage = new Storage(client);

export async function uploadFile(file: File | undefined) {

    if(!file) throw new Error('File is undefined')

    const fileKey = Date.now().toString() + "_" + file.name.replace(' ', '-')
    const fileId = fileKey.slice(0, 15)
    const res = await storage.createFile('6782148a002e26893ddb', fileId , file, [] ,(progress) => console.log(progress.progress))

    return { fileName: res.name, fileKey}
}

export const getFileURL = (fileKey: string) => storage.getFilePreview('6782148a002e26893ddb', fileKey.slice(0, 15))
