import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("El nombre no puede ir vacío"),
  body("password")
    .notEmpty()
    .withMessage("La contraseña no puede ir vacío")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener minimo 8 caracteres")
    .matches(/\d/)
    .withMessage("La contraseña debe contener al menos un número"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error(
        "Las contraseñas no coinciden. Por favor, vuelve a ingresarlas.",
      );
    } else {
      return true;
    }
  }),
  body("email")
    .notEmpty()
    .withMessage("El email no puede ir vacío")
    .isEmail()
    .withMessage("Email no valido"),
  handleInputErrors,
  AuthController.createAccount,
);

router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("El token no puede ir vacío"),
  handleInputErrors,
  AuthController.confirmAccount,
);

export default router;
