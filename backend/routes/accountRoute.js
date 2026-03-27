import express from "express"
import jwtVerification from "../middlware/jwtVerification.js"
import { bluk, userbalance, transfer, getUserDetail } from "../controller/accountController.js"

const router = express.Router()

router.get("/bluk", jwtVerification, bluk)
router.get("/userbalance", jwtVerification, userbalance)
router.post("/transfer/:id", jwtVerification, transfer)
router.get("/getuserdetail/:id", jwtVerification, getUserDetail)
export default router