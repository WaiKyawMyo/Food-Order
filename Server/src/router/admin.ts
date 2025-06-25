import { Router } from "express";
import { adminLogin, adminLogout, AdminStaffRegister, deletAdmin, getAdminProfile, getAllAdmin, regiterAdmin, updateAdmin, updateAdminProfile } from "../controller/Admin";
import product from "../middleware/authMiddleware";
import { checkAdmin } from "../middleware/staffMiddleware";

const router = Router()
router.post('/register',regiterAdmin)

router.route('/Admin_table').get(getAllAdmin).delete(deletAdmin).put(updateAdmin)
router.post('/login',adminLogin)
router.post('/logout',adminLogout)
router.post('/staff',product ,checkAdmin,AdminStaffRegister)
router.route('/profile').get(product ,getAdminProfile).put(product,updateAdminProfile)


export default router