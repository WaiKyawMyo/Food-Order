import { Router } from "express";
import { CreateCustomer, createDiscount, detailReservation, getAllTable, getDiscount, myReservationGet, updatetable } from "../controller/reservation";

const router = Router()

router.get('/get-reservation',myReservationGet)
router.get('/reservation/detail/:id',detailReservation)
router.post('/discount',createDiscount)
router.route('/dicountdata').get(getDiscount)
router.route('/alltabledata').get(getAllTable).put(updatetable).post(CreateCustomer)
export default router