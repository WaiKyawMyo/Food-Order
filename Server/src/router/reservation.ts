import { Router } from "express";
import { detailReservation, myReservationGet } from "../controller/reservation";

const router = Router()

router.get('/get-reservation',myReservationGet)
router.get('/reservation/detail/:id',detailReservation)

export default router