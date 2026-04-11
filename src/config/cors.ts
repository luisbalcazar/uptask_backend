import { CorsOptions } from "cors";

//Habilitamos los Cors
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const whiteList = [process.env.CLIENT_URL];

    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
};
