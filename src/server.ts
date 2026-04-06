import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db";
import projectRoutes from "./routes/projectRoutes";
import { corsOptions } from "./config/cors";

dotenv.config();

connectDB();

const app = express();

//Cors
app.use(cors(corsOptions));

//Logger
app.use(morgan("common"));

//Habilitar la lectura de formato json en metodos de express
app.use(express.json());

//Routes
app.use("/api/projects", projectRoutes);

export default app;
