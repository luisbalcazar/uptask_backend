import { Request, Response } from "express";
import colors from "colors";
import { hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import AuthService from "../services/AuthService";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      const userExists = await AuthService.getUserByEmail(email);

      if (userExists) {
        const error = new Error("El email ya está registrado");
        return res.status(409).json({ error: error.message });
      }

      const response = await AuthService.createUser(req.body);

      if (!response) {
        const error = new Error("El usuario no pudo ser creado");
        return res.status(500).json({ error: error.message });
      }

      response.password = await hashPassword(password);

      const token = new Token();
      token.token = generateToken();
      token.user = response._id;

      AuthEmail.sendConfirmationEmail({
        email: response.email,
        name: response.name,
        token: token.token,
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

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const response = await AuthService.tokenExists(token);

      if (!response) {
        const error = new Error("Token no valido");
        return res.status(401).json({ error: error.message });
      }

      const user = await AuthService.getUserById(response.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), response.deleteOne()]);
      res.status(200).send("Cuenta confirmada exitosamente!");
    } catch (error) {
      console.error(
        colors.red(
          `Ha ocurrido un error en la creación del usuario: ${error.message}`,
        ),
      );
    }
  };
}
