import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// routes
import userRouter from "./Routes/userRoutes.js"

// dot env config
dotenv.config();

const app = express();

// cors
app.use(cors());
// body parser
app.use(express.json());

// Connect to MongoDB
const MONGOURL = process.env.MONGODB_URL;

main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(MONGOURL);
    console.log("Database connected");
  } catch (err) {
    console.error("Error while connecting DB:", err);
  }
}

// routes

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(4000, () => {
  console.log(`Server is running on port ${4000}`);
});
