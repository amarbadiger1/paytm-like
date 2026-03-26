import mongoose from "mongoose";
import Balance from "../model/balance.js";
import User from "../model/userModel.js";

export const bluk = async (req, res) => {
    try {
        const id = req.userId
        const filter = req.query.filter || "";
        const allUsers = await User.find({
            $and: [
                { _id: { $ne: id } },
                {
                    $or: [
                        { firstname: { $regex: filter, $options: "i" } },
                        { lastname: { $regex: filter, $options: "i" } }
                    ]
                }
            ]
        }).select("-password")

        if (!allUsers) {
            return res.status(404).json({
                message: "No User found"
            })
        }

        return res.status(200).json({
            allUsers
        })



    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server Error"
        })

    }
}


export const userbalance = async (req, res) => {
    try {
        const userId = req.userId;
        const balance = await Balance.findOne({ userId })
        if (!balance) {
            return res.status(404).json({
                message: "Balance not found"
            })
        }

        return res.status(200).json({ amount: balance.balance })


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server Error"
        })
    }
}


export const transfer = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { amount, to } = req.body;
        const userId = req.userId;


        if (amount <= 0) {
            return res.status(400).json({
                message: "Invalid amount"
            });
        }


        const sender = await Balance.findOne({ userId }).session(session);

        if (!sender || sender.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

  
        const receiver = await Balance.findOne({ userId: to }).session(session);

        if (!receiver) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Receiver not found"
            });
        }

    
        await Balance.updateOne(
            { userId },
            { $inc: { balance: -amount } },
            { session }
        );

        await Balance.updateOne(
            { userId: to },
            { $inc: { balance: amount } },
            { session }
        );

        await session.commitTransaction();

        return res.status(200).json({
            message: "Transaction Successful"
        });

    } catch (error) {
        console.log(error);

        await session.abortTransaction();

        return res.status(500).json({
            message: "Server Error"
        });
    } finally {
        session.endSession();
    }
};