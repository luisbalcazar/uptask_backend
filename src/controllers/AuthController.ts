import colors from "colors";
import { Request, Response } from "express";
import { AuthEmail } from "../emails/AuthEmail";
import AuthService from "../services/AuthService";
import { checkPassword, hashPassword } from "../utils/auth";

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

      const token = AuthService.createToken(response._id);

      AuthEmail.sendConfirmationEmail({
        email: response.email,
        name: response.name,
        token: token.token,
      });

      await Promise.allSettled([response.save(), token.save()]);

      res
        .status(201)
        .send(
          "Usuario creado exitosamente. Se ha enviado un mail de confirmación a su correo electrónico.",
        );
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

  static login = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      const user = await AuthService.getUserByEmail(email);

      if (!user) {
        const error = new Error(
          "Usuario o Contraseña incorrecta. Por favor, verifique sus credenciales",
        );
        return res.status(401).json({ error: error.message });
      }

      if (!user.confirmed) {
        const token = AuthService.createToken(user._id);

        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "La cuenta no ha sido confirmada. Por favor, verfique su cuenta con el mail que le hemos reenviado.",
        );
        return res.status(409).json({ error: error.message });
      }

      const isPasswordCorrect = await checkPassword(password, user.password);

      if (!isPasswordCorrect) {
        const error = new Error(
          "Usuario o Contraseña incorrecta. Por favor, verifique sus credenciales",
        );
        return res.status(401).json({ error: error.message });
      }

      res.status(200).send("Bienvedido!");
    } catch (error) {
      console.error(
        colors.red(
          `Ha ocurrido un error en la creación del usuario: ${error.message}`,
        ),
      );
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await AuthService.getUserByEmail(email);

      if (!user) {
        const error = new Error("El Usuario no se encuentra registrado");
        return res.status(404).json({ error: error.message });
      }

      if (user.confirmed) {
        const error = new Error("El Usuario ya se encuentra verificado");
        return res.status(403).json({ error: error.message });
      }

      const token = AuthService.createToken(user._id);

      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await token.save();

      res
        .status(200)
        .send("Se ha enviado un mail de confirmación a su correo electrónico.");
    } catch (error) {
      console.error(
        colors.red(
          `Ha ocurrido un error en la creación del usuario: ${error.message}`,
        ),
      );
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await AuthService.getUserByEmail(email);

      if (!user) {
        const error = new Error("El Usuario no se encuentra registrado");
        return res.status(404).json({ error: error.message });
      }

      const token = AuthService.createToken(user._id);
      await token.save();

      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res
        .status(200)
        .send("Se ha enviado un mail de confirmación a su correo electrónico.");
    } catch (error) {
      console.error(
        colors.red(
          `Ha ocurrido un error en la creación del usuario: ${error.message}`,
        ),
      );
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const response = await AuthService.tokenExists(token);

      if (!response) {
        const error = new Error("Token no valido");
        return res.status(401).json({ error: error.message });
      }

      res.status(200).send("Token válido. Defina su nuevo password.");
    } catch (error) {
      console.error(
        colors.red(
          `Ha ocurrido un error en la creación del usuario: ${error.message}`,
        ),
      );
    }
  };

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const tokenExists = await AuthService.tokenExists(token);

      if (!tokenExists) {
        const error = new Error("Token no valido");
        return res.status(401).json({ error: error.message });
      }

      const user = await AuthService.getUserById(tokenExists._id);

      if (!user) {
        const error = new Error("El Usuario no se encuentra registrado");
        return res.status(404).json({ error: error.message });
      }

      user.password = await hashPassword(password);

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

      res.status(200).send("Password actualizado exitosamente!");
    } catch (error) {
      console.error(
        colors.red(
          `Ha ocurrido un error en la creación del usuario: ${error.message}`,
        ),
      );
    }
  };
}
