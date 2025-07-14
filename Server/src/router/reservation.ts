import { Router } from "express";
import { myReservationGet } from "../controller/reservation";

const router = Router()

router.get('/get-reservation',myReservationGet)

export default router