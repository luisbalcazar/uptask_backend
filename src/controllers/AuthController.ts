import { Request, Response } from "express";
import colors from "colors";
import User from "../models/User";
import { hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { transporter } from "../config/nodemailer";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      const userExists = await User.findOne({ email });

      if (userExists) {
        const error = new Error("El email ya está registrado");
        return res.status(409).json({ error: error.message });
      }

      const response = await User.create(req.body);

      if (!response) {
        const error = new Error("El usuario no pudo ser creado");
        return res.status(500).json({ error: error.message });
      }

      response.password = await hashPassword(password);

      const token = new Token();
      token.token = generateToken();
      token.user = response._id;

      await transporter.sendMail({
        from: "Uptask <admin@uptask.com>",
        to: response.email,
        subject: "Uptask - Confirmar cuenta",
        text: "Uptask - Confirma tu cuenta",
        html: `<p>Probando Email<p/>`,
      });

      await Promise.allSettled([response.save(), token.save()]);

      res.status(201).send("Usuario creado exitosamente");
    } catch (error) {
      console.error(
        colors.red(
          `Ha ocurrido un error en la creación del usuario: ${error.message}`,
        ),
      );
    }
  };
}
