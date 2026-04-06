import { CorsOptions } from "cors";

//Habilitamos los Cors
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const whiteList = [process.env.CLIENT_URL];

    // Permitir requests sin origin (Postman, mismo origen, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
};
