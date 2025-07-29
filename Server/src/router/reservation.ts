import { Router } from "express";
import { createDiscount, detailReservation, myReservationGet } from "../controller/reservation";

const router = Router()

router.get('/get-reservation',myReservationGet)
router.get('/reservation/detail/:id',detailReservation)
router.post('/discount',createDiscount)

export default router