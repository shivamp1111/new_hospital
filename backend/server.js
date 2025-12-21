import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000

// Connect to database and cloudinary
connectDB().catch(err => {
    console.error("Failed to connect to database:", err)
    process.exit(1)
})
connectCloudinary()

// middlewares
app.use(express.json())
const allowedOrigins = [
  "https://new-hospital-peach.vercel.app/", // Your Vercel URL
  "http://localhost:5173" // Keep this for local development
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))