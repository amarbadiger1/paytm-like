import User from "../model/userModel.js"
import Balance from "../model/balance.js"
import bcrypt from "bcrypt"
import { z } from "zod"
import jwt from "jsonwebtoken"

const userSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.email(),
    password: z.string().min(6)
})

const userLoginSchema = z.object({
    email: z.string(),
    password: z.string().min(6)
})

export const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        const userValidation = userSchema.safeParse({ firstname, lastname, email, password })

        if (!userValidation.success) {
            return res.status(400).json({
                message: "Invalid Inputs"
            })

        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "User/Email already Exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword
        })
        const randomValue = 1 + Math.random() * 10000
        await Balance.create({
            userId: newUser._id,
            balance: randomValue.toFixed(2)
        })

        return res.status(201).json({
            message: "User Created"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const loginValidation = userLoginSchema.safeParse({ email, password })

        if (!loginValidation.success) {
            return res.status(400).json({
                message: "Invalid Inputs",
                error:loginValidation.error
            })
        }
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({
                message: "User Not Found"
            })
        }

        const isMatch = await bcrypt.compare(password, existingUser.password)

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const jwtpassword = process.env.JWT_SECRET;

        if (!jwtpassword) {
            throw new Error("JWT_SECRET not defined");
        }

        const token = jwt.sign({ email: existingUser.email, userId: existingUser._id }, jwtpassword, { expiresIn: "1d" })

        return res.status(200).json({
            message:"User Logged in successfully",
            token,
            firstname: existingUser.firstname,
            lastname: existingUser.lastname
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const userUpdateSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6)
})


export const updateProfile = async (req, res) => {
    try {
        const { firstname, lastname, currentPassword, newPassword } = req.body;
        const id = req.userId

        const validation = userUpdateSchema.safeParse({ firstname, lastname, currentPassword, newPassword })

        if (!validation.success) {
            return res.status(401).json({
                message: "Invalid Inputs"
            })
        }

        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password)

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password Doesnt Match"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await User.findByIdAndUpdate(id, { firstname, lastname, password: hashedPassword })

        return res.status(201).json({
            message: "User Profile updated Successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}