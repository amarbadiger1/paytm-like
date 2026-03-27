import express from "express"
import { register, login, updateProfile } from "../controller/authController.js"
import jwtVerification from "../middlware/jwtVerification.js"

const router = express.Router()

router.post("/register", register)

router.post("/login", login)

router.put("/update-profile", jwtVerification, updateProfile)


export default router