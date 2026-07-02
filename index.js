import dotenv, { configDotenv } from "dotenv";
dotenv.config();
import app from "./app.js";
import { connectDb } from "./src/db/connectDB.js";

const PORT = 3000;

connectDb
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on Port", PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
