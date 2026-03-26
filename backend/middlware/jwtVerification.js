import jwt from "jsonwebtoken";

const jwtVerification = (req, res, next) => {
    try {
        const tokenHeader = req.headers.authorization
        if (!tokenHeader) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        if (!tokenHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Token missing"
            })
        }
        const token = tokenHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Token missing"
            })

        }
        const jwtPassword = process.env.JWT_SECRET;

        const decode = jwt.verify(token, jwtPassword)
        if (decode.userId) {
            req.userId = decode.userId
            req.email = decode.email
            next();
        } else {
            return res.status(403).json({ message: "Unauthorized" })
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}

export default jwtVerification;