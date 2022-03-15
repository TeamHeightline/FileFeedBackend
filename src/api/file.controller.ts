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

    private upload = async (req, res: Response, next) => {
        try {
            const user = await req.user
            const fileForUploadFile = req.file
            const imageUrl = await this.fileService.uploadFile(fileForUploadFile, user)
            res.status(200).json({
                message: "Upload was successful",
                data: imageUrl
            })
        } catch (error) {
            next(error)
        }
    }

    public routes() {
        this.router.post('/upload', this.upload);
    }

}