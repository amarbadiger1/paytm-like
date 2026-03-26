import express from "express"
import jwtVerification from "../middlware/jwtVerification.js"
import { bluk, userbalance ,transfer} from "../controller/accountController.js"

const router = express.Router()

router.get("/bluk", jwtVerification, bluk)
router.get("/userbalance", jwtVerification, userbalance)
router.post("/transfer", jwtVerification, transfer)


export default router