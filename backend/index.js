import express from "express"
import dotenv from "dotenv"
import dns from "dns"
import dbConfig from "./config/dbConfig.js"
import authRoutes from './routes/authRoutes.js'
import accountRoutes from "./routes/accountRoute.js"
import cors from "cors"
dns.setServers(["1.1.1.1", "8.8.8.8"])
dns.setDefaultResultOrder("ipv4first")

dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());

dbConfig();


app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/account", accountRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("The Server is Running at Port", port);

})