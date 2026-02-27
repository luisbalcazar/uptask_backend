import mongoose from "mongoose";
import colors from "colors";
import { exit } from "node:process";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DATABASE_URL);
    const url = `${connection.host}: ${connection.port}`;
    console.log(colors.magenta(`MongoDB conectado en: ${url}`));
  } catch (error) {
    console.error(colors.red("Error al conectar a la BD"));
    exit(1); //Esto termina la conexion con un mensaje de error
  }
};
