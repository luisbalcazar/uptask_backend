import { transporter } from "../config/nodemailer";
import dotenv from "dotenv";

dotenv.config();

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "Uptask <admin@uptask.com>",
      to: user.email,
      subject: "Uptask - Confirmar cuenta",
      text: "Uptask - Confirma tu cuenta",
      html: `<p>Hola: ${user.name}, has creado tu cuenta en Uptasl. Ya casi esta todo listo, solo debes confirmar tu cuenta.<p/>
      <p>Visita el siguiente enlace: <p/>
      <a href="${process.env.CLIENT_URL}/auth/confirm-account">Confirmar cuenta</a>
      <p>E ingresa el codigo: <b>${user.token}</b><p/>
      <p>Este token expira en 10 minutos.<p/>`,
    });

    console.log("Mensaje Enviado", info.messageId);
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "Uptask <admin@uptask.com>",
      to: user.email,
      subject: "Uptask - Reestablecer Password",
      text: "Uptask - Reestablece tu Password",
      html: `<p>Hola: ${user.name}, has solicitado reestablecer tu password en Uptask.<p/>
      <p>Visita el siguiente enlace: <p/>
      <a href="${process.env.CLIENT_URL}/auth/new-password">Reestablecer password</a>
      <p>E ingresa el codigo: <b>${user.token}</b><p/>
      <p>Este token expira en 10 minutos.<p/>`,
    });

    console.log("Mensaje Enviado", info.messageId);
  };
}
