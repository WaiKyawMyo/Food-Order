import { Router } from "express";
import { upload } from "../middleware/multer-store";
import { CreateMenu, deleteMenu, getAllMenu, updateMenu } from "../controller/Food";
import { CreaetSet, deleteSet, getAllSet, updaetSet } from "../controller/Set";

const router = Router()

router.post('/menu-create', upload.single('image'),CreateMenu);
router.route('/get-menu').get(getAllMenu).delete(deleteMenu).put(upload.single('image'),updateMenu)

router.post('/create-set',upload.single('image'),CreaetSet)
router.route('/get-set').get(getAllSet).delete(deleteSet).put(upload.single('image'),updaetSet)



export default router