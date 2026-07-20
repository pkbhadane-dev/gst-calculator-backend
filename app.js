import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import clientRouter from "./src/routes/client.routes.js";
import userRouter from "./src/routes/user.routes.js";
import invoiceRouter from "./src/routes/invoice.route.js";
import { catchError } from "./src/middlewares/catchError.middleware.js";
const app = express();

console.log("cors", cors());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/client", clientRouter);
app.use("/api/v1/invoice", invoiceRouter);

app.get("/", (req, res) => {
  res.send("Well-Come Home");
});

app.use(catchError);

export default app;
