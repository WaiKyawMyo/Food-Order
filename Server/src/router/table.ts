import { Router } from "express";
import { addTable, conpleteOrder, deletTable, getAllTable, show_order, showAllOrders, updateTable } from "../controller/Table";
import product from "../middleware/authMiddleware";

const route = Router()

route.route('/add_table').post(product,addTable).get(getAllTable).delete(deletTable).put(updateTable)
route.route('/show-detail').post(show_order)
route.route('/showall').get(showAllOrders).put(conpleteOrder)

export default route