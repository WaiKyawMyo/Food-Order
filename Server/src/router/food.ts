import { Router } from "express";
import { upload } from "../middleware/multer-store";
import { CreateMenu } from "../controller/Food";


const router = Router()

router.post('/menu-create', upload.single('image'),CreateMenu);


export default router