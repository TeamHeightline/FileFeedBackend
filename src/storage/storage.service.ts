import bucket from "./config";
import {format} from "util";

const uploadFileToGoogleCloud = (file) => new Promise((resolve, reject) => {
    const {originalname, buffer} = file

    const blob = bucket.file(originalname.replace(/ /g, "_"))
    const blobStream = blob.createWriteStream({resumable: false})
    blobStream.on('finish', () => {
        const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        )

        bucket.file(blob.name).makePublic();
        resolve(publicUrl)
    })
        .on('error', () => {
            reject(`Unable to upload image, something went wrong`)
        })
        .end(buffer)
})

export default uploadFileToGoogleCloud