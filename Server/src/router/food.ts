import { Router } from "express";
import { upload } from "../middleware/multer-store";
import { CreateMenu, deleteMenu, getAllMenu, updateMenu } from "../controller/Food";


const router = Router()

router.post('/menu-create', upload.single('image'),CreateMenu);
router.route('/get-menu').get(getAllMenu).delete(deleteMenu).put(upload.single('image'),updateMenu)

export default router