import {FileRepository} from "../repository/file.repository";
import {getConnection} from "typeorm";
import {FileEntity} from "../database/entities/file.entity";
import bucket from "../storage/config";
import {format} from "util";
import {UserEntity} from "../database/entities/user.entity";


export class FileService {
    private fileRepository: FileRepository

    constructor() {
        this.fileRepository = getConnection("default").getCustomRepository(FileRepository)
    }

    public uploadFile = async (file, user: UserEntity) => {
        const {originalname} = file
        const fullUploadedPath = await this.uploadFileToGoogleCloud(file)

        const fileLinker = new FileEntity()
        fileLinker.filename = originalname
        fileLinker.user = user
        fileLinker.destination = String(fullUploadedPath)
        fileLinker.mimetype = file.mimetype
        return await this.createFileLinker(fileLinker)

    }

    private uploadFileToGoogleCloud = (file) => new Promise((resolve, reject) => {
        const {originalname, buffer} = file

        const blob = bucket.file(originalname.replace(/ /g, "_"))
        const blobStream = blob.createWriteStream({resumable: false})
        blobStream.on('finish', () => {
            const publicUrl = format(
                `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            )
            resolve(publicUrl)
        })
            .on('error', () => {
                reject(`Unable to upload image, something went wrong`)
            })
            .end(buffer)
    })

    private createFileLinker = async (file: FileEntity) => {
        return await this.fileRepository.save(file)
    }


}