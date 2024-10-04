import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import registerRouter from './routes/register';
import {logAction, logInternalError} from "./utils/logger";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// MongoDB connection
const dbConnectionString = process.env.CONNECTION_STRING;

mongoose.connect(dbConnectionString as string)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    logInternalError("Error connecting to MongoDB:" + error).then();
  });

app.use(express.json());

app.use('/api', registerRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  logAction(`[server]: Server is running at http://localhost:${port}`).then();
});
