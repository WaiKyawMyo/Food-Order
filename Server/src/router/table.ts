import { Router } from "express";
import { addTable, deletTable, getAllTable, updateTable } from "../controller/Table";
import product from "../middleware/authMiddleware";

const route = Router()

route.route('/add_table').post(product,addTable).get(getAllTable).delete(deletTable).put(updateTable)

export default route