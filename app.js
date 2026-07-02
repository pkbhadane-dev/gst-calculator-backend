import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import clientRouter from "./src/routes/client.routes";
import userRouter from "./src/routes/user.routes";
import invoiceRouter from "./src/routes/invoice.route";
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/client", clientRouter);
app.use("/api/v1/invoice", invoiceRouter);

app.get("/", (req, res) => {
  res.send("Well-Come Home");
});


export default app;
