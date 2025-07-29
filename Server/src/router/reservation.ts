import { Router } from "express";
import { createDiscount, detailReservation, getDiscount, myReservationGet } from "../controller/reservation";

const router = Router()

router.get('/get-reservation',myReservationGet)
router.get('/reservation/detail/:id',detailReservation)
router.post('/discount',createDiscount)
router.route('/dicountdata').get(getDiscount)

export default router