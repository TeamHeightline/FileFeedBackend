import {FileRepository} from "../repository/file.repository";
import {getConnection} from "typeorm";
import {FileEntity} from "../database/entities/file.entity";
import {UserEntity, UserWithOptionalPassword} from "../database/entities/user.entity";
import uploadFileToGoogleCloud from "../storage/storage.service";
import {UserService} from "./user.service";


export class FileService {
    private fileRepository: FileRepository
    private userService: UserService

    constructor() {
        this.fileRepository = getConnection("default")
            .getCustomRepository(FileRepository)
        this.userService = new UserService()
    }

    public uploadFile = async (file, user: UserEntity) => {
        const {originalname} = file
        const destination = await uploadFileToGoogleCloud(file)

        const fileLinker = new FileEntity()
        fileLinker.filename = originalname
        fileLinker.user = user
        fileLinker.destination = String(destination)
        fileLinker.mimetype = file.mimetype
        return await this.createFileLinker(fileLinker)

    }

    private createFileLinker = async (file: FileEntity) => {
        return await this.fileRepository.save(file)
    }

    public allFilesID = async () => {
        const allFilesData = await this.fileRepository.find()
        return allFilesData.map((file: FileEntity) => file.id)
    }

    public getFileByID = async (id: string) => {
        const file: fileWithOptionalUser = await this.fileRepository.findOneOrFail(id, {relations: ['user']})
        if (file?.user?.id) {
            delete file.user.password
        } else {
            file.user = {
                email: "anonimusUser",
                id: 0,
                files: []
            }
        }
        return file
    }


    public myFiles = async (userID: string) => {
        const myFiles = await this.fileRepository.find({
            where: {
                user: {
                    id: userID
                }
            }
        })
        return myFiles.map((file: FileEntity) => file.id)
    }

    public deleteFileByID = async (fileID: string, userID) => {
        const file = await this.fileRepository.findOneOrFail(fileID, {relations: ['user']})
        if (String(file.user.id) === String(userID)) {
            await this.fileRepository.remove(file)
            return ({message: "Success deleted"})
        } else {
            return ({message: "Error deleting"})
        }
    }

}

interface fileWithOptionalUser extends Omit<FileEntity, "user"> {
    user: UserWithOptionalPassword
}