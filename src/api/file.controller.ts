import {Response, Router} from "express";
import {FileService} from "../services/file.service";

export class FileController {
    public router: Router;
    private fileService: FileService;

    constructor() {
        this.fileService = new FileService()
        this.router = Router();
        this.routes();
    }

    private upload = async (req, res: Response) => {
        try {
            const user = await req.user
            const fileForUploadFile = req.file
            const imageUrl = await this.fileService.uploadFile(fileForUploadFile, user)
            res.status(200).json({
                message: "Upload was successful",
                data: imageUrl
            })
        } catch (error) {
            res.send(error).json()
        }
    }

    private allFiles = async (req, res: Response) => {
        const filesIDArray = await this.fileService.allFilesID();
        res.status(200).json({allFilesID: filesIDArray});
    }


    private getFileByID = async (req, res: Response) => {
        const id = req['params']['id'];
        const file = await this.fileService.getFileByID(id)
        res.status(200).json({fileEntity: file})
    }

    private myFiles = async (req, res: Response) => {
        try {
            const user = await req.user
            let myFilesIDArray: number[] = []
            if (user?.id) {
                myFilesIDArray = await this.fileService.myFiles(user.id)
            }
            res.status(200).json({myFilesIDArray: myFilesIDArray});
        } catch (error) {
            res.send(error).json()
        }
    }

    private deleteFileByID = async (req, res: Response) => {
        try {
            const fileID = req['params']['id']
            const user = await req.user
            const {message} = await this.fileService.deleteFileByID(fileID, user.id)
            if (message === "Success deleted") {
                res.status(200).json(message)
            } else {
                res.status(500).json(message)
            }
        } catch (e) {
            res.send(e).json()
        }
    }

    public routes() {
        this.router.post('/upload', this.upload);
        this.router.get("/all", this.allFiles);
        this.router.get("/my", this.myFiles);
        this.router.get("/:id", this.getFileByID);
        this.router.post("/delete/:id", this.deleteFileByID);
    }

}